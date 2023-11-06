#!/bin/bash
# entrypoint.sh

set -e

# Wait for Postgres to become available.
echo "Waiting for postgres..."
while ! nc -z flask_db 5432; do
  sleep 0.5
done

echo "PostgreSQL started"

echo "Starting Flask..."
# Run the main container command.
exec "$@"
