#!/bin/bash
# entrypoint.sh

set -e

for node in crdb-0 crdb-1 crdb-2; do
    while ! nc -z $node 26257; do
        echo "Waiting for CockroachDB node $node to be ready..."
        sleep 1
    done
done

echo "Starting Nginx..."
exec "$@"
