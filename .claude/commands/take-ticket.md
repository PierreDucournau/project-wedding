## Steps

### 1. Lire le ticket

- Fetch $ARGUMENTS depuis Jira avec `jira_get_issue` (inclure le champ `comment`)
- Extraire : titre, description, critères d'acceptation, sous-tâches
- **Lire tous les commentaires existants** — ils peuvent contenir des décisions, contraintes ou contournements déjà appliqués
- Si le ticket est flou ou sans critères d'acceptation clairs, STOP et demander

### 2. Créer un worktree depuis main

**CRITIQUE : toujours baser le worktree sur `main`, jamais sur la branche courante.**

```bash
cd /Users/pierre/dev/SaaS
git fetch origin main
git worktree add ../SaaS-PLP-XX -b PLP-XX origin/main
```

- Répertoire du worktree : `../SaaS-PLP-XX` (ex: `../SaaS-PLP-45`)
- Nom de la branche = clé du ticket exacte (ex: `PLP-45`)
- Tout le travail se fait dans ce répertoire worktree, pas dans le répertoire principal
- Ne jamais faire de travail avant cette étape

### 3. Explorer le code

- Identifier les services impactés (api, event, front, infra...)
- Lire les fichiers concernés avant toute modification
- Vérifier les patterns existants similaires dans le code

### 4. Implémenter

- Suivre les conventions du projet (FastAPI, SQLAlchemy, Pydantic)
- Ne jamais hardcoder de secrets — utiliser les variables d'environnement
- Rester dans le scope du ticket, pas de refactoring non demandé

### 5. Tester

- Lancer `make test` et corriger les échecs avant de continuer
- Si aucun test n'existe pour le code modifié, en ajouter au moins un
- Ne jamais utiliser `==` pour comparer des floats — utiliser `pytest.approx`

### 6. Vérifier la qualité SonarQube (viser la note A partout)

**Reliability (0 bug)**
- Vérifier les `None` avant utilisation
- Pas de code mort ou jamais atteint
- Toutes les branches d'exception gérées

**Security (0 vulnerability)**
- Ne jamais interpoler de données utilisateur dans un path/URL
- Ne jamais logger de données sensibles (tokens, mots de passe)
- Valider les inputs aux frontières (routes FastAPI)

**Maintainability (dette < 5%)**
- Complexité cognitive < 15 par fonction
- Pas de code dupliqué (extraire en helper si répété 2+ fois)
- Pas d'`except Exception` nu sans re-raise ou log
- Pas de variable inutilisée, pas d'import mort

**Coverage**
- Chaque nouveau fichier doit avoir au moins un test
- Les branches critiques (erreurs, edge cases) couvertes

### 7. Synchroniser la collection Bruno

Si des endpoints ont été créés ou modifiés, invoquer le skill `/bruno-sync` pour mettre à jour la collection Bruno avant de committer.

### 8. Committer

```bash
git add <fichiers explicites — jamais git add -A>
git commit -m "type(PLP-XX): description courte"
```

- Type conventionnel : `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `ci`
- Pas de `Co-Authored-By` dans le commit

### 9. Créer la PR via GitHub MCP

Utiliser `mcp__github__create_pull_request` avec :
- `owner` : PierreDucournau
- `repo` : SaaS
- `head` : PLP-XX
- `base` : **main** (toujours)
- `title` : `type(PLP-XX): description courte`
- `body` :
  ```
  ## Contexte
  Lien ticket : [PLP-XX](https://poulpes.atlassian.net/browse/PLP-XX)

  ## Changements
  - Ce qui a changé et pourquoi

  ## Comment tester
  - Étapes pour valider localement
  ```

Pas de mention d'outil automatisé dans la description.

### 10. Mettre à jour Jira

- `jira_transition_issue` → statut "In Review"
- `jira_add_comment` → ajouter le lien de la PR

### Convention : commenter les suggestions et décisions

À chaque fois qu'une suggestion, décision technique ou contournement est appliqué sur un ticket (même hors code pur : config infra, compose, etc.), ajouter un commentaire Jira via `jira_add_comment` pour tracer la décision et son contexte.
