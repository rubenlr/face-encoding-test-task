# Makefile for Face Encoding API test

DOCKER_IMAGE = face-encoding-api-test:latest
DOCKER_CONTAINER = face-encoding-api-test-container

# Default target
.PHONY: default
default: build debug

# Build docker image
.PHONY: build
build:
	@echo "Building Docker image..."
	docker build -t $(DOCKER_IMAGE) .

# Run the Docker container
.PHONY: start
start: stop
	@echo "Running Docker container..."
	docker run -p 3000:3000 --name $(DOCKER_CONTAINER) $(DOCKER_IMAGE)

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
	@echo "  make build    - Build the TypeScript project"
	@echo "  make logs     - Show logs
	@echo "  make start    - Run the application"
	@echo "  make stop     - Stop and remove the Docker container"
	@echo "  make help     - Display this help message"
