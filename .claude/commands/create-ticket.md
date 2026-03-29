# Create Jira Ticket

Create a well-structured Jira ticket for project PLP based on $ARGUMENTS.

## Instructions

1. **Identify the ticket type**
   - Feature / Story → issue_type: `Feature`
   - Bug → issue_type: `Bug`
   - Technical task (infra, refacto, config) → issue_type: `Task`
   - If unclear from $ARGUMENTS, ask before creating

2. **Find the parent Epic**
   - Map the request to one of the existing epics:
     - PLP-5 Infrastructure & DevOps → ci-cd, docker, terraform, k8s, secrets, monitoring
     - PLP-6 Backend API Core → fastapi, postgresql, auth, jwt, users, migrations
     - PLP-7 Service Event → events, redis, pubsub, websocket, sse
     - PLP-8 Service Task (Celery) → celery, workers, queues, background tasks
- PLP-10 Frontend → ui, pages, components, nextjs, react
     - PLP-11 Déploiement Production → k8s manifests, ssl, cd pipeline, smoke tests
   - Set `additional_fields`: `{"parent": "PLP-X"}`
   - If the request doesn't fit any epic, ask which one to use

3. **Write a quality summary**
   - Use an action verb: "Implémenter", "Configurer", "Ajouter", "Écrire", "Migrer"
   - Be specific: name the technology or component
   - Max 80 characters

4. **Write a quality description** (Markdown)
   - What: what needs to be done and why
   - How: technical approach, files/services impacted
   - Acceptance criteria: bullet list of "Done when..." conditions

5. **Assign the right labels**
   - Phase: `phase-1`, `phase-2`, `phase-3`, or `phase-4`
   - Component: `backend`, `frontend`, `infra`, `devops`
   - Tech: any relevant from `docker`, `k8s`, `terraform`, `redis`, `celery`, `postgresql`, `websocket`, `auth`, `security`, `monitoring`, `testing`, `ci-cd`
   - Set via `fields`: `{"labels": ["backend", "auth", "phase-2"]}`

6. **Create the ticket**
   - Call `jira_create_issue` with all fields populated
   - Confirm the created ticket key (e.g. PLP-32) to the user
   - Suggest the next logical ticket to create if relevant
