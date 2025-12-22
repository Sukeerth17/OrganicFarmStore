#!/usr/bin/env bash
# Render build script for organic farm backend
# This runs during deployment to set up the database

# Exit on error
set -o errexit

echo "🌿 Installing dependencies..."
cd backend
npm install

echo "🗄️ Initializing database..."
npm run db:init

echo "✅ Build complete!"