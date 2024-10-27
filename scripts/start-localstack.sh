#!/bin/bash

docker-compose -f docker-compose.test.yml up -d

# Function to check if all services are healthy
check_healthy() {
  STATUS=$(docker-compose -f docker-compose.test.yml ps --services --filter "status=running" --filter "health=healthy")
  TOTAL_SERVICES=$(docker-compose -f docker-compose.test.yml config --services | wc -l)
  HEALTHY_SERVICES=$(echo "$STATUS" | wc -l)

  if [ "$HEALTHY_SERVICES" -eq "$TOTAL_SERVICES" ]; then
    return 0  # All services are healthy
  else
    return 1  # Not all services are healthy
  fi
}

# functio need to be exported to be used inside timeout with new bash
export -f check_healthy

echo "Waiting for all dependency services to be healthy..."
if ! timeout 30s bash -c 'until check_healthy; do sleep 1; done'; then
  echo "Timeout reached: Not all services became healthy in time."
  echo "Aborting script."
  exit 1
fi
echo "All services are healthy!"
