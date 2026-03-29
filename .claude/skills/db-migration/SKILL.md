---
name: db-migration
description: Génère une migration Alembic pour un changement de modèle SQLAlchemy. Utiliser quand l'utilisateur ajoute/modifie/supprime une colonne, une table, une contrainte ou un index dans les modèles SQLAlchemy.
---

# DB Migration (Alembic)

Génère et valide une migration Alembic pour un changement de modèle SQLAlchemy.

## Étapes

1. **Comprendre le changement demandé**
   - Si $ARGUMENTS est fourni, lire la description du changement
   - Sinon, demander : quelle table, quelle colonne, quel type de changement ?

2. **Lire les fichiers existants**
   - Lire le modèle SQLAlchemy concerné avant de le modifier
   - Lire la dernière migration Alembic pour comprendre la chaîne de révisions
   - Vérifier les patterns existants (naming conventions, types utilisés)

3. **Modifier le modèle SQLAlchemy**
   - Appliquer le changement dans le fichier de modèle
   - Respecter les conventions du projet :
     - Types : `String`, `Integer`, `Boolean`, `DateTime`, `UUID`, `JSON`
     - Nullable explicitement défini
     - Index ajouté si la colonne est utilisée en filtre
     - Contraintes nommées explicitement (ex: `uq_users_email`)

4. **Générer la migration**
   - Commande : `alembic revision --autogenerate -m "description_courte"`
   - Le message doit être en snake_case et décrire l'action : `add_stripe_customer_id_to_users`

5. **Vérifier la migration générée**
   - Lire le fichier généré dans `alembic/versions/`
   - Vérifier que `upgrade()` et `downgrade()` sont corrects
   - S'assurer que `downgrade()` est réversible (pas de perte de données)
   - Corriger manuellement si autogenerate a raté quelque chose (ex: renommage)

6. **Tester la migration**
   - `alembic upgrade head` → doit passer sans erreur
   - `alembic downgrade -1` → doit revenir proprement
   - `alembic upgrade head` → re-appliquer

7. **Résumer**
   - Fichiers modifiés : modèle + fichier de migration
   - Ce que fait la migration (upgrade/downgrade)
   - Si la migration affecte des données existantes, signaler le risque

## Règles

- Ne jamais modifier une migration déjà mergée dans main
- Les colonnes ajoutées en production doivent être nullable ou avoir une valeur par défaut
- Si la migration supprime des données, STOP et demander confirmation explicite
- Pas de `op.execute()` avec du SQL brut sans justification
