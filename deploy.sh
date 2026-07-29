#!/usr/bin/env bash
set -e
read -rp "commit message: " msg
npm run build
git add -A
git commit -m "$msg"
git push