# RDC — Contexte Projet pour Agent IA

## Stack technique

- **Monorepo** : Nx 22.5.4
- **Frontend** : Angular 21 (standalone, signals, zoneless)
- **Backend** : NestJS 11
- **Libs** : `libs/domain` (domaine métier pur) + `libs/shared` (DTOs partagés)
- **Base de données** : PostgreSQL 16
- **ORM** : Prisma 7.4.2
- **Node.js** : 24.x
- **Package manager** : npm

## Structure du monorepo

```text
apps/
├── api/
│   ├── prisma/
│   │   ├── migrations/
│   │   │   ├── 20260310181346_init/
│   │   │   └── 20260312173000_auth/
│   │   └── schema.prisma
│   └── src/
│       ├── main.ts
│       ├── app/
│       │   ├── app.module.ts
│       │   ├── auth.module.ts
│       │   └── centre.module.ts
│       ├── application/
│       │   ├── auth/interfaces/
│       │   │   ├── password-hasher.port.ts
│       │   │   ├── refresh-token-session.repository.ts
│       │   │   └── token-service.port.ts
│       │   └── use-cases/
│       │       ├── auth/
│       │       │   ├── bootstrap-admin.usecase.ts
│       │       │   ├── creer-responsable.usecase.ts
│       │       │   ├── lister-responsables.usecase.ts
│       │       │   ├── login.usecase.ts
│       │       │   ├── logout.usecase.ts
│       │       │   ├── me.usecase.ts
│       │       │   ├── modifier-responsable.usecase.ts
│       │       │   ├── obtenir-responsable.usecase.ts
│       │       │   ├── refresh-token.usecase.ts
│       │       │   ├── responsable-centre.mapper.ts
│       │       │   └── supprimer-responsable.usecase.ts
│       │       ├── activer-centre.usecase.ts
│       │       ├── archiver-centre.usecase.ts
│       │       ├── creer-centre.usecase.ts
│       │       ├── desactiver-centre.usecase.ts
│       │       ├── lister-centres.usecase.ts
│       │       └── modifier-centre.usecase.ts
│       ├── infrastructure/
│       │   ├── prisma/
│       │   │   ├── prisma.module.ts
│       │   │   └── prisma.service.ts
│       │   ├── repositories/
│       │   │   ├── centre.prisma.repository.ts
│       │   │   ├── refresh-token-session.prisma.repository.ts
│       │   │   └── user.prisma.repository.ts
│       │   └── security/
│       │       ├── password-hasher.service.ts
│       │       └── token.service.ts
│       └── presentation/http/
│           ├── controllers/
│           │   ├── auth.controller.ts
│           │   ├── centre.controller.ts
│           │   └── responsable.controller.ts
│           ├── dtos/
│           │   ├── bootstrap-admin.request.ts
│           │   ├── creer-centre.request.ts
│           │   ├── creer-responsable.request.ts
│           │   ├── lister-responsables.query.ts
│           │   ├── login.request.ts
│           │   ├── modifier-centre.request.ts
│           │   └── modifier-responsable.request.ts
│           ├── filters/
│           │   ├── domain-exception.filter.ts
│           │   └── request-validation-exception.filter.ts
│           ├── guards/
│           │   ├── access-token.guard.ts
│           │   └── centre-access.guard.ts
│           └── utils/
│               └── cookies.ts
├── api-e2e/
└── frontend/
    └── src/app/
        ├── app.ts
        ├── app.routes.ts
        ├── app.config.ts
        ├── application/
        │   ├── facades/
        │   │   ├── auth.facade.ts
        │   │   ├── centre.facade.ts
        │   │   └── responsable-centre.facade.ts
        │   └── ports/
        │       ├── auth.repository.ts
        │       ├── centre.repository.ts
        │       └── responsable-centre.repository.ts
        ├── features/
        │   ├── admin/
        │   │   ├── centres/
        │   │   ├── dashboard/
        │   │   ├── responsables/
        │   │   └── shell/
        │   └── centre/
        │       ├── dashboard/
        │       ├── mon-centre/
        │       └── shell/
        ├── infrastructure/
        │   ├── guards/
        │   │   ├── admin.guard.ts
        │   │   ├── auth.guard.ts
        │   │   └── role.guard.ts
        │   ├── http/
        │   │   └── auth-token.interceptor.ts
        │   └── repositories/
        │       ├── auth.http.repository.ts
        │       ├── centre.http.repository.ts
        │       └── responsable-centre.http.repository.ts
        └── ui/
            ├── auth/login/
            ├── centres/
            │   ├── centre-edit-form/
            │   ├── centre-form/
            │   └── centre-list/
            ├── profil/
            └── responsables/

libs/
├── domain/
│   └── src/
│       ├── entities/
│       │   ├── centre.entity.ts
│       │   └── user.entity.ts
│       ├── value-objects/
│       │   ├── centre-id.vo.ts
│       │   ├── nom.vo.ts
│       │   ├── code-postal.vo.ts
│       │   ├── ville.vo.ts
│       │   ├── adresse.vo.ts
│       │   ├── telephone.vo.ts
│       │   └── email.vo.ts
│       ├── interfaces/
│       │   ├── centre.repository.ts
│       │   └── user.repository.ts
│       ├── exceptions/
│       │   ├── domain.exception.ts
│       │   ├── domain-validation.exception.ts
│       │   ├── domain-not-found.exception.ts
│       │   └── domain-conflict.exception.ts
│       ├── index.ts
│       └── test-utils.ts
└── shared/
    └── src/
        ├── dtos/
        │   ├── auth-token.dto.ts
        │   ├── auth-user.dto.ts
        │   ├── centre.dto.ts
        │   ├── creer-centre.dto.ts
        │   ├── creer-responsable-centre.dto.ts
        │   ├── login.dto.ts
        │   ├── modifier-centre.dto.ts
        │   ├── modifier-responsable-centre.dto.ts
        │   └── responsable-centre.dto.ts
        └── index.ts
```

## Architecture — principes et cible

Le projet suit une logique **DDD + hexagonale**. C'est la direction de référence pour le code à venir, même si quelques points techniques du code actuel restent encore pragmatiques.

### Principe directeur

```text
libs/domain     → 0 dépendance framework
application/    → dépend principalement de libs/domain
infrastructure/ → branche Prisma / HTTP / bcrypt / runtime
presentation/   → HTTP, validation, filtres, guards, cookies
```

### Flux API (NestJS)

```text
HTTP Request
    ↓
presentation/http/controllers/   ← validation + extraction cookies
    ↓
guards/                          ← access-token.guard, centre-access.guard
    ↓
application/use-cases/           ← orchestration métier
    ↓
libs/domain/                     ← entités + VOs + exceptions
    ↓
infrastructure/repositories/     ← Prisma → PostgreSQL
```

### Flux frontend (Angular)

```text
features/ (pages par rôle)
    ↓
ui/ (composants réutilisables)
    ↓
application/facades/     ← state via signals + actions
    ↓
application/ports/       ← ports abstraits
    ↓
infrastructure/
  ├── repositories/      ← adaptateurs HttpClient → API
  ├── guards/            ← auth.guard, role.guard
  └── http/              ← auth-token.interceptor
```

## Auth JWT

### Backend

- **Access token** : 15 min (`AUTH_ACCESS_TOKEN_TTL_SECONDS=900`)
- **Refresh token** : 7 jours (`AUTH_REFRESH_TOKEN_TTL_SECONDS=604800`)
- **Refresh token** stocké en cookie HTTP-only (`refresh_token`, `SameSite=Lax`, `path=/api/auth`)
- **Access token** renvoyé dans la réponse JSON `auth.accessToken`
- **Feature flag** : `AUTH_PROTECT_CENTRES=false` en dev local, `true` dans l'exemple staging

### Frontend

- `AuthFacade` stocke l'`accessToken` dans `localStorage` (`rdc.auth.v1.accessToken`)
- `auth-token.interceptor.ts` injecte `Authorization: Bearer ...` hors login/refresh
- Initialisation de session : tentative `me()` puis fallback `refresh()`
- Routing actuel basé sur `authGuard` + `roleGuard`

### Rôles

```text
ADMIN               → gestion globale
RESPONSABLE_CENTRE  → accès restreint à son centre
```

### Statuts centre

```text
ACTIF <-> INACTIF
  ↓
ARCHIVE
```

Un centre archivé ne peut plus être réactivé, désactivé ou modifié.

## Format d'erreur HTTP

Les filtres backend exposent un format homogène de ce type :

```json
{
  "statusCode": 400,
  "error": "RequestValidationException | DomainValidationException | ...",
  "message": "...",
  "code": "REQUEST_VALIDATION | CENTRE_ARCHIVED | ...",
  "path": "/api/centres",
  "timestamp": "2026-03-..."
}
```

## Commandes utiles

```bash
# Docker
make dev
make down
make logs
make ps
make db-only
make db-migrate
make db-reset
make db-init
make db-studio

# Nx
npm exec nx serve api
npm exec nx serve frontend
npm exec nx lint api
npm exec nx lint frontend
npm exec nx lint domain
npm exec nx test api
npm exec nx test frontend
npm exec nx test domain
npm exec nx test shared -- --passWithNoTests
npm exec nx build api
npm exec nx build frontend
npm exec nx graph
npm exec nx show project api

# Prisma
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:studio
```

Recommandation : pour le dev local, privilégier les scripts `make` ou `npm run db:*` déjà câblés dans le repo.

## Proxy Angular

```text
apps/frontend/proxy.conf.json        → http://localhost:3000
apps/frontend/proxy.conf.docker.json → http://api:3000
```

## Docker et exécution locale

- `docker-compose.yml` lance `api`, `frontend` et `db`
- en dev Docker :
  - API exposée sur `3000:3000`
  - Front exposé sur `4200:4200`
- `apps/api/Dockerfile` :
  - image dev avec `npm ci` + `nx serve api`
  - image prod avec `prisma migrate deploy` au démarrage
- `apps/frontend/Dockerfile` :
  - image dev avec `nx serve frontend --proxy-config apps/frontend/proxy.conf.docker.json`
  - image prod servie par Nginx sur le port 80

Si tu modifies des fichiers de config structurants (`project.json`, `tsconfig*`, Dockerfiles, etc.), un redémarrage complet est souvent plus sûr :

```bash
make down
make dev
```

## Workflow Git

```text
main         → branche de référence
feature/*    → branches de travail
fix/*        → corrections ciblées
```

Conventions :

- PR vers `main`
- CI attendue au vert avant merge
- commits : `feat:` `fix:` `chore:` `ci:` `docs:` `refactor:` `test:`

## CI/CD documenté dans le repo

- `ci.yml`
  - install `npm ci`
  - `db:generate`
  - lint `frontend` + `api`
  - tests `shared` + `frontend` + `api`
  - build `frontend` + `api`
- `deploy-staging.yml`
  - push sur `main`
  - build/push Docker vers `ghcr.io/remymoro/rdc-api` et `ghcr.io/remymoro/rdc-frontend`
  - déploiement via SSH avec `docker-compose.staging.yml`
- `deploy-prod.yml`
  - déclenchement manuel
  - confirmation explicite requise
  - `docker compose pull && docker compose up -d`

## Infrastructure connue depuis le repo

- Registry Docker : `ghcr.io`
- Déploiement staging via `docker-compose.staging.yml`
- PostgreSQL 16
- Front prod servi par Nginx
- Certaines infos d'exploitation externes au repo (DNS publics, reverse proxy global, IP VPS, SSL) doivent être confirmées hors code si nécessaire

## Variables d'environnement

Copier `.env.example` en `.env` pour le dev local. Ne jamais committer `.env`.

```bash
# DB
POSTGRES_PASSWORD=changeme
POSTGRES_DB=rdc
DATABASE_URL=postgresql://postgres:changeme@db:5432/rdc

# API
PORT=3000
NODE_ENV=development

# Auth
AUTH_ACCESS_TOKEN_SECRET=change-me-access-secret
AUTH_REFRESH_TOKEN_SECRET=change-me-refresh-secret
AUTH_ACCESS_TOKEN_TTL_SECONDS=900
AUTH_REFRESH_TOKEN_TTL_SECONDS=604800
AUTH_PROTECT_CENTRES=false
```

## État actuel

- [x] Monorepo Nx — Angular 21 + NestJS 11
- [x] `libs/domain` — entités `Centre` / `User`, 7 value objects, exceptions, interfaces
- [x] `libs/shared` — DTOs partagés front + back
- [x] Prisma — schéma + migrations `init` et `auth`
- [x] Domaine centre — backend CRUD + statuts
- [x] Auth JWT — backend (login, refresh, logout, bootstrap admin, CRUD responsables)
- [x] Auth JWT — frontend (facade, interceptor, guards, login, routage par rôle)
- [x] Front Angular — shells `admin` et `centre`
- [x] Docker Compose dev — API + frontend + PostgreSQL
- [x] CI GitHub Actions — lint + test + build
- [x] Workflow staging — build/push images + déploiement SSH
- [x] Workflow production — déploiement manuel
- [x] Tests : 92 `domain`, 55 `api`
- [ ] Domaine magasin
- [ ] Domaine campagne
- [ ] Domaine slot / bénévole
- [ ] Exports PDF / Excel
- [ ] Stockage objet type Azure Blob Storage

## Vision métier cible

```text
CAMPAGNE
  └── CENTRE
        └── MAGASIN
              └── SLOT
                    └── BENEVOLE
```

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
