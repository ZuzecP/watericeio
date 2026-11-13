#!/bin/sh
# Fail when a file in the tree contains something personal.
# Usage: check-public.sh [ROOT]   (default: the repository root)
# Exit 0 when clean; exit 1 and one "path:line: label" line per hit.
# Skips .git/, the local-only folders and this file, which holds the patterns.

ROOT=${1:-$(cd "$(dirname "$0")/.." && pwd)}
cd "$ROOT" || exit 2

found=0
check() {
    label=$1
    pattern=$2
    hits=$(grep -rnIiE \
        --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=.superpowers \
        --exclude-dir=.remember --exclude-dir=plans --exclude-dir=specs --exclude-dir=handovers \
        --exclude=check-public.sh \
        -e "$pattern" . 2>/dev/null |
        sed -E "s|^\./||; s|^([^:]*):([0-9]+):.*|\1:\2: $label|")
    if [ -n "$hits" ]; then
        printf '%s\n' "$hits"
        found=1
    fi
}

check "home path" '/Users/'
check "gmail address" '@gmail\.com'

exit "$found"
