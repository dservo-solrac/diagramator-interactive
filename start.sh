#!/bin/bash

echo "Stopping and removing existing containers and volumes..."
docker-compose down --volumes

echo "Starting Diagramator services..."

# Build and start the containers in detached mode
docker-compose up --build -d

echo "Services started. Tailing logs..."
echo "Press Ctrl+C to stop tailing logs."

# Tail the logs
docker-compose logs -f
