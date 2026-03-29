---
name: bruno-sync
description: Mettre à jour la collection Bruno après création ou modification d'un endpoint FastAPI. Utiliser dès qu'un router, controller ou endpoint est créé, modifié ou supprimé dans l'API.
---

# Bruno Sync

Après chaque changement sur un endpoint FastAPI, créer ou mettre à jour le fichier `.bru` correspondant dans la collection Bruno.

## Collection Bruno

- **Racine** : `SaaS/` (à la racine du repo)
- **Structure** : `SaaS/api/v1/{resource}/{Nom opération}.bru`
- **Environnements** : `SaaS/environments/`
- **Headers globaux** : définis dans `SaaS/collection.bru` (CF-Access automatiquement inclus)

## Déclencheurs

Appliquer ce skill dès qu'un des fichiers suivants est créé ou modifié :

- `backend/apps/api/src/controllers/*.py`
- `backend/apps/api/src/api/v1/router.py`

## Étapes

### 1. Identifier les changements

Pour chaque endpoint ajouté ou modifié, noter :

- Méthode HTTP (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`)
- Chemin complet (ex: `/api/v1/auth/register`)
- Resource (segment après `/v1/`, ex: `auth`, `users`)
- Nom de l'opération (ex: `Register`, `Login`, `Me`, `List users`)
- **Description** : valeur du paramètre `summary=` du décorateur de route FastAPI
- Auth requise : aucune ou bearer (présence de `Depends(get_current_user)`)
- Body : schéma Pydantic si body attendu
- Code de statut de succès
- Script post-réponse si le endpoint retourne un token

### 2. Créer ou mettre à jour le fichier `.bru`

**Chemin du fichier** : `SaaS/api/v1/{resource}/{Nom opération}.bru`

#### Template — endpoint public sans body (GET)

```
meta {
  name: {Nom opération}
  type: http
  seq: {numéro}
}

get {
  url: {{base_url}}/api/v1/{resource}{/sous-chemin}
  body: none
  auth: none
}

docs {
  {valeur du paramètre summary= du décorateur FastAPI}
}
```

#### Template — endpoint public avec body JSON (POST/PUT/PATCH)

```
meta {
  name: {Nom opération}
  type: http
  seq: {numéro}
}

post {
  url: {{base_url}}/api/v1/{resource}
  body: json
  auth: none
}

body:json {
  {
    "champ1": "valeur_exemple",
    "champ2": "valeur_exemple"
  }
}

docs {
  {valeur du paramètre summary= du décorateur FastAPI}
}
```

Si le endpoint retourne un `access_token`, ajouter avant `docs` :

```
script:post-response {
  if (res.status === {code_succès}) {
    bru.setEnvVar("access_token", res.body.access_token);
  }
}
```

#### Template — endpoint protégé (bearer)

```
meta {
  name: {Nom opération}
  type: http
  seq: {numéro}
}

get {
  url: {{base_url}}/api/v1/{resource}
  body: none
  auth: none
}

headers {
  Authorization: Bearer {{access_token}}
}

docs {
  {valeur du paramètre summary= du décorateur FastAPI}
}
```

> Note : Bruno gère le bearer via le header `Authorization` directement (format retourné par le linter du projet).

### 3. Numérotation `seq`

Attribuer `seq` dans l'ordre logique du workflow utilisateur au sein du dossier ressource :

- auth : Register=1, Login=2, Me=3
- users : List users=1, ...

### 4. Body JSON — valeurs exemples

Utiliser les variables d'environnement disponibles quand elles correspondent aux champs :

- `email` → `"{{account_email}}"`
- `password` → `"{{account_password}}"`
- `name` → `"{{account_name}}"`
- Autres champs → valeur littérale représentative du type

### 5. Vérifier les environnements

Si une nouvelle variable est introduite (ex: un nouvel ID de ressource), l'ajouter dans tous les fichiers d'environnement (`LOCAL (preprod).bru`, `LOCAL (prod).bru`, `PREPROD.bru`, `PRODUCTION.bru`).

Variables actuellement disponibles : `CF-Access-Client-Id`, `CF-Access-Client-Secret`, `base_url`, `access_token`, `account_name`, `account_email`, `account_password`.

## Ce qu'il ne faut PAS faire

- Ne pas utiliser `auth: bearer { token: ... }` — le linter le convertit en header `Authorization` direct
- Ne pas dupliquer les headers CF-Access dans chaque fichier (ils sont dans `collection.bru`)
- Ne pas créer de dossier intermédiaire non lié à une ressource API

## Exemple complet

Endpoint ajouté : `POST /api/v1/subscriptions` — body `{plan: str, billing_email: str}` — auth bearer — retourne `201`

Fichier créé : `SaaS/api/v1/subscriptions/Create subscription.bru`

```
meta {
  name: Create subscription
  type: http
  seq: 1
}

post {
  url: {{base_url}}/api/v1/subscriptions
  body: json
  auth: none
}

headers {
  Authorization: Bearer {{access_token}}
}

body:json {
  {
    "plan": "pro",
    "billing_email": "{{account_email}}"
  }
}

docs {
  Create a new subscription for the current user
}
```
