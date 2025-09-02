#!/bin/bash

echo "Starting Diagramator services..."

# Build and start the containers in detached mode
docker-compose up --build -d

echo "Services started. Tailing logs..."
echo "Press Ctrl+C to stop tailing logs."

# Tail the logs
docker-compose logs -f
