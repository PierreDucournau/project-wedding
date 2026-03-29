---
name: hotfix
description: Workflow d'urgence pour un correctif critique en production. Utiliser quand un bug bloquant est signalé en prod et doit être corrigé immédiatement, hors du cycle sprint normal.
---

# Hotfix

Workflow de correction d'urgence pour un bug critique en production.

## Entrée attendue

$ARGUMENTS : description du bug ou clé du ticket Jira (ex: PLP-42 ou "les users ne peuvent pas se connecter")

## Étapes

1. **Qualifier le bug**
   - Si un ticket Jira est fourni, le lire avec `jira_get_issue` (inclure le champ `comment`)
   - **Lire tous les commentaires existants** — ils peuvent contenir des infos sur des tentatives précédentes ou des contraintes connues
   - Sinon, demander : impact utilisateur ? criticité ? reproductible ?
   - Confirmer que c'est bien un hotfix (bloquant prod) et pas un bug normal

2. **Créer le ticket Jira si nécessaire**
   - Type : `Bug`
   - Priorité : `Highest`
   - Epic parent : celui qui correspond au service impacté
   - Label : `hotfix`

3. **Créer la branche hotfix**
   - Base : `main` (pas la branche de développement en cours)
   - Nom : `hotfix/PLP-XX-description-courte`
   - Exemple : `hotfix/PLP-42-fix-auth-token-expiry`

4. **Diagnostiquer**
   - Lire les fichiers concernés AVANT de toucher quoi que ce soit
   - Identifier la cause racine, pas juste les symptômes
   - Si la cause n'est pas claire, STOP et demander plus d'infos

5. **Corriger**
   - Fix minimal : corriger uniquement le bug, aucun refactoring
   - Ne pas profiter du hotfix pour "nettoyer" le code autour
   - Si la correction est complexe, décomposer en étapes et les valider une par une

6. **Tester**
   - `make test` : tous les tests doivent passer
   - Ajouter un test de non-régression qui aurait détecté le bug
   - Vérifier les edge cases liés au bug

7. **Créer la PR en urgence**
   - Titre : `fix(PLP-XX): description courte du bug corrigé`
   - Description :
     - **Problème** : ce qui était cassé et l'impact
     - **Cause racine** : pourquoi c'est arrivé
     - **Correction** : ce qui a changé
     - **Test** : comment vérifier que c'est corrigé
   - Cible : `main`
   - Mentionner que c'est un hotfix pour prioriser la review

8. **Après merge**
   - Transitionner le ticket Jira vers "Done"
   - Ajouter un commentaire Jira avec le lien PR
   - Signaler si un backport vers une branche de développement est nécessaire

## Règles absolues

- Ne jamais baser un hotfix sur une branche feature en cours
- Ne jamais sauter les tests sous prétexte d'urgence
- Ne jamais merger sans review (même courte) sauf en cas de panne totale
- Documenter la cause racine pour éviter la récurrence
