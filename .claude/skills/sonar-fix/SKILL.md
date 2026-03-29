---
name: sonar-fix
description: Analyse et corrige les issues SonarQube sur la branche courante. Utiliser quand l'utilisateur veut améliorer la qualité du code, corriger des bugs SonarQube, ou préparer une PR pour passer le quality gate. Projet SonarQube : PierreDucournau_SaaS.
---

# SonarQube Fix

Analyse et corrige les problèmes de qualité de code signalés par SonarQube sur la branche courante.

## Étapes

1. **Récupérer les issues SonarQube**
   - Appelle `search_sonar_issues_in_projects` avec `projectKeys: PierreDucournau_SaaS` et filtre sur la branche courante si possible
   - Catégorise par type : BUG, VULNERABILITY, CODE_SMELL, SECURITY_HOTSPOT
   - Trie par sévérité : BLOCKER > CRITICAL > MAJOR > MINOR > INFO

2. **Vérifier le quality gate**
   - Appelle `get_project_quality_gate_status` pour voir si la PR/branche passe
   - Note les métriques qui échouent

3. **Analyser chaque issue**
   - Lis le fichier concerné avant de modifier quoi que ce soit
   - Comprends le contexte : ne pas corriger mécaniquement sans comprendre
   - Vérifie si la correction n'introduit pas de régression

4. **Corriger par ordre de priorité**

   **Reliability (bugs)**
   - Vérifier les `None` avant utilisation
   - Pas de logique morte ou code jamais atteint
   - Gérer toutes les branches d'exception

   **Security (vulnerabilities)**
   - Ne jamais interpoler de données utilisateur dans un path/URL
   - Ne jamais logger de données sensibles (tokens, mots de passe)
   - Valider les inputs à la frontière (routes FastAPI)

   **Maintainability (code smells)**
   - Complexité cognitive < 15 par fonction
   - Pas de code dupliqué (extraire en helper si répété 2+ fois)
   - Pas d'`except Exception` générique sans re-raise ou log structuré
   - Supprimer les variables et imports inutilisés

   **Coverage**
   - Si des lignes non couvertes sont signalées, ajouter des tests ciblés

5. **Vérifier après correction**
   - Relancer `make test` et `make lint` pour s'assurer que rien n't est cassé
   - Résumer les corrections effectuées avec le type de problème résolu

## Règles

- Ne pas corriger les issues dans des fichiers qui n'ont pas été touchés dans la branche
- Si une issue est un faux positif, ajouter un commentaire `# noqa` ou équivalent avec justification
- Ne jamais supprimer des tests pour augmenter la couverture
- Toujours expliquer pourquoi la correction est correcte, pas juste ce qui a changé
