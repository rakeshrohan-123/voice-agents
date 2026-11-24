#!/bin/bash
# Backend startup script — loads .env properly before uvicorn
set -a
source "$(dirname "$0")/.env"
set +a
exec "$(dirname "$0")/venv/bin/uvicorn" app.main:app --host 0.0.0.0 --port 8000 --reload
