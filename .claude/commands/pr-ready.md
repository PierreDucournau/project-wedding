# PR Ready Check

Before opening or finalizing the PR for the current branch:

1. Run `make test` — fix any failures
2. Run `make lint` — fix any linting issues
3. Check the diff: `git diff main` — does it match the ticket scope?
4. Verify no secrets or .env files are staged
5. Verify .mcp.json is in .gitignore
6. Write or update the PR description:
   - Link to Jira ticket
   - What changed and why
   - How to test locally
   - Any breaking changes
   - No "Generated with Claude Code" or any Claude mention in the body
   - No 'Co-authored-by: Claude' in commit messages
7. Check if CLAUDE.md needs updating (new pattern introduced?)
8. Assess documentation impact — if the change affects architecture, services, routes, env vars, commands, or deployment: read README.md (and infra/portainer/SETUP.md if infra-related) and propose concrete updates before creating the PR
