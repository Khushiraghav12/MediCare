@echo off
echo ========================================
echo   GARUN.ai Medical Chatbot Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

echo ✅ Python is installed
echo.

REM Navigate to medical chatbot directory
cd medical_chatbot

REM Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found!
    echo Creating .env file from template...
    copy env_example.txt .env
    echo.
    echo 📝 Please edit .env file and add your API keys:
    echo    - GOOGLE_API_KEY: Get from https://makersuite.google.com/app/apikey
    echo    - PINECONE_API_KEY: Get from https://app.pinecone.io/
    echo.
    echo After adding your API keys, run this script again.
    pause
    exit /b 1
)

echo ✅ .env file found
echo.

REM Install Python dependencies
echo 📦 Installing Python dependencies...
pip install -r requirements.txt

if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

REM Set up vector database
echo 🗄️  Setting up medical knowledge base...
python store_index.py

if errorlevel 1 (
    echo ⚠️  Vector database setup failed
    echo The chatbot will run in demo mode
    echo.
)

echo.
echo 🚀 Starting GARUN.ai Medical Chatbot...
echo.
echo The chatbot will be available at:
echo   - Backend: http://localhost:5001
echo   - Frontend: Open chat.html in your browser
echo.
echo Press Ctrl+C to stop the server
echo.

python app.py

pause
