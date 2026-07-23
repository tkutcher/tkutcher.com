#!/usr/bin/env bash
#
# Copied from dicorp-tools (with CTO approval)
#
# az-storage-replace-dir.sh
#
# Replace the contents of a directory (prefix) within an Azure Storage blob
# container with the contents of a local directory: delete the existing blobs
# under the destination prefix, then upload the local directory in their place.
# Typical use is publishing a built static site to the `$web` container.
#
# Auth: pass -k <key> for shared-key auth (--auth-mode key), or omit -k to use the
# logged-in identity (--auth-mode login) — e.g. a CI service principal / managed
# identity granted the Storage Blob Data Contributor role.

set -e

usage() {
  cat <<'EOF'
Usage: az-storage-replace-dir -n <account> -s <src-dir> [-k <key>] [-d <dest-dir>] [-c <container>]

Replace the blobs under a destination prefix in an Azure Storage container with
the contents of a local directory (delete-then-upload).

Required:
  -n <account>     Azure Storage account name.
  -s <src-dir>     Local directory whose contents are uploaded.

Optional:
  -k <key>         Storage account access key (use a CI/secret variable; never
                   hardcode). Authenticates with --auth-mode key. If omitted, the
                   logged-in identity is used (--auth-mode login) — requires a
                   prior `az login` with the Storage Blob Data Contributor role.
  -d <dest-dir>    Destination path/prefix within the container. Trailing slash
                   is trimmed. Defaults to the container root (replaces the
                   whole container).
  -c <container>   Target blob container. Defaults to '$web' (the static-website
                   container).
  -h               Show this help and exit.

Examples:
  # Key auth: replace the entire $web container with ./dist
  az-storage-replace-dir -n mystorage -k "$ACCESS_KEY" -s ./dist

  # Login auth (service principal / managed identity): replace $web with ./dist
  az-storage-replace-dir -n mystorage -s ./dist

  # Replace only the 'docs' prefix in the 'assets' container
  az-storage-replace-dir -n mystorage -k "$ACCESS_KEY" -s ./build -d docs -c assets
EOF
}

ACCESS_KEY=""
DEST_DIR=""
CONTAINER="\$web"

while getopts "n:k:s:d:c:h" opt; do
  case $opt in
    n) ACCOUNT_NAME=${OPTARG} ;;            # required - storage account name
    k) ACCESS_KEY=${OPTARG} ;;              # optional - access key (else login auth)
    s) SRC_DIR=${OPTARG} ;;                 # required - local directory to upload
    d) DEST_DIR=${OPTARG%/} ;;              # optional - dest prefix (trailing / trimmed)
    c) CONTAINER=${OPTARG} ;;               # optional - container (default: $web)
    h) usage; exit 0 ;;
    *) usage >&2; exit 1 ;;                 # unknown option / missing value
  esac
done

if [ -z "$ACCOUNT_NAME" ] || [ -z "$SRC_DIR" ]; then
  echo "error: -n (account) and -s (src-dir) are required." >&2
  echo >&2
  usage >&2
  exit 1
fi

# Shared-key auth when -k is given; otherwise the logged-in identity.
if [ -n "$ACCESS_KEY" ]; then
  AUTH=(--auth-mode key --account-key "$ACCESS_KEY")
else
  AUTH=(--auth-mode login)
fi

if [ "$DEST_DIR" = "" ]; then
  PATTERN="*"
else
  PATTERN="${DEST_DIR}/*"
fi

echo "Replacing '${DEST_DIR:-<root>}' in container '${CONTAINER}' with contents from '${SRC_DIR}'"

echo "removing old contents..."
az storage blob delete-batch \
  --account-name "${ACCOUNT_NAME}" \
  "${AUTH[@]}" \
  --source "${CONTAINER}" \
  --pattern "${PATTERN}"

echo "uploading new contents..."
az storage blob upload-batch \
  --account-name "${ACCOUNT_NAME}" \
  "${AUTH[@]}" \
  --source "${SRC_DIR}" \
  --destination "${CONTAINER}" \
  --destination-path "${DEST_DIR}"
echo "done."
