# RDC — Contexte Projet pour Agent IA

## Stack technique

- **Monorepo** : Nx 22.5.4
- **Frontend** : Angular 21 (standalone)
- **Backend** : NestJS 11
- **Lib partagée** : `libs/shared` (code partagé front+back)
- **Base de données** : PostgreSQL 16
- **ORM** : Prisma (à installer/configurer)
- **Node.js** : 24.x
- **Package manager** : npm

## Structure du monorepo

### Structure actuelle

```
apps/
├── api/
│   ├── prisma/
│   └── src/
│       ├── main.ts
│       ├── app/
│       ├── presentation/http/controllers/
│       ├── application/use-cases/
│       ├── domain/
│       └── infrastructure/
│           ├── repositories/
│           └── prisma/
├── api-e2e/
└── frontend/
    └── src/app/
        ├── app.ts
        ├── app.routes.ts
        ├── app.config.ts
        ├── application/facades/
        ├── infrastructure/repositories/
        └── ui/
libs/
└── shared/
    └── src/domain/
        ├── entities/
        ├── value-objects/
        ├── interfaces/
        └── dtos/
```

### Structure cible (DDD + hexagonale — Ports & Adapters)

> Objectif : isoler le **domain** et contrôler les dépendances (frameworks en périphérie).

```
apps/
├── frontend/
│   └── src/app/
│       ├── application/facades/
│       ├── infrastructure/repositories/
│       └── ui/
└── api/
    ├── prisma/
    │   └── schema.prisma
    └── src/
        ├── main.ts
        ├── presentation/
        │   └── http/controllers/
        ├── application/
        │   └── use-cases/
        ├── domain/
        └── infrastructure/
            ├── repositories/
            └── prisma/
libs/
└── shared/
    └── src/
        ├── domain/
        │   ├── entities/
        │   ├── value-objects/
        │   └── interfaces/
        └── dtos/
```

## Architecture — DDD + Hexagonale (Ports & Adapters)

### Règle fondamentale

Le **domain** ne dépend de rien. Tout dépend du domain.

- `domain/` → zéro dépendance externe
- `application/` → dépend de `domain/` uniquement
- `infrastructure/` → dépend de `domain/` + libs tierces (DB, HTTP, etc.)
- `presentation/` → dépend de `application/` uniquement

### Flux API (NestJS)

```
HTTP Request
    ↓
presentation/http/controllers/
    ↓
application/use-cases/
    ↓
domain/
    ↓
infrastructure/repositories/ → PostgreSQL
```

### Flux Frontend (Angular)

```
ui/
    ↓
application/facades/      ← state + actions
    ↓
infrastructure/repositories/ ← HttpClient → API
```

### Contenu de `libs/shared`

- Types/DTOs partagés (front + back)
- Interfaces (ports) : contrats des repositories/services
- Éventuellement des types de domaine *purs* (si pas de dépendances runtime)

## Commandes utiles

```bash
# Docker
make dev        # docker compose up --build
make down       # docker compose down
make logs       # docker compose logs -f
make ps         # docker compose ps
make db-only    # PostgreSQL uniquement
make db-migrate # migrations Prisma (depuis Docker)
make db-studio  # Prisma Studio (depuis Docker)

# Nx
npx nx serve api
npx nx serve frontend
npx nx lint api
npx nx lint frontend
npx nx test api
npx nx test frontend
npx nx graph
npx nx show project api

# Prisma (après installation)
# Exemples (si Prisma est installé dans l'app API)
npx prisma migrate dev
npx prisma generate
npx prisma studio
```

Recommandation : lancer Prisma depuis Docker (même réseau que Postgres, pas de souci `db:5432` vs `localhost`).

## Workflow Git

- **main** : branche stable
- **feature/xxx** : branches de travail
- Passer par PR vers `main`
- CI doit être vert avant merge
- Convention commits : `feat:` `fix:` `chore:` `ci:` `docs:` `refactor:`

## CI/CD

- CI GitHub Actions : lint + test + build (présent dans le repo)
- Déploiements : à définir (staging/prod)

## Infrastructure cible (à confirmer)

- Déploiement : VPS (Docker Compose)
- Registry : ghcr.io
- Stockage fichiers : Azure Blob Storage
- BDD : PostgreSQL 16

## Variables d'environnement

Copier `.env.example` en `.env` — **ne jamais committer `.env`**.

Variables utilisées par notre setup Docker actuel :

```bash
# DB
POSTGRES_PASSWORD=changeme
POSTGRES_DB=rdc
DATABASE_URL=postgresql://postgres:changeme@db:5432/rdc

# API
PORT=3000
NODE_ENV=development
```

> Note : `DATABASE_URL` (host `db`) est fait pour les services Docker. Pour lancer Prisma depuis ta machine, préfère `make db-migrate` / `make db-studio`.

## Docker — hot reload

Volumes montés : `apps/*/src` + `libs/`.
Si tu modifies `project.json`, `tsconfig*.json`, `webpack.config.js`, etc. :

```bash
make down && make dev
```

## État actuel

- [x] Monorepo Nx — Angular 21 + NestJS 11 + shared
- [x] GitHub — branch protection + environments staging/prod
- [x] CI GitHub Actions au vert
- [x] Docker Compose dev — api + frontend + PostgreSQL
- [x] Structure DDD + hexagonale en place
- [ ] Prisma setup + migrations
- [ ] Premier domaine — Magasin
- [ ] Deploy staging — ghcr.io + SSH VPS OVH
- [ ] VPS OVH configuré
- [ ] Azure Blob Storage
