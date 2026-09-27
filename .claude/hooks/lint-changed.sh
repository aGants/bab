#!/usr/bin/env bash
# Lint the files changed during Claude's turn, however they were edited.
#
#   snapshot  (UserPromptSubmit) — remember every uncommitted file and its content hash
#   check     (Stop)             — oxlint --fix on files that are new or changed since the
#                                  snapshot, so the user's own work in progress is left alone
#
# Remaining lint errors go to stderr with exit 2, so Claude keeps going and fixes them.

input=$(cat)
cd "$CLAUDE_PROJECT_DIR" || exit 0
bin=node_modules/.bin

session=$(jq -r '.session_id // "default"' <<<"$input")
snapshot="${TMPDIR:-/tmp}/claude-lint-hook/$session"

# "<hash> <path>" for every existing file that differs from HEAD or is untracked
dirty_files() {
	{
		git -c core.quotePath=false diff --name-only HEAD
		git -c core.quotePath=false ls-files --others --exclude-standard
	} 2>/dev/null | sort -u | while IFS= read -r f; do
		[ -f "$f" ] && printf '%s %s\n' "$(git hash-object -- "$f")" "$f"
	done
}

if [ "$1" = snapshot ]; then
	mkdir -p "$(dirname "$snapshot")"
	dirty_files >"$snapshot"
	exit 0
fi

# No snapshot means this turn started before the hook was set up: don't guess
[ -f "$snapshot" ] || exit 0
# Dependencies not installed (fresh clone, worktree): nothing to run
[ -x "$bin/oxlint" ] || exit 0

lint=()
while IFS= read -r line; do
	f=${line#* }
	case "$f" in *.ts | *.tsx | *.js | *.jsx) lint+=("$f") ;; esac
done < <(dirty_files | grep -vxF -f "$snapshot")

[ ${#lint[@]} -gt 0 ] || exit 0

if ! out=$("$bin/oxlint" --fix "${lint[@]}" 2>&1); then
	# Already continuing because of this hook: report once instead of looping
	if [ "$(jq -r '.stop_hook_active // false' <<<"$input")" = "true" ]; then
		jq -n --arg msg "Oxlint problems remain:"$'\n'"$out" '{systemMessage: $msg}'
		exit 0
	fi
	echo "$out" >&2
	exit 2
fi
