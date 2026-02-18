@echo off
cd /d %~dp0

echo Building Frontend...
call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed. Exiting.
    exit /b %errorlevel%
)

echo Starting Backend...
cd backend

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt > NUL 2>&1

echo Starting Flask server...
python app.py
