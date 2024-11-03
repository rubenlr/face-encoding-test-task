#!/bin/bash

docker-compose -f docker-compose.test.yml up -d

check_healthy() {
  SERVICES=$(docker-compose -f docker-compose.test.yml config --services)
  TOTAL_SERVICES=$(echo "$SERVICES" | wc -l)
  STATUS=$(docker ps --filter "status=running" --filter "health=healthy" --format "{{.Names}}")

  HEALTHY_SERVICES=0
  for service in $SERVICES; do
    if echo "$STATUS" | grep -q "$service"; then   
      HEALTHY_SERVICES=$((HEALTHY_SERVICES + 1))
    fi
  done

  if [ "$HEALTHY_SERVICES" -eq 1 ]; then
    return 0
  else
    return 1
  fi
}

# function need to be exported to be used inside timeout with new bash
export -f check_healthy

echo "Waiting for all dependency services to be healthy..."
if ! timeout 30s bash -c 'until check_healthy; do sleep 1; done'; then
  echo "Timeout reached: Not all services became healthy in time."
  echo "Aborting script."
  exit 1
fi
echo "All services are healthy!"
