.PHONY: dev down logs ps db-only db-migrate db-studio

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

db-studio:
	docker compose run --rm api sh -c "npm run db:studio"
