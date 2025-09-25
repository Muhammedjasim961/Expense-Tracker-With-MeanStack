#!/bin/bash
set -e

echo "=== Installing Frontend Dependencies ==="
cd frontend
npm install --legacy-peer-deps

echo "=== Building Angular Application ==="
npm run build:prod

echo "=== Installing Backend Dependencies ==="
cd ../backend
npm install

echo "=== Build Completed Successfully ==="
