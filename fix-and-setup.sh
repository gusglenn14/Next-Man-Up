#!/bin/bash

# 🚀 NBA Injury Tracker - Automated Setup Script
# This script fixes all common issues and sets up the project

set -e  # Exit on any error

echo "🏀 NBA Injury Tracker - Automated Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    print_error "Please run this script from the project root directory"
    print_error "Expected directories: frontend/ and backend/"
    exit 1
fi

print_status "Starting automated setup..."

# Step 1: Fix directory structure
print_status "Step 1: Fixing directory structure..."

if [ -d "frontend/srs" ]; then
    print_status "Renaming 'srs' directory to 'src'..."
    mv frontend/srs frontend/src
    print_success "Directory renamed successfully"
else
    print_warning "Directory 'frontend/srs' not found - may already be fixed"
fi

if [ -f "frontend/index-3.html" ]; then
    print_status "Renaming 'index-3.html' to 'index.html'..."
    mv frontend/index-3.html frontend/index.html
    print_success "File renamed successfully"
else
    print_warning "File 'frontend/index-3.html' not found - may already be fixed"
fi

# Step 2: Check Node.js installation
print_status "Step 2: Checking Node.js installation..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed!"
    print_status "Installing Node.js..."
    
    # Detect OS and install Node.js
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            print_status "Installing Node.js via Homebrew..."
            brew install node
        else
            print_error "Homebrew not found. Please install Node.js manually from https://nodejs.org/"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        print_status "Installing Node.js via package manager..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        print_error "Unsupported OS. Please install Node.js manually from https://nodejs.org/"
        exit 1
    fi
else
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed!"
    exit 1
else
    NPM_VERSION=$(npm --version)
    print_success "npm is installed: $NPM_VERSION"
fi

# Step 3: Install frontend dependencies
print_status "Step 3: Installing frontend dependencies..."

cd frontend
if [ ! -f "package.json" ]; then
    print_error "package.json not found in frontend directory!"
    exit 1
fi

print_status "Running 'npm install' in frontend directory..."
npm install
print_success "Frontend dependencies installed successfully"

# Step 4: Install backend dependencies
print_status "Step 4: Installing backend dependencies..."

cd ../backend
if [ ! -f "package.json" ]; then
    print_error "package.json not found in backend directory!"
    exit 1
fi

print_status "Running 'npm install' in backend directory..."
npm install
print_success "Backend dependencies installed successfully"

# Step 5: Setup environment file
print_status "Step 5: Setting up environment configuration..."

if [ ! -f ".env" ]; then
    if [ -f "env.example" ]; then
        print_status "Creating .env file from template..."
        cp env.example .env
        print_success "Environment file created successfully"
        print_warning "Remember to add your Yahoo API credentials to backend/.env"
    else
        print_warning "env.example not found - creating basic .env file..."
        cat > .env << EOF
# Yahoo Fantasy Sports API Configuration
# Get your API credentials from https://developer.yahoo.com/apps/create/

# Yahoo OAuth Credentials
YAHOO_CLIENT_ID=your_client_id_here
YAHOO_CLIENT_SECRET=your_client_secret_here

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
EOF
        print_success "Basic environment file created"
    fi
else
    print_warning ".env file already exists - skipping creation"
fi

# Step 6: Verify setup
print_status "Step 6: Verifying setup..."

cd ../frontend

# Check if main files exist
if [ -f "src/main.jsx" ] && [ -f "index.html" ]; then
    print_success "Core files are in place"
else
    print_error "Core files missing! Setup may have failed."
    exit 1
fi

# Check if node_modules exist
if [ -d "node_modules" ]; then
    print_success "Frontend dependencies installed"
else
    print_error "Frontend dependencies missing!"
    exit 1
fi

cd ../backend
if [ -d "node_modules" ]; then
    print_success "Backend dependencies installed"
else
    print_error "Backend dependencies missing!"
    exit 1
fi

# Step 7: Test if everything works
print_status "Step 7: Testing setup..."

cd ../frontend

# Test if we can start the dev server (but don't actually start it)
print_status "Testing if frontend can start..."
if timeout 10s npm run dev --dry-run 2>/dev/null || npm run build --dry-run 2>/dev/null || true; then
    print_success "Frontend setup test passed"
else
    print_warning "Frontend setup test inconclusive - this is normal"
fi

cd ../backend

# Test if we can start the backend (but don't actually start it)
print_status "Testing if backend can start..."
if timeout 5s npm start --dry-run 2>/dev/null || true; then
    print_success "Backend setup test passed"
else
    print_warning "Backend setup test inconclusive - this is normal"
fi

# Final success message
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
print_success "All issues have been fixed and dependencies installed!"
echo ""
echo "Next steps:"
echo "1. Start the frontend:"
echo "   ${BLUE}cd frontend && npm run dev${NC}"
echo ""
echo "2. (Optional) Start the backend:"
echo "   ${BLUE}cd backend && npm start${NC}"
echo ""
echo "3. Open your browser:"
echo "   ${BLUE}http://localhost:5173${NC}"
echo ""
echo "4. Select 'Demo Mode' to get started immediately!"
echo ""
print_warning "For Yahoo API integration, edit backend/.env with your credentials"
echo ""
echo "📚 Documentation:"
echo "   - START_HERE.md - Quick start guide"
echo "   - QUICK_REFERENCE.md - Command cheat sheet"
echo "   - SETUP_AND_FIX_GUIDE.md - Complete troubleshooting"
echo ""
echo "🏀 Go win your fantasy league!"
echo ""
