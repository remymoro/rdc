.PHONY: dev down logs ps db-only db-migrate db-reset db-init db-studio

dev:
	docker compose up --build

down:
	docker compose down

logs:
	docker compose logs -f

ps:
	docker compose ps

db-only:
	docker compose up db

db-migrate:
	docker compose run --rm api sh -c "npm run db:migrate"

db-reset:
	docker compose run --rm api sh -c "npm run db:reset"

db-init:
	docker compose run --rm api sh -c "npm run db:init"

db-studio:
	docker compose run --rm api sh -c "npm run db:studio"
