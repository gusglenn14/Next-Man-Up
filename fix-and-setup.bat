@echo off
REM 🚀 NBA Injury Tracker - Automated Setup Script (Windows)
REM This script fixes all common issues and sets up the project

echo.
echo 🏀 NBA Injury Tracker - Automated Setup
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "frontend" (
    echo [ERROR] Please run this script from the project root directory
    echo [ERROR] Expected directories: frontend\ and backend\
    pause
    exit /b 1
)

if not exist "backend" (
    echo [ERROR] Please run this script from the project root directory
    echo [ERROR] Expected directories: frontend\ and backend\
    pause
    exit /b 1
)

echo [INFO] Starting automated setup...

REM Step 1: Fix directory structure
echo [INFO] Step 1: Fixing directory structure...

if exist "frontend\srs" (
    echo [INFO] Renaming 'srs' directory to 'src'...
    move "frontend\srs" "frontend\src"
    echo [SUCCESS] Directory renamed successfully
) else (
    echo [WARNING] Directory 'frontend\srs' not found - may already be fixed
)

if exist "frontend\index-3.html" (
    echo [INFO] Renaming 'index-3.html' to 'index.html'...
    move "frontend\index-3.html" "frontend\index.html"
    echo [SUCCESS] File renamed successfully
) else (
    echo [WARNING] File 'frontend\index-3.html' not found - may already be fixed
)

REM Step 2: Check Node.js installation
echo [INFO] Step 2: Checking Node.js installation...

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo [INFO] Please install Node.js from https://nodejs.org/
    echo [INFO] After installation, run this script again
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [SUCCESS] Node.js is installed: %NODE_VERSION%
)

npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [SUCCESS] npm is installed: %NPM_VERSION%
)

REM Step 3: Install frontend dependencies
echo [INFO] Step 3: Installing frontend dependencies...

cd frontend
if not exist "package.json" (
    echo [ERROR] package.json not found in frontend directory!
    pause
    exit /b 1
)

echo [INFO] Running 'npm install' in frontend directory...
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies!
    pause
    exit /b 1
)
echo [SUCCESS] Frontend dependencies installed successfully

REM Step 4: Install backend dependencies
echo [INFO] Step 4: Installing backend dependencies...

cd ..\backend
if not exist "package.json" (
    echo [ERROR] package.json not found in backend directory!
    pause
    exit /b 1
)

echo [INFO] Running 'npm install' in backend directory...
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies!
    pause
    exit /b 1
)
echo [SUCCESS] Backend dependencies installed successfully

REM Step 5: Setup environment file
echo [INFO] Step 5: Setting up environment configuration...

if not exist ".env" (
    if exist "env.example" (
        echo [INFO] Creating .env file from template...
        copy "env.example" ".env"
        echo [SUCCESS] Environment file created successfully
        echo [WARNING] Remember to add your Yahoo API credentials to backend\.env
    ) else (
        echo [WARNING] env.example not found - creating basic .env file...
        (
            echo # Yahoo Fantasy Sports API Configuration
            echo # Get your API credentials from https://developer.yahoo.com/apps/create/
            echo.
            echo # Yahoo OAuth Credentials
            echo YAHOO_CLIENT_ID=your_client_id_here
            echo YAHOO_CLIENT_SECRET=your_client_secret_here
            echo.
            echo # Server Configuration
            echo PORT=3001
            echo NODE_ENV=development
            echo.
            echo # Frontend URL ^(for CORS^)
            echo FRONTEND_URL=http://localhost:5173
        ) > .env
        echo [SUCCESS] Basic environment file created
    )
) else (
    echo [WARNING] .env file already exists - skipping creation
)

REM Step 6: Verify setup
echo [INFO] Step 6: Verifying setup...

cd ..\frontend

REM Check if main files exist
if exist "src\main.jsx" if exist "index.html" (
    echo [SUCCESS] Core files are in place
) else (
    echo [ERROR] Core files missing! Setup may have failed.
    pause
    exit /b 1
)

REM Check if node_modules exist
if exist "node_modules" (
    echo [SUCCESS] Frontend dependencies installed
) else (
    echo [ERROR] Frontend dependencies missing!
    pause
    exit /b 1
)

cd ..\backend
if exist "node_modules" (
    echo [SUCCESS] Backend dependencies installed
) else (
    echo [ERROR] Backend dependencies missing!
    pause
    exit /b 1
)

REM Final success message
echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo [SUCCESS] All issues have been fixed and dependencies installed!
echo.
echo Next steps:
echo 1. Start the frontend:
echo    cd frontend ^&^& npm run dev
echo.
echo 2. ^(Optional^) Start the backend:
echo    cd backend ^&^& npm start
echo.
echo 3. Open your browser:
echo    http://localhost:5173
echo.
echo 4. Select 'Demo Mode' to get started immediately!
echo.
echo [WARNING] For Yahoo API integration, edit backend\.env with your credentials
echo.
echo 📚 Documentation:
echo    - START_HERE.md - Quick start guide
echo    - QUICK_REFERENCE.md - Command cheat sheet
echo    - SETUP_AND_FIX_GUIDE.md - Complete troubleshooting
echo.
echo 🏀 Go win your fantasy league!
echo.
pause
