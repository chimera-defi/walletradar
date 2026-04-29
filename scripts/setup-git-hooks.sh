#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

git config core.hooksPath .githooks

echo "Configured git hooks path: $(git config --get core.hooksPath)"
echo "Local hooks now enforce commit format and block direct pushes to main/master."
