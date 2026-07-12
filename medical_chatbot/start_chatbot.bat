@echo off
echo Starting GARUN.ai Medical Chatbot Backend...
echo.

REM Check if .env file exists
if not exist .env (
    echo WARNING: .env file not found!
    echo Please copy env_example.txt to .env and add your API keys.
    echo.
    pause
    exit /b 1
)

REM Install dependencies if needed
echo Installing/updating dependencies...
pip install -r requirements.txt

echo.
echo Starting Flask server...
echo Medical Chatbot will be available at: http://localhost:5001
echo.

python app.py

pause
