.PHONY: dev down logs ps db-only

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
