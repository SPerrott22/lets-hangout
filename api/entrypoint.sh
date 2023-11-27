#!/bin/bash
# entrypoint.sh

set -e

# Wait for CockroachDB to become available.
echo "Waiting for CockroachDB..."
# while ! nc -z lb 26257; do
#   sleep 0.5
# done

echo "CockroachDB started"

echo "Starting Flask..."
# Run the main container command.
exec "$@"
