#!/usr/bin/env bash
##
## This script installs all the tools needed for CI
##
(
  cd "$(dirname "$0")/.." || exit
  set -euo pipefail

  echo "Installing tools"
  sudo apt-get update
  sudo apt-get install -y shellcheck
  npm install -g markdownlint-cli ngrok
  sudo apt-get install -y python3
  sudo apt install -y python3-pip
  pip3 install -r scripts/requirements-dev.txt
  curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
  curl -sSfL "https://git.io/getwoke" | \
    bash -s -- -b /usr/local/bin
  echo "Installed dev requirements"

)
