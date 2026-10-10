#!/bin/bash
# Wallet GitHub Activity Refresh Script
# 
# This script queries the GitHub API to get the latest commit dates
# and activity status for all tracked wallet repositories.
#
# Usage:
#   ./refresh-github-data.sh                    # Output to stdout
#   ./refresh-github-data.sh --json             # Output as JSON
#   ./refresh-github-data.sh --markdown         # Output as Markdown table
#
# Requirements:
#   - curl
#   - jq
#   - (optional) GITHUB_TOKEN environment variable for higher rate limits
#
# Rate limits:
#   - Without token: 60 requests/hour (API only)
#   - With token: 5000 requests/hour

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOFTWARE_TABLE="$SCRIPT_DIR/../SOFTWARE_WALLETS.md"

load_repos_from_table() {
    python3 - "$SOFTWARE_TABLE" <<'PY'
import pathlib
import re
import sys

table_path = pathlib.Path(sys.argv[1])
in_table = False
seen_repos = set()

for raw_line in table_path.read_text(encoding="utf-8").splitlines():
    line = raw_line.strip()
    if line.startswith("| Wallet | Score |"):
        in_table = True
        continue
    if not in_table:
        continue
    if not line.startswith("|"):
        break
    if re.match(r"^\|[\s:-]+\|$", line):
        continue

    cells = [cell.strip() for cell in line.strip("|").split("|")]
    if len(cells) < 6:
        continue

    github_cell = cells[5]
    repo_match = re.search(r"\(https://github\.com/([^)/]+/[^)]+)\)", github_cell)
    if not repo_match:
        continue
    repo = repo_match.group(1)
    if repo in seen_repos:
        continue
    seen_repos.add(repo)

    name_match = re.search(r"\*\*([^*]+)\*\*", cells[0])
    if name_match:
        name = name_match.group(1)
    else:
        name = re.sub(r"\[[^\]]+\]\([^)]+\)", "", cells[0]).strip("*~ ")
    name = name.replace("~~", "").strip()

    print(f"{name}\t{repo}")
PY
}

mapfile -t TABLE_REPO_ROWS < <(load_repos_from_table)
REPOS=()
WALLET_NAMES=()
for row in "${TABLE_REPO_ROWS[@]}"; do
    IFS=$'\t' read -r wallet_name repo <<<"$row"
    WALLET_NAMES+=("$wallet_name")
    REPOS+=("$repo")
done

# Optional: REPO_FILTER="owner/a,owner/b" restricts the run to those repos (dry runs).
if [ -n "${REPO_FILTER:-}" ]; then
    FILTERED_REPOS=(); FILTERED_NAMES=()
    for i in "${!REPOS[@]}"; do
        case ",$REPO_FILTER," in
            *",${REPOS[$i]},"*) FILTERED_REPOS+=("${REPOS[$i]}"); FILTERED_NAMES+=("${WALLET_NAMES[$i]}") ;;
        esac
    done
    REPOS=("${FILTERED_REPOS[@]}"); WALLET_NAMES=("${FILTERED_NAMES[@]}")
fi

if [ "${#REPOS[@]}" -eq 0 ]; then
    echo "Error: no software repositories found in $SOFTWARE_TABLE" >&2
    exit 1
fi

# Set up authentication: GITHUB_TOKEN, else GH_TOKEN. The token is passed to
# curl via a config on stdin so it never appears in argv or output.
AUTH_TOKEN="${GITHUB_TOKEN:-${GH_TOKEN:-}}"
if [ -n "$AUTH_TOKEN" ]; then
    echo "Using GitHub token for API requests" >&2
else
    echo "Warning: No GITHUB_TOKEN/GH_TOKEN set. Rate limited to 60 requests/hour." >&2
    echo "Set GITHUB_TOKEN environment variable for higher limits." >&2
    echo "Falling back to GitHub Atom feeds for last-commit timestamps." >&2
    echo "Attempting HTML scrape fallback for stars/issues (best effort)." >&2
fi

# gh_curl [curl args...]: silent curl, authenticated when a token is set.
gh_curl() {
    if [ -n "$AUTH_TOKEN" ]; then
        printf 'header = "Authorization: Bearer %s"\n' "$AUTH_TOKEN" | curl -s -K - "$@"
    else
        curl -s "$@"
    fi
}

# get_release REPO: print "<tag-or-name>|<date YYYY-MM-DD>" for the latest
# release; if /releases/latest is 404 (no GitHub Releases, e.g. trezor-firmware)
# fall back to the newest tag (and its commit date). Prints "?|?" on failure.
get_release() {
    local repo="$1" body code tag date
    body=$(gh_curl -w '\n%{http_code}' "https://api.github.com/repos/$repo/releases/latest" 2>/dev/null)
    code=${body##*$'\n'}
    body=${body%$'\n'*}
    if [ "$code" = "200" ]; then
        tag=$(echo "$body" | jq -r '.tag_name // .name // empty' 2>/dev/null)
        date=$(echo "$body" | jq -r '(.published_at // .created_at // empty) | .[0:10]' 2>/dev/null)
        echo "${tag:-?}|${date:-?}"
        return
    fi
    if [ "$code" = "404" ]; then
        # /tags is returned in reverse-lexical ref order (not by date). Only trust
        # the fallback when the list is complete (fewer than 100 tags, one page)
        # and every version-looking tag shares one prefix; otherwise (e.g.
        # trezor-firmware: 100+ tags, core/ and secmon/ prefixes) a "highest tag"
        # would be wrong, so report unknown ("?|?") instead of a misleading tag.
        body=$(gh_curl "https://api.github.com/repos/$repo/tags?per_page=100" 2>/dev/null)
        tag=""
        if [ "$(echo "$body" | jq -r 'if type=="array" then length else 100 end' 2>/dev/null)" -lt 100 ] 2>/dev/null; then
            local vtags
            vtags=$(echo "$body" | jq -r '.[].name' 2>/dev/null | grep -E '(^|/)v?[0-9]+(\.[0-9]+)+$')
            if [ "$(echo "$vtags" | sed -n 's#[^/]*$##p' | sort -u | grep -c .)" -le 1 ] 2>/dev/null; then
                tag=$(echo "$vtags" \
                    | awk '{ n=$0; sub(/^.*\//, "", n); sub(/^v/, "", n); print n "\t" $0 }' \
                    | sort -t$'\t' -k1,1V | tail -1 | cut -f2)
            fi
        fi
        if [ -n "$tag" ]; then
            local commit_url
            commit_url=$(echo "$body" | jq -r --arg t "$tag" '(if type=="array" then .[] else empty end) | select(.name==$t) | .commit.url // empty' 2>/dev/null | head -1)
            date=""
            if [ -n "$commit_url" ]; then
                date=$(gh_curl "$commit_url" 2>/dev/null | jq -r '(.commit.committer.date // empty) | .[0:10]' 2>/dev/null)
            fi
            echo "${tag}|${date:-?}"
            return
        fi
    fi
    echo "?|?"
}

# Function to get activity status based on days since last commit
get_status() {
    local days=$1
    if [ "$days" -le 30 ]; then
        echo "✅ Active"
    elif [ "$days" -le 120 ]; then
        echo "⚠️ Slow"
    else
        echo "❌ Inactive"
    fi
}

# Function to get status emoji only
get_status_emoji() {
    local days=$1
    if [ "$days" -le 30 ]; then
        echo "✅"
    elif [ "$days" -le 120 ]; then
        echo "⚠️"
    else
        echo "❌"
    fi
}

normalize_count() {
    local raw="$1"
    raw="${raw//,/}"
    if [[ "$raw" =~ ^([0-9]+(\.[0-9]+)?)([kKmM])$ ]]; then
        local num="${BASH_REMATCH[1]}"
        local suffix="${BASH_REMATCH[3]}"
        if [[ "$suffix" =~ [kK] ]]; then
            awk "BEGIN {printf \"%d\", $num*1000}"
        else
            awk "BEGIN {printf \"%d\", $num*1000000}"
        fi
    else
        echo "$raw"
    fi
}

# Parse arguments
OUTPUT_FORMAT="text"
if [ "$1" == "--json" ]; then
    OUTPUT_FORMAT="json"
elif [ "$1" == "--markdown" ]; then
    OUTPUT_FORMAT="markdown"
fi

# Get current date
CURRENT_DATE=$(date +%s)
TODAY=$(date +%Y-%m-%d)

# Start output
if [ "$OUTPUT_FORMAT" == "json" ]; then
    echo "{"
    echo "  \"generated\": \"$TODAY\","
    echo "  \"wallets\": ["
elif [ "$OUTPUT_FORMAT" == "markdown" ]; then
    echo "## GitHub Activity Status (Generated: $TODAY)"
    echo ""
    echo "| Wallet | Repository | Last Commit | Days Ago | Stars | Issues | Status | License | Archived | Pushed | Last Release |"
    echo "|--------|------------|-------------|----------|-------|--------|--------|---------|----------|--------|--------------|"
else
    echo "=== Wallet GitHub Activity Check ==="
    echo "Generated: $TODAY"
    echo ""
fi

# Process each repository
FIRST=true
for i in "${!REPOS[@]}"; do
    REPO="${REPOS[$i]}"
    WALLET="${WALLET_NAMES[$i]}"
    
    # Get repository stats (stars/issues/licence/archived/pushed_at)
    LICENSE="?"; ARCHIVED="?"; PUSHED_AT="?"; RELEASE="?|?"
    API_OK=true
    REPO_URL="https://api.github.com/repos/$REPO"
    REPO_RESPONSE=$(gh_curl "$REPO_URL" 2>/dev/null)
    if echo "$REPO_RESPONSE" | grep -q "API rate limit exceeded"; then
        API_OK=false
        if [ -n "$AUTH_TOKEN" ]; then
            echo "Error: GitHub API rate limit exceeded. Set GITHUB_TOKEN." >&2
            exit 1
        fi
        STAR_RAW=$(curl -s "https://r.jina.ai/http://github.com/$REPO" 2>/dev/null | grep -m1 "Star " | sed -n 's/.*Star[[:space:]]\{1,\}\([0-9][0-9.,kKmM]*\).*/\1/p')
        ISSUE_RAW=$(curl -s "https://r.jina.ai/http://github.com/$REPO/issues?q=is%3Aissue+is%3Aopen" 2>/dev/null | grep -m1 "Open[[:space:]]\{1,\}[0-9]" | sed -n 's/.*Open[[:space:]]\{1,\}\([0-9][0-9.,kKmM]*\).*/\1/p')
        STARS=$(normalize_count "$STAR_RAW")
        ISSUES=$(normalize_count "$ISSUE_RAW")
    elif [ -n "$AUTH_TOKEN" ]; then
        STARS=$(echo "$REPO_RESPONSE" | jq -r '.stargazers_count // 0' 2>/dev/null)
        ISSUES=$(echo "$REPO_RESPONSE" | jq -r '.open_issues_count // 0' 2>/dev/null)
    else
        STARS=$(echo "$REPO_RESPONSE" | jq -r '.stargazers_count // "?"' 2>/dev/null)
        ISSUES=$(echo "$REPO_RESPONSE" | jq -r '.open_issues_count // "?"' 2>/dev/null)
    fi
    if [ -z "$STARS" ]; then STARS="?"; fi
    if [ -z "$ISSUES" ]; then ISSUES="?"; fi
    if [ "$API_OK" = "true" ]; then
        LICENSE=$(echo "$REPO_RESPONSE" | jq -r '.license.spdx_id // "NONE"' 2>/dev/null || echo "?")
        ARCHIVED=$(echo "$REPO_RESPONSE" | jq -r '(.archived | if . == null then "?" else tostring end)' 2>/dev/null || echo "?")
        PUSHED_AT=$(echo "$REPO_RESPONSE" | jq -r '(.pushed_at // "?") | .[0:10]' 2>/dev/null || echo "?")
        RELEASE=$(get_release "$REPO")
    fi
    RELEASE_TAG="${RELEASE%%|*}"
    RELEASE_DATE="${RELEASE##*|}"

    # Get the default branch commits
    if [ -n "$AUTH_TOKEN" ]; then
        API_URL="https://api.github.com/repos/$REPO/commits?per_page=1"
        RESPONSE=$(gh_curl "$API_URL" 2>/dev/null)
        if echo "$RESPONSE" | grep -q "API rate limit exceeded"; then
            echo "Error: GitHub API rate limit exceeded. Set GITHUB_TOKEN." >&2
            exit 1
        fi
        LAST_COMMIT=$(echo "$RESPONSE" | jq -r 'if type=="array" then (.[0].commit.committer.date // empty) else empty end' 2>/dev/null || true)
    else
        ATOM_URL="https://github.com/$REPO/commits/HEAD.atom"
        LAST_COMMIT=$(curl -s "$ATOM_URL" 2>/dev/null | grep -m1 "<updated>" | sed -e 's/.*<updated>//' -e 's/<\/updated>.*//')
        if [ -z "$LAST_COMMIT" ]; then
            API_URL="https://api.github.com/repos/$REPO/commits?per_page=1"
            RESPONSE=$(curl -s "$API_URL" 2>/dev/null)
            LAST_COMMIT=$(echo "$RESPONSE" | jq -r 'if type=="array" then (.[0].commit.committer.date // empty) else empty end' 2>/dev/null || true)
        fi
    fi
    
    if [ -z "$LAST_COMMIT" ]; then
        LAST_COMMIT_DATE="Unknown"
        DAYS_AGO="?"
        STATUS="?"
        STATUS_EMOJI="?"
    else
        # Convert to epoch and calculate days
        COMMIT_EPOCH=$(date -d "$LAST_COMMIT" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%SZ" "$LAST_COMMIT" +%s 2>/dev/null)
        DAYS_AGO=$(( (CURRENT_DATE - COMMIT_EPOCH) / 86400 ))
        LAST_COMMIT_DATE=$(echo "$LAST_COMMIT" | cut -d'T' -f1)
        STATUS=$(get_status $DAYS_AGO)
        STATUS_EMOJI=$(get_status_emoji $DAYS_AGO)
    fi
    
    # Output based on format
    if [ "$OUTPUT_FORMAT" == "json" ]; then
        if [ "$FIRST" != "true" ]; then
            echo ","
        fi
        FIRST=false
        echo -n "    {\"wallet\": \"$WALLET\", \"repo\": \"$REPO\", \"lastCommit\": \"$LAST_COMMIT_DATE\", \"daysAgo\": $DAYS_AGO, \"stars\": \"$STARS\", \"issues\": \"$ISSUES\", \"status\": \"$STATUS_EMOJI\", \"license\": \"$LICENSE\", \"archived\": \"$ARCHIVED\", \"pushedAt\": \"$PUSHED_AT\", \"lastRelease\": \"$RELEASE_TAG\", \"lastReleaseDate\": \"$RELEASE_DATE\"}"
    elif [ "$OUTPUT_FORMAT" == "markdown" ]; then
        echo "| **$WALLET** | [$REPO](https://github.com/$REPO) | $LAST_COMMIT_DATE | $DAYS_AGO | $STARS | $ISSUES | $STATUS | $LICENSE | $ARCHIVED | $PUSHED_AT | $RELEASE_TAG ($RELEASE_DATE) |"
    else
        printf "%-15s %-40s %-12s %4s days  %7s %7s  %s  [%s archived=%s pushed=%s release=%s %s]\n" "$WALLET" "$REPO" "$LAST_COMMIT_DATE" "$DAYS_AGO" "$STARS" "$ISSUES" "$STATUS" "$LICENSE" "$ARCHIVED" "$PUSHED_AT" "$RELEASE_TAG" "$RELEASE_DATE"
    fi
    
    # Sleep to avoid rate limiting (be nice to GitHub)
    sleep 0.5
done

# End output
if [ "$OUTPUT_FORMAT" == "json" ]; then
    echo ""
    echo "  ]"
    echo "}"
elif [ "$OUTPUT_FORMAT" == "markdown" ]; then
    echo ""
    echo "**Legend:** ✅ Active (≤30 days) | ⚠️ Slow (31-120 days) | ❌ Inactive (>120 days)"
else
    echo ""
    echo "Legend: ✅ Active (≤30 days) | ⚠️ Slow (31-120 days) | ❌ Inactive (>120 days)"
fi

echo "" >&2
echo "Done! Processed ${#REPOS[@]} repositories from SOFTWARE_WALLETS.md." >&2
