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

- `AuthFacade` garde l'`accessToken` en mémoire uniquement
- `auth-token.interceptor.ts` injecte `Authorization: Bearer ...` hors login/refresh
- `login()`, `refresh()` et `logout()` utilisent `withCredentials: true`
- Initialisation de session : `refresh()` direct via le cookie HTTP-only
- `me()` reste disponible mais n'a plus besoin de paramètre token
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

## Audit DDD / Hexa pour Claude

Quand tu audits ce repo, fais un **vrai contrôle d'architecture**, pas seulement un check syntaxique.

### Ce qu'il faut vérifier en priorité

```text
1. libs/domain reste pur
2. application ne dépend pas des frameworks ou de l'infrastructure
3. presentation reste mince et ne porte pas la logique métier
4. infrastructure implémente les ports sans contaminer le domaine
5. le frontend respecte aussi ses couches (features/ui → facades → ports → adapters)
```

### Règles de dépendances attendues

- `libs/domain`
  - autorisé : fichiers du domaine, types utilitaires TS/JS purs
  - interdit : `@nestjs/*`, `@angular/*`, Prisma, `express`, `pg`, `rxjs`, `axios`, DTOs de `libs/shared`
- `apps/api/src/application`
  - autorisé : `@rdc/domain`, interfaces/ports applicatifs, types simples
  - à éviter fortement : dépendance directe à `presentation/`, `infrastructure/`, Prisma, Express
- `apps/api/src/presentation`
  - autorisé : HTTP, validation, cookies, filtres, guards, appel des use cases
  - interdit : logique métier lourde, règles de domaine dupliquées, accès direct Prisma
- `apps/api/src/infrastructure`
  - autorisé : Prisma, bcrypt, crypto, adaptateurs, mapping persistence ↔ domain
  - interdit : règles métier qui devraient vivre dans `libs/domain`
- `apps/frontend/src/app/application`
  - autorisé : ports, facades, orchestration d'état
  - interdit : `HttpClient` direct dans les facades si l'appel doit passer par un port
- `apps/frontend/src/app/infrastructure`
  - autorisé : `HttpClient`, interceptors, guards techniques, repositories HTTP
- `apps/frontend/src/app/features` et `ui`
  - autorisé : composants Angular, interaction avec facades
  - interdit : appels HTTP directs, logique métier cœur, accès direct à Prisma ou à la persistence

### Ce qui est toléré comme composition root

Ne pas sur-signaler ces fichiers comme violations d'architecture :

- `apps/api/src/app/app.module.ts`
- `apps/api/src/app/auth.module.ts`
- `apps/api/src/app/centre.module.ts`
- `apps/frontend/src/app/app.config.ts`
- `apps/frontend/src/app/app.routes.ts`
- `apps/api/src/main.ts`

Ces fichiers ont le droit de brancher les implémentations concrètes sur les ports et de câbler le runtime.

### Red flags à signaler

- import framework dans `libs/domain`
- import de `infrastructure` ou `presentation` depuis `application`
- contrôleur Nest qui contient de la vraie logique métier au lieu d'orchestrer un use case
- repository Prisma qui retourne des objets persistence bruts au lieu d'objets domaine ou DTOs attendus
- façade Angular qui devient une couche métier trop riche ou fait du transport direct
- composant `features/` ou `ui/` qui fait un appel HTTP direct
- duplication des règles de validation métier entre `libs/domain` et les couches périphériques
- usage de DTOs `shared` dans `libs/domain`
- décision de rôle / sécurité dispersée dans plusieurs couches au lieu d'être clairement centralisée

### Points déjà sensibles dans le repo actuel

- `apps/api/src/presentation/http/controllers/auth.controller.ts`
  - injecte `TokenService` depuis l'infrastructure pour gérer le cookie de refresh
  - ce n'est pas catastrophique, mais c'est une entorse à une séparation stricte
- les use cases backend utilisent `@Injectable()` / `@Inject()` Nest
  - acceptable pragmatiquement aujourd'hui
  - si l'objectif devient une pureté maximale, il faudra sortir ces décorateurs du cœur applicatif
- `apps/frontend/src/app/infrastructure/guards/admin.guard.ts`
  - existe encore
  - le routing courant s'appuie surtout sur `authGuard` + `roleGuard`
  - si tu vois du code mort ou plus aligné avec les routes, remonte-le
- `apps/api/src/infrastructure/prisma/generated/`
  - appartient strictement à l'infrastructure
  - si ce code fuit dans `application` ou `domain`, c'est un vrai problème

### Commandes utiles pour l'audit

```bash
# Checks Nx de base
npm exec nx lint api
npm exec nx lint frontend
npm exec nx lint domain
npm exec nx test api
npm exec nx test frontend
npm exec nx test domain
npm exec nx build api
npm exec nx build frontend

# Recherche d'import framework ou de fuite de couche
rg -n "from '@nestjs|from '@angular|from '@prisma|from 'express|from 'pg|from 'axios|from 'rxjs'" libs/domain apps/api/src/application
rg -n "from '../infrastructure|from '../../infrastructure|from '../presentation|from '../../presentation'" apps/api/src/application
rg -n "HttpClient|fetch\\(|axios\\(" apps/frontend/src/app/features apps/frontend/src/app/ui
rg -n "from '@rdc/shared'" libs/domain
rg -n "prisma|Prisma|PrismaService" apps/api/src/application apps/api/src/presentation
```

### Attendu du rapport d'audit

Quand tu rends un avis, donne :

- les **findings d'abord**, classés par sévérité
- pour chaque finding : fichier, ligne, règle DDD/Hexa concernée, impact concret
- distingue :
  - violation certaine
  - dette acceptable / compromis pragmatique
  - simple piste de durcissement architectural
- si tout est globalement cohérent, dis-le explicitement, puis liste les zones à surveiller

### Barème pratique

- **Critique**
  - `libs/domain` importe un framework ou de l'infrastructure
  - `application` dépend directement de Prisma, Express, Angular, HttpClient, contrôleurs
- **Important**
  - logique métier significative en contrôleur / guard / repository
  - fuite de types persistence dans les couches métier
- **Modéré**
  - couplage technique pragmatique mais améliorable
  - duplication de validation ou de mapping
- **Faible**
  - naming, organisation, code mort, cohérence de dossier

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
  - build/push Docker vers `ghcr.io/remymoro/rdc-api` et `ghcr.io/remymoro/rdc-frontend` avec `target: prod`
  - copie `docker-compose.staging.yml` sur le VPS
  - déploiement via SSH avec `docker-compose.staging.yml`
- `deploy-prod.yml`
  - déclenchement manuel
  - confirmation explicite requise
  - copie `docker-compose.prod.yml` sur le VPS
  - `docker compose -f docker-compose.prod.yml pull && up -d --remove-orphans`

## Infrastructure connue depuis le repo

- Registry Docker : `ghcr.io`
- Déploiement staging via `docker-compose.staging.yml`
- Déploiement production via `docker-compose.prod.yml`
- PostgreSQL 16
- Front prod servi par Nginx
- En staging/prod, les services HTTP sont bindés sur `127.0.0.1`
- La base n'est pas exposée publiquement dans les compose staging/prod
- Volumes DB séparés : `postgres_staging_data` et `postgres_prod_data`
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
