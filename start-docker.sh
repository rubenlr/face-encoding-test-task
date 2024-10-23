#!/bin/bash

docker-compose down
docker-compose up -d

container_name="face-encoding-api-test"

echo "Waiting for ${container_name} to become healthy..."

until [ "$(docker inspect -f '{{.State.Health.Status}}' "$container_name")" == "healthy" ]; do
  echo "Waiting for the service to start..."
  sleep 2
done

echo "${container_name} is healthy and ready!"
