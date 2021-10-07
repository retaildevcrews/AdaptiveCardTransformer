#!/usr/bin/env bash
##
(
  # ***********************************************
  # Detects secrets in the repo based on heuristics
  # Assumes initial baseline has been captured (and committed to repo)
  # via the following command:
  # detect-secrets scan > .secrets.baseline

  # To update Baseline run:
  # detect-secrets scan --baseline .secrets.baseline
  # ***********************************************
  # shellcheck disable=SC2046
  detect-secrets-hook --baseline .secrets.baseline $(git diff --staged --name-only)
  echo "Detect-Secrets passed"
)
