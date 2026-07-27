#!/usr/bin/env python3

"""Generate the public reading list from allowlisted Obsidian frontmatter."""

from __future__ import annotations

import argparse
from difflib import SequenceMatcher
from io import BytesIO
import json
import os
import re
import sys
import unicodedata
from pathlib import Path
from typing import Any
from urllib.parse import urlencode, urlparse
from urllib.request import Request, urlopen


SCRIPT_DIR = Path(__file__).resolve().parent
DEFAULT_OUTPUT = SCRIPT_DIR.parent / "src" / "reading" / "reading-list.json"
DEFAULT_COVER_CACHE = SCRIPT_DIR.parent / "src" / "assets" / "reading" / "covers"
DEFAULT_TAG = "reading_list"
DEFAULT_PUBLISH_PROPERTY = "publish_to_tkutcher_com"
USER_AGENT = "tkutcher.com reading-list importer (https://tkutcher.com)"


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Build the public reading list from allowlisted Obsidian "
            "frontmatter. Markdown note bodies are never used."
        )
    )
    parser.add_argument(
        "--vault",
        default=os.environ.get("TK_READING_VAULT", ""),
        help=(
            "Obsidian sources directory. May also be supplied with the "
            "TK_READING_VAULT environment variable."
        ),
    )
    parser.add_argument(
        "--output",
        default=str(DEFAULT_OUTPUT),
        help="Generated JSON path. Default: src/reading/reading-list.json",
    )
    parser.add_argument(
        "--tag",
        default=DEFAULT_TAG,
        help="Required frontmatter tag. Default: reading_list",
    )
    parser.add_argument(
        "--publish-property",
        default=DEFAULT_PUBLISH_PROPERTY,
        help=(
            "Required true frontmatter property. "
            "Default: publish_to_tkutcher_com"
        ),
    )
    parser.add_argument(
        "--lookup-covers",
        action="store_true",
        help=(
            "Send book title/author metadata to Open Library to find missing "
            "public cover images."
        ),
    )
    parser.add_argument(
        "--refresh-covers",
        action="store_true",
        help="Ignore cached cover matches and look them up again.",
    )
    parser.add_argument(
        "--write-cover-frontmatter",
        action="store_true",
        help=(
            "Add matched cover URLs to eligible source notes as cover_url. "
            "No note-body content is changed."
        ),
    )
    parser.add_argument(
        "--cover-overrides",
        help=(
            "Optional JSON object mapping generated book slugs to explicit "
            "HTTP(S) cover URLs."
        ),
    )
    parser.add_argument(
        "--book-overrides",
        help=(
            "Optional JSON object mapping source book slugs to title, author, "
            "and/or coverUrl overrides."
        ),
    )
    parser.add_argument(
        "--write-book-frontmatter",
        action="store_true",
        help=(
            "Save book override metadata and matched cover URLs to eligible "
            "source notes. No note-body content is changed."
        ),
    )
    parser.add_argument(
        "--cache-covers",
        action="store_true",
        help=(
            "Download remote covers and save optimized 2:3 WebP images in the "
            "site. Requires Pillow."
        ),
    )
    parser.add_argument(
        "--cover-cache-directory",
        default=str(DEFAULT_COVER_CACHE),
        help=(
            "Directory for optimized local covers. "
            "Default: src/assets/reading/covers"
        ),
    )
    parser.add_argument(
        "--cover-cache-width",
        type=int,
        default=400,
        help="Optimized cover width in pixels. Default: 400",
    )
    parser.add_argument(
        "--refresh-cover-cache",
        action="store_true",
        help="Redownload and rebuild existing optimized cover files.",
    )

    arguments = parser.parse_args()
    if not arguments.vault:
        parser.error(
            "a vault sources directory is required; pass --vault <path> "
            "or set TK_READING_VAULT"
        )
    if arguments.refresh_covers and not arguments.lookup_covers:
        parser.error("--refresh-covers requires --lookup-covers")
    if arguments.refresh_cover_cache and not arguments.cache_covers:
        parser.error("--refresh-cover-cache requires --cache-covers")
    if arguments.cover_cache_width < 100:
        parser.error("--cover-cache-width must be at least 100")

    arguments.vault = Path(arguments.vault).expanduser().resolve()
    arguments.output = Path(arguments.output).expanduser().resolve()
    arguments.cover_cache_directory = (
        Path(arguments.cover_cache_directory).expanduser().resolve()
    )
    if arguments.cover_overrides:
        arguments.cover_overrides = (
            Path(arguments.cover_overrides).expanduser().resolve()
        )
    if arguments.book_overrides:
        arguments.book_overrides = (
            Path(arguments.book_overrides).expanduser().resolve()
        )
    arguments.tag = arguments.tag.removeprefix("#")
    return arguments


def find_markdown_files(directory: Path) -> list[Path]:
    return sorted(
        (path for path in directory.rglob("*") if path.is_file() and path.suffix.lower() == ".md"),
        key=lambda path: str(path).casefold(),
    )


def read_frontmatter_lines(file_path: Path) -> list[str]:
    lines: list[str] = []
    found_closing_delimiter = False

    with file_path.open("r", encoding="utf-8") as source:
        first_line = source.readline()
        if first_line.strip() != "---":
            return []

        for line in source:
            if line.strip() == "---":
                found_closing_delimiter = True
                break

            lines.append(line.rstrip("\r\n"))
            if len(lines) > 500:
                raise ValueError(
                    f"Frontmatter exceeds 500 lines in {file_path.name}"
                )

    return lines if found_closing_delimiter else []


def strip_wrapping_quotes(value: str) -> str:
    trimmed = value.strip()
    if len(trimmed) >= 2 and (
        (trimmed.startswith('"') and trimmed.endswith('"'))
        or (trimmed.startswith("'") and trimmed.endswith("'"))
    ):
        return trimmed[1:-1]
    return trimmed


def parse_scalar(value: str) -> str | list[str]:
    unquoted = strip_wrapping_quotes(value)
    if unquoted.startswith("[") and unquoted.endswith("]"):
        return [
            strip_wrapping_quotes(item)
            for item in unquoted[1:-1].split(",")
            if strip_wrapping_quotes(item)
        ]
    return unquoted


def parse_frontmatter(lines: list[str]) -> dict[str, Any]:
    properties: dict[str, Any] = {}
    active_list = ""

    for line in lines:
        list_item = re.match(r"^\s+-\s+(.+?)\s*$", line)
        if list_item and active_list:
            properties[active_list].append(parse_scalar(list_item.group(1)))
            continue

        prop = re.match(r"^([A-Za-z0-9_-]+):(?:\s*(.*))?$", line)
        if not prop:
            active_list = ""
            continue

        key, raw_value = prop.group(1), prop.group(2) or ""
        if not raw_value.strip():
            properties[key] = []
            active_list = key
        else:
            properties[key] = parse_scalar(raw_value)
            active_list = ""

    return properties


def is_truthy(value: Any) -> bool:
    if value is True:
        return True
    if isinstance(value, list):
        return False
    return str(value).strip().lower() in {"true", "yes", "on", "1", "checked"}


def has_tag(value: Any, required_tag: str) -> bool:
    normalized_tag = required_tag.removeprefix("#").lower()
    values = value if isinstance(value, list) else [value]
    return any(
        str(tag or "").removeprefix("#").strip().lower() == normalized_tag
        for tag in values
    )


def infer_title_and_author(
    file_path: Path, properties: dict[str, Any]
) -> tuple[str, str]:
    stem = file_path.stem
    inferred_title, separator, inferred_author = stem.rpartition(" - ")
    if not separator:
        inferred_title, inferred_author = stem, ""

    return (
        str(properties.get("title") or inferred_title).strip(),
        str(properties.get("author") or inferred_author).strip(),
    )


def ascii_text(value: str) -> str:
    return "".join(
        character
        for character in unicodedata.normalize("NFKD", value)
        if not unicodedata.combining(character)
    )


def create_slug(value: str) -> str:
    normalized = ascii_text(value).lower().replace("&", " and ")
    return re.sub(r"^-|-$", "", re.sub(r"[^a-z0-9]+", "-", normalized))


def normalize_title(value: Any) -> str:
    normalized = ascii_text(str(value or "")).lower()
    normalized = re.sub(r"^(a|an|the)\s+", "", normalized)
    return re.sub(r"[^a-z0-9]+", " ", normalized).strip()


def author_last_name(value: Any) -> str:
    words = re.findall(r"[a-z0-9]+", ascii_text(str(value or "")).lower())
    return words[-1] if words else ""


def is_http_url(value: Any) -> bool:
    try:
        parsed = urlparse(str(value or ""))
        return parsed.scheme in {"http", "https"} and bool(parsed.netloc)
    except ValueError:
        return False


def load_existing_books(output_path: Path) -> dict[str, dict[str, Any]]:
    try:
        existing = json.loads(output_path.read_text(encoding="utf-8"))
        return {
            book["slug"]: book
            for book in existing.get("books", [])
            if isinstance(book, dict) and book.get("slug")
        }
    except (FileNotFoundError, json.JSONDecodeError, OSError):
        return {}


def load_cover_overrides(override_path: Path | None) -> dict[str, str]:
    if not override_path:
        return {}

    try:
        overrides = json.loads(override_path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError, OSError) as error:
        raise ValueError(f"Could not read cover overrides: {error}") from error

    if not isinstance(overrides, dict):
        raise ValueError("Cover overrides must be a JSON object")

    invalid_slugs = [
        str(slug) for slug, cover_url in overrides.items() if not is_http_url(cover_url)
    ]
    if invalid_slugs:
        raise ValueError(
            "Cover overrides contain invalid URLs for: "
            + ", ".join(sorted(invalid_slugs))
        )

    return {str(slug): str(cover_url) for slug, cover_url in overrides.items()}


def load_book_overrides(override_path: Path | None) -> dict[str, dict[str, str]]:
    if not override_path:
        return {}

    try:
        overrides = json.loads(override_path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError, OSError) as error:
        raise ValueError(f"Could not read book overrides: {error}") from error

    if not isinstance(overrides, dict):
        raise ValueError("Book overrides must be a JSON object")

    allowed_fields = {"title", "author", "coverUrl"}
    normalized: dict[str, dict[str, str]] = {}
    for slug, values in overrides.items():
        if not isinstance(values, dict):
            raise ValueError(f"Book override for {slug} must be an object")
        unexpected_fields = set(values) - allowed_fields
        if unexpected_fields:
            raise ValueError(
                f"Book override for {slug} contains unsupported fields: "
                + ", ".join(sorted(unexpected_fields))
            )
        if values.get("coverUrl") and not is_http_url(values["coverUrl"]):
            raise ValueError(f"Book override for {slug} has an invalid coverUrl")
        normalized[str(slug)] = {
            str(key): str(value)
            for key, value in values.items()
            if value is not None
        }

    return normalized


def fetch_json(url: str) -> dict[str, Any]:
    request = Request(
        url,
        headers={"Accept": "application/json", "User-Agent": USER_AGENT},
    )
    with urlopen(request, timeout=10) as response:
        return json.loads(response.read().decode("utf-8"))


def search_open_library(title: str, author: str = "") -> list[dict[str, Any]]:
    parameters = {
        "title": title,
        "fields": "key,title,author_name,cover_i",
        "limit": "8",
    }
    if author:
        parameters["author"] = author

    result = fetch_json(f"https://openlibrary.org/search.json?{urlencode(parameters)}")
    return [
        document for document in result.get("docs", []) if document.get("cover_i")
    ]


def find_cover_match(
    documents: list[dict[str, Any]], book: dict[str, Any]
) -> dict[str, Any] | None:
    if not documents:
        return None

    normalized_book_title = normalize_title(book["title"])
    last_name = author_last_name(book["author"])
    exact_title_matches = [
        document
        for document in documents
        if normalize_title(document.get("title")) == normalized_book_title
    ]
    exact_author_match = next(
        (
            document
            for document in exact_title_matches
            if not last_name
            or any(
                author_last_name(author) == last_name
                for author in document.get("author_name", [])
            )
        ),
        None,
    )
    if exact_author_match:
        return exact_author_match
    if exact_title_matches:
        return exact_title_matches[0]

    return next(
        (
            document
            for document in documents
            if (
                not last_name
                or any(
                    author_last_name(author) == last_name
                    for author in document.get("author_name", [])
                )
            )
            and SequenceMatcher(
                None, normalized_book_title, normalize_title(document.get("title"))
            ).ratio()
            >= 0.88
        ),
        None,
    )


def lookup_open_library_cover(book: dict[str, Any]) -> dict[str, str]:
    documents = search_open_library(book["title"], book["author"])
    match = find_cover_match(documents, book)

    # A typo in the local author metadata should not prevent an otherwise exact
    # title match. Retry without the author filter, while retaining strict title
    # matching and a high-confidence author-aware fuzzy fallback.
    if not match and book["author"]:
        documents = search_open_library(book["title"])
        match = find_cover_match(documents, book)

    if not match:
        return {}

    return {
        "coverUrl": (
            "https://covers.openlibrary.org/b/id/"
            f"{match['cover_i']}-M.jpg?default=false"
        ),
        "openLibraryUrl": (
            f"https://openlibrary.org{match['key']}" if match.get("key") else ""
        ),
    }


def write_frontmatter_properties(
    file_path: Path, updates: dict[str, str]
) -> bool:
    data = file_path.read_bytes()
    line_ending = b"\r\n" if data.startswith(b"---\r\n") else b"\n"
    opening_delimiter = b"---" + line_ending
    if not data.startswith(opening_delimiter):
        raise ValueError(f"Missing frontmatter opening delimiter in {file_path.name}")

    closing_delimiter = line_ending + b"---"
    closing_index = data.find(closing_delimiter, len(opening_delimiter))
    if closing_index < 0:
        raise ValueError(f"Missing frontmatter closing delimiter in {file_path.name}")

    frontmatter = data[len(opening_delimiter) : closing_index]
    changed = False
    for key, value in updates.items():
        if not re.fullmatch(r"[A-Za-z0-9_-]+", key):
            raise ValueError(f"Invalid frontmatter property name: {key}")

        property_line = f"{key}: {value}".encode("utf-8")
        existing_property = re.search(
            rb"(?m)^" + re.escape(key.encode("utf-8")) + rb":[^\r\n]*(?:\r?\n|$)",
            frontmatter,
        )

        if existing_property:
            current_line = existing_property.group(0).rstrip(b"\r\n")
            if current_line == property_line:
                continue
            replacement = property_line + (
                line_ending
                if existing_property.group(0).endswith((b"\n", b"\r"))
                else b""
            )
            frontmatter = (
                frontmatter[: existing_property.start()]
                + replacement
                + frontmatter[existing_property.end() :]
            )
        else:
            if frontmatter and not frontmatter.endswith(line_ending):
                frontmatter += line_ending
            frontmatter += property_line
        changed = True

    if not changed:
        return False

    file_path.write_bytes(
        opening_delimiter + frontmatter + data[closing_index:]
    )
    return True


def cache_cover_image(
    cover_url: str, destination: Path, width: int
) -> None:
    try:
        from PIL import Image, ImageOps
    except ImportError as error:
        raise ValueError(
            "Cover caching requires Pillow. Install it with "
            "`python3 -m pip install Pillow`."
        ) from error

    request = Request(
        cover_url,
        headers={"Accept": "image/*", "User-Agent": USER_AGENT},
    )
    with urlopen(request, timeout=20) as response:
        image_bytes = response.read()

    with Image.open(BytesIO(image_bytes)) as source:
        source.seek(0)
        image = ImageOps.exif_transpose(source)
        has_transparency = (
            "A" in image.getbands() or "transparency" in image.info
        )
        image = image.convert("RGBA" if has_transparency else "RGB")
        image = ImageOps.fit(
            image,
            (width, round(width * 1.5)),
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        )

        destination.parent.mkdir(parents=True, exist_ok=True)
        temporary_path = destination.with_suffix(".tmp.webp")
        image.save(
            temporary_path,
            format="WEBP",
            quality=82,
            method=6,
        )
        temporary_path.replace(destination)


def apply_cover_cache(
    books: list[dict[str, Any]], options: argparse.Namespace
) -> int:
    downloaded_count = 0

    for book in books:
        destination = options.cover_cache_directory / f"{book['slug']}.webp"
        remote_cover_url = book.get("coverUrl", "")

        if (
            options.cache_covers
            and is_http_url(remote_cover_url)
            and (options.refresh_cover_cache or not destination.is_file())
        ):
            try:
                cache_cover_image(
                    remote_cover_url,
                    destination,
                    options.cover_cache_width,
                )
                downloaded_count += 1
            except Exception as error:
                print(
                    f'Cover download failed for "{book["title"]}": {error}',
                    file=sys.stderr,
                )

        if destination.is_file():
            book["coverUrl"] = Path(
                os.path.relpath(destination, start=options.output.parent)
            ).as_posix()

    return downloaded_count


def build_reading_list(options: argparse.Namespace) -> None:
    if not options.vault.is_dir():
        raise ValueError(f"Vault sources directory does not exist: {options.vault}")

    existing_books = load_existing_books(options.output)
    cover_overrides = load_cover_overrides(options.cover_overrides)
    book_overrides = load_book_overrides(options.book_overrides)
    books: list[dict[str, Any]] = []
    updated_frontmatter_count = 0

    for file_path in find_markdown_files(options.vault):
        properties = parse_frontmatter(read_frontmatter_lines(file_path))
        if not has_tag(properties.get("tags"), options.tag):
            continue
        if not is_truthy(properties.get(options.publish_property)):
            continue

        is_currently_reading = is_truthy(properties.get("currently_reading"))
        is_read = is_truthy(properties.get("read"))
        if not is_currently_reading and not is_read:
            continue

        source_title, source_author = infer_title_and_author(file_path, properties)
        source_slug = create_slug(f"{source_title}-{source_author}")
        book_override = book_overrides.get(source_slug, {})
        title = book_override.get("title", source_title)
        author = book_override.get("author", source_author)
        if not title:
            continue

        slug = create_slug(f"{title}-{author}")
        cached_book = existing_books.get(slug, existing_books.get(source_slug, {}))
        frontmatter_cover = properties.get("cover_url") or properties.get("cover")
        explicit_cover = (
            book_override.get("coverUrl", "")
            or cover_overrides.get(source_slug, "")
            or cover_overrides.get(slug, "")
        )
        book = {
            "slug": slug,
            "title": title,
            "author": author,
            "status": "currently-reading" if is_currently_reading else "read",
            "coverUrl": (
                explicit_cover
                or (str(frontmatter_cover) if is_http_url(frontmatter_cover) else "")
            ),
            "openLibraryUrl": "",
        }

        if not book["coverUrl"] and not options.refresh_covers:
            book["coverUrl"] = cached_book.get("coverUrl", "")
            book["openLibraryUrl"] = cached_book.get("openLibraryUrl", "")

        if not book["coverUrl"] and options.lookup_covers:
            try:
                book.update(lookup_open_library_cover(book))
            except Exception as error:
                print(
                    f'Cover lookup failed for "{book["title"]}": {error}',
                    file=sys.stderr,
                )

        if book["coverUrl"] and (
            options.write_cover_frontmatter or options.write_book_frontmatter
        ):
            frontmatter_updates = {"cover_url": book["coverUrl"]}
            if options.write_book_frontmatter:
                if "title" in book_override:
                    frontmatter_updates["title"] = title
                if "author" in book_override:
                    frontmatter_updates["author"] = author
            if write_frontmatter_properties(file_path, frontmatter_updates):
                updated_frontmatter_count += 1

        books.append(book)

    if not books:
        raise ValueError(
            f"No publishable reading-list entries were found in {options.vault}. "
            "Refusing to overwrite the output."
        )

    books.sort(
        key=lambda book: (
            0 if book["status"] == "currently-reading" else 1,
            book["title"].casefold(),
        )
    )
    downloaded_cover_count = apply_cover_cache(books, options)
    output = {"schemaVersion": 1, "books": books}

    options.output.parent.mkdir(parents=True, exist_ok=True)
    options.output.write_text(
        f"{json.dumps(output, ensure_ascii=False, indent=2)}\n",
        encoding="utf-8",
    )

    current_count = sum(
        book["status"] == "currently-reading" for book in books
    )
    cover_count = sum(bool(book["coverUrl"]) for book in books)
    print(
        f"Wrote {len(books)} books ({current_count} currently reading, "
        f"{cover_count} covers) to {options.output}"
    )
    if options.write_cover_frontmatter or options.write_book_frontmatter:
        print(
            f"Added or updated frontmatter in {updated_frontmatter_count} "
            "published source notes"
        )
    if options.cache_covers:
        print(
            f"Downloaded and optimized {downloaded_cover_count} cover images "
            f"at {options.cover_cache_width}×{round(options.cover_cache_width * 1.5)}"
        )


def main() -> int:
    try:
        build_reading_list(parse_arguments())
        return 0
    except (OSError, ValueError) as error:
        print(f"reading-list: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
