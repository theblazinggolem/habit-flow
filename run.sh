#!/bin/bash

# Ensure script is run from project root
cd "$(dirname "$0")"

echo "Building Frontend..."
npm run build

echo "Starting Backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1
python3 app.py
