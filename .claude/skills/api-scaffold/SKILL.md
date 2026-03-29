---
name: api-scaffold
description: Scaffold complet d'un nouvel endpoint FastAPI suivant les patterns du projet (router, schema Pydantic, service, repository). Utiliser quand l'utilisateur veut créer une nouvelle ressource API ou un nouvel endpoint.
---

# API Scaffold

Génère un endpoint FastAPI complet en suivant les conventions du projet.

## Entrée attendue

L'utilisateur fournit dans $ARGUMENTS :
- Le nom de la ressource (ex: `subscription`, `invoice`, `webhook`)
- Les opérations à créer : GET, POST, PUT, PATCH, DELETE
- Les champs principaux si connus

Si des informations manquent, demander avant de coder.

## Étapes

1. **Explorer les patterns existants**
   - Lire un router existant similaire pour comprendre la structure
   - Vérifier les conventions de nommage (snake_case, pluriel pour les routes)
   - Identifier les dépendances partagées (auth, db session, pagination)

2. **Créer le schema Pydantic** (`schemas/{resource}.py`)
   - `{Resource}Base` : champs communs
   - `{Resource}Create` : champs pour la création (sans id, timestamps)
   - `{Resource}Update` : champs optionnels pour la mise à jour
   - `{Resource}Response` : champs retournés à l'API (sans données sensibles)
   - Utiliser `Annotated` pour les validations
   - Ajouter `model_config = ConfigDict(from_attributes=True)` si ORM

3. **Créer le repository** (`repositories/{resource}_repository.py`)
   - Méthodes : `get_by_id`, `list`, `create`, `update`, `delete`
   - Session SQLAlchemy injectée en paramètre (pas de global)
   - Pas de logique métier ici, uniquement les requêtes DB
   - Gérer les `None` : retourner `None` si non trouvé, lever une exception dans le service

4. **Créer le service** (`services/{resource}_service.py`)
   - Logique métier uniquement
   - Appelle le repository, pas la DB directement
   - Lève des `HTTPException` avec les bons codes (404, 409, 422)
   - Valide les règles métier (ex: unicité, état valide)

5. **Créer le router** (`routers/{resource}.py`)
   - `APIRouter(prefix="/{resources}", tags=["{resources}"])`
   - Utiliser `Annotated` pour les dépendances (`Depends`)
   - Return type annoté sur chaque endpoint
   - Codes de statut explicites (`status_code=201` pour POST)
   - Pagination sur les endpoints list : `skip: int = 0, limit: int = 20`

6. **Enregistrer le router**
   - Ajouter `app.include_router(router)` dans `main.py`

7. **Ajouter un test minimal** (`tests/test_{resource}.py`)
   - Au moins un test happy path par endpoint
   - Utiliser les fixtures existantes (client, db session)

## Standards qualité (SonarQube A)

- Complexité cognitive < 15 par fonction
- Tous les chemins d'erreur gérés
- Pas d'`except Exception` nu
- Inputs validés au niveau du schema Pydantic
- Pas de donnée sensible dans les logs

## Structure de fichiers

```
api/
  routers/{resource}.py
  schemas/{resource}.py
  services/{resource}_service.py
  repositories/{resource}_repository.py
  tests/test_{resource}.py
```
