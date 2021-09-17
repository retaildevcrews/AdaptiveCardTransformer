#!/usr/bin/env bash
##
## This script runs the CI steps
##

(
  cd "$(dirname "$0")/.." || exit
  set -euo pipefail

  function find_files () {
    local filetype
    filetype="${1}"

    find . -type f -name "$filetype" ! -path "*/node_modules/*" ! -path ".git/*" -print0
  }

  echo "Running checks:"
  # Populate environment variables into the bash
  while read -r LINE; do export "${LINE?}"; done < .env

  # Run Woke (https://github.com/get-woke/woke) with default ruleset
  woke --exit-1-on-failure
  echo "Woke passed (default rules applied)"

  # Eslint
  npm run --silent lint
  echo "Eslint passed"

  # Shellcheck
  find_files "*.sh" | xargs -0 -r shellcheck
  echo "Shellcheck passed"

  # Markdownlint
  find_files "*.md" | xargs -0 -r markdownlint
  echo "Markdownlint passed"

  # Detect secrets
  ./scripts/detect-secrets.sh
)
