# Makefile for Face Encoding API test

DOCKER_IMAGE = face-encoding-api-test:latest
DOCKER_CONTAINER = face-encoding-api-test

# Default target
.PHONY: default
default: build

# CI target
.PHONY: ci
ci: build start stop

# Build docker image
.PHONY: build
build:
	@echo "Building Docker image..."
	docker build -t $(DOCKER_IMAGE) .

# Run the Docker container and wait for the application be ready
.PHONY: start
start: stop
	@echo "Running Docker container..."
	./start-docker.sh
	@echo "Waiting for port 3000 to be ready..."
	npx wait-on http://localhost:3000 --timeout 30000
	@echo "App is ready and listening on port 3000"

.PHONY: logs
logs:
	@echo "Showing logs..."
	docker logs $(DOCKER_CONTAINER)

.PHONY: debug
debug: start
	@echo "Start debugging..."
	docker exec -it $(DOCKER_CONTAINER) /bin/sh

# Stop and remove the Docker container
.PHONY: stop
stop:
	@echo "Stopping and removing Docker container..."
	docker stop $(DOCKER_CONTAINER) || true
	docker rm $(DOCKER_CONTAINER) || true

# Help command to display available targets
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make          - Build the project (default)"
	@echo "  make ci       - Execute CI targets to validate the entire flow"
	@echo "  make build    - Build the TypeScript project"
	@echo "  make logs     - Show logs
	@echo "  make start    - Run the application"
	@echo "  make stop     - Stop and remove the Docker container"
	@echo "  make help     - Display this help message"
