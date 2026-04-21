
set -e

DEST_DIR=""
CONTAINER="\$web"


while getopts "n:k:s:d:c:" opt; do
  case $opt in
    n) # required - the storage account name
      ACCOUNT_NAME=${OPTARG};
      ;;
    k) # required - the access key
      ACCESS_KEY=${OPTARG}
      ;;
    s) # required - the directory being upload
      SRC_DIR=${OPTARG}
      ;;
    d) # optional - the directory in the storage account (defaults to the root)
      DEST_DIR=${OPTARG%/}  # trim trailing slash.
      ;;
    c)
      CONTAINER=${OPTARG}
      ;;
    *)
       echo "No provided value: $OPTARG"
       ;;
  esac
done

if [ -z "$ACCOUNT_NAME" ] || [ -z "$ACCESS_KEY" ] || [ -z "$SRC_DIR" ]; then
  echo "Parameters -n, -k, and -s are all required!";
  exit 1
fi

if [ "$DEST_DIR" = "" ]; then
  PATTERN="*"
else
  PATTERN="${DEST_DIR}/*"
fi

echo "Replacing ${DEST_DIR} in ${CONTAINER} with contents from ${SRC_DIR}"

echo "removing old contents..."
az storage blob delete-batch \
  --account-name "${ACCOUNT_NAME}" \
  --auth-mode key \
  --account-key "${ACCESS_KEY}" \
  --source "${CONTAINER}" \
  --pattern "${PATTERN}"

echo "uploading new contents..."
az storage blob upload-batch \
  --account-name "${ACCOUNT_NAME}" \
  --auth-mode key \
  --account-key "${ACCESS_KEY}" \
  --source "${SRC_DIR}" \
  --destination "${CONTAINER}" \
  --destination-path "${DEST_DIR}"
echo "done."
