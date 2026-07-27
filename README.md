# tkutcher.com

Source code for https://tkutcher.com

[![pipeline status](https://gitlab.com/tkutcher/tkutcher-com/badges/master/pipeline.svg)](https://gitlab.com/tkutcher/tkutcher-com/-/commits/master)
![license](https://img.shields.io/github/license/tkutcher/tkutcher.com)

## Reading list

The public reading list is generated from allowlisted Obsidian frontmatter. The
importer includes only notes tagged `reading_list` with
`publish_to_tkutcher_com: true` that are marked `read` or
`currently_reading`. Note bodies, source paths, and private notes are not
included in the generated data.

Run the importer by passing the vault's sources directory:

```sh
python3 scripts/build_reading_list.py --vault /path/to/vault/kb/sources
```

The vault path can also be supplied with `TK_READING_VAULT`. Generated data is
written to `src/reading/reading-list.json`. Existing cover matches are reused.
Cover lookup is opt-in because it sends the public book title and author to Open
Library: use `--lookup-covers`, optionally with `--refresh-covers`, when that is
appropriate. Add `--write-cover-frontmatter` to save matched URLs back to only
the eligible published source notes as `cover_url`. For a title Open Library
cannot match, `--cover-overrides /path/to/overrides.json` accepts a JSON object
mapping a generated book slug to an explicit HTTP(S) cover URL.
`--book-overrides /path/to/overrides.json` accepts objects containing `title`,
`author`, and/or `coverUrl`; pair it with `--write-book-frontmatter` to save
those corrections to the eligible source notes. Run
`python3 scripts/build_reading_list.py --help` for all options.

To avoid loading covers from third-party hosts in the browser, install Pillow
and build optimized local cover assets:

```sh
python3 -m pip install Pillow
python3 scripts/build_reading_list.py \
  --vault /path/to/vault/kb/sources \
  --cache-covers
```

This creates 400×600 WebP files in `src/assets/reading/covers` and writes paths
relative to the generated JSON. Existing local covers are reused; add
`--refresh-cover-cache` after changing a source cover.
