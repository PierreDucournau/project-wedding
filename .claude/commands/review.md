# Review Current Branch

Review the changes in the current branch before it goes to PR.

1. Run `git diff main` and analyze every change
2. Check for:
   - Missing error handling
   - Hardcoded values that should be config
   - N+1 queries or missing indexes
   - Pub/Sub handlers without idempotency
   - Missing or broken tests
   - Inconsistency with existing patterns in the codebase
3. Output a structured review with severity: 🔴 blocking / 🟡 suggestion / 🟢 nitpick

