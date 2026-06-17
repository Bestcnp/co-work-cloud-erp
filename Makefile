.PHONY: up down restart logs logs-backend logs-frontend logs-firebase ps shell-backend shell-frontend clean rebuild seed

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f backend

logs-frontend:
	docker compose logs -f frontend

logs-firebase:
	docker compose logs -f firebase-emulators

ps:
	docker compose ps

shell-backend:
	docker compose exec backend sh

shell-frontend:
	docker compose exec frontend sh

clean:
	docker compose down -v

rebuild:
	docker compose build --no-cache

seed:
	@echo "TODO: Add seed data script"
