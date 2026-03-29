---
name: sprint-status
description: Résumé de l'état du sprint Jira courant. Utiliser quand l'utilisateur veut un point d'avancement, identifier les blocages, préparer un standup ou une rétrospective.
---

# Sprint Status

Génère un résumé clair de l'état du sprint Jira en cours pour le projet PLP.

## Étapes

1. **Trouver le sprint actif**
   - Appelle `jira_get_agile_boards` pour trouver le board PLP
   - Appelle `jira_get_sprints_from_board` pour identifier le sprint actif (state: active)

2. **Récupérer les issues du sprint**
   - Appelle `jira_get_sprint_issues` avec l'ID du sprint actif
   - Grouper par statut : To Do / In Progress / In Review / Done
   - Identifier le type : Feature, Bug, Task

3. **Analyser les blocages**
   - Issues "In Progress" depuis plus de 3 jours sans mise à jour
   - Issues sans assigné
   - Issues avec le label `blocked`
   - PRs GitHub ouvertes sans review (appelle `list_pull_requests` sur le repo PierreDucournau/SaaS)

4. **Calculer les métriques**
   - Taux de complétion : Done / Total
   - Story points complétés vs restants (si disponibles)
   - Nombre de bugs vs features

5. **Générer le rapport**

   Format de sortie :

   ```
   ## Sprint [Nom] — Point au [date]

   ### Progression
   - Done: X tickets (Y%)
   - In Review: X tickets
   - In Progress: X tickets
   - To Do: X tickets

   ### En cours
   - PLP-XX: [titre] (@assigné) — depuis Y jours

   ### A revoir (PRs ouvertes)
   - PR #XX: [titre] — en attente de review

   ### Blocages
   - PLP-XX: [titre] — raison du blocage

   ### Termine aujourd'hui / Risques
   - [observations sur la vélocité et les risques de non-livraison]
   ```

6. **Suggestions**
   - Si le sprint est en retard, proposer quelles issues pourraient être reportées
   - Si des issues sont bloquées, suggérer les actions débloquantes
   - Si la PR backlog est longue, signaler le besoin de review

## Règles

- Ne pas modifier d'issues Jira sans confirmation explicite
- Rester factuel, ne pas porter de jugements sur les performances individuelles
- Si des données manquent (pas de story points, pas d'assigné), le signaler sans bloquer le rapport
