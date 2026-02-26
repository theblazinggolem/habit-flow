#!/bin/bash

# Exit on any error
set -e

# Ensure script is run from project root
cd "$(dirname "$0")"

echo "=== Building Frontend ==="
# Install dependencies if missing
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Build the frontend
npm run build

echo "=== Setting up Backend ==="
cd backend

# Create virtual environment if missing
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements
echo "Installing/Updating backend requirements..."
pip install -r requirements.txt

echo "=== Starting Server ==="
python3 app.py
