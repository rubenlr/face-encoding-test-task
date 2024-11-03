#!/bin/bash

export AWS_DEFAULT_REGION=us-east-1
export AWS_REGION=us-east-1
export AWS_ENDPOINT_URL=http://localhost:4566
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test

delete_table_if_exists() {
  TABLE_NAME=$1
  echo "Checking if table ${TABLE_NAME} exists..."

  aws dynamodb describe-table --table-name "${TABLE_NAME}" --endpoint-url="${AWS_ENDPOINT_URL}" --region "${AWS_REGION}" > /dev/null 2>&1

  if [ $? -eq 0 ]; then
    echo "Table ${TABLE_NAME} exists. Deleting..."
    aws dynamodb delete-table --table-name "${TABLE_NAME}" --endpoint-url="${AWS_ENDPOINT_URL}" --region "${AWS_REGION}" > /dev/null 2>&1
    echo "Table ${TABLE_NAME} deleted."
  else
    echo "Table ${TABLE_NAME} does not exist. Skipping deletion."
  fi
}

delete_table_if_exists "tb_sessions"

echo "Creating table tb_sessions..."
aws dynamodb create-table \
    --table-name tb_sessions \
    --attribute-definitions \
        AttributeName=sessionId,AttributeType=S \
        AttributeName=userId,AttributeType=S \
    --key-schema \
        AttributeName=sessionId,KeyType=HASH \
        AttributeName=userId,KeyType=RANGE \
    --provisioned-throughput ReadCapacityUnits=50,WriteCapacityUnits=50 \
    --region "${AWS_REGION}" \
    --endpoint-url="${AWS_ENDPOINT_URL}" \
    --no-paginate \
    --output json \
    > /dev/null 2>&1

delete_table_if_exists "tb_images"

echo "Creating table tb_images..."
aws dynamodb create-table \
    --table-name tb_images \
    --attribute-definitions \
        AttributeName=imageId,AttributeType=S \
        AttributeName=sessionId,AttributeType=S \
        AttributeName=userId,AttributeType=S \
    --key-schema \
        AttributeName=imageId,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=50,WriteCapacityUnits=50 \
    --global-secondary-indexes \
        "[
            {
                \"IndexName\": \"SessionUserIndex\",
                \"KeySchema\": [
                    {\"AttributeName\":\"sessionId\",\"KeyType\":\"HASH\"},
                    {\"AttributeName\":\"userId\",\"KeyType\":\"RANGE\"}
                ],
                \"Projection\":{
                    \"ProjectionType\":\"ALL\"
                },
                \"ProvisionedThroughput\": {
                    \"ReadCapacityUnits\": 50,
                    \"WriteCapacityUnits\": 50
                }
            }
        ]" \
    --region "${AWS_REGION}" \
    --endpoint-url="${AWS_ENDPOINT_URL}" \
    --no-paginate \
    --output json \
    > /dev/null 2>&1
