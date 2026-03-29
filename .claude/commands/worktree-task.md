## Worktree pour tâche sans ticket

Utilisé automatiquement dès qu'une tâche touche la codebase, même sans ticket Jira formel.

### 1. Identifier un nom simplifié

Dériver un nom court en kebab-case depuis la demande (ex: `fix-login-bug`, `add-auth-endpoint`, `update-cf-config`).

### 2. Créer le worktree depuis main

```bash
cd /Users/pierre/dev/SaaS
git fetch origin main
git worktree add ../SaaS-<nom-simplifié> -b <nom-simplifié> origin/main
```

- Répertoire : `../SaaS-<nom-simplifié>`
- Tout le travail se fait dans ce répertoire, pas dans le répertoire principal

### 3. Implémenter dans le worktree

- Lire les fichiers concernés avant toute modification
- Suivre les conventions du projet
- Ne pas dépasser le scope de la demande

### 4. Committer

```bash
git add <fichiers explicites>
git commit -m "type: description courte"
```

- Pas de `Co-Authored-By` dans le commit

### 5. Proposer la suite

Après le travail, proposer à l'utilisateur :
- Créer un ticket Jira pour tracer la modification (si pertinent)
- Créer une PR GitHub
- Ou laisser tel quel si c'est un fix local mineur
