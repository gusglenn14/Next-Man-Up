# 🛠️ SETUP AND FIX GUIDE - NBA Injury Tracker

**Complete troubleshooting guide with step-by-step instructions for all edge cases.**

---

## 🚀 Quick Start (Recommended)

### Automated Setup (2 minutes)
```bash
# Linux/Mac
chmod +x fix-and-setup.sh
./fix-and-setup.sh

# Windows
fix-and-setup.bat

# Then start the app
cd frontend
npm run dev
```

**If automated setup works, you're done! Skip to "Testing Your Setup" below.**

---

## 🔧 Manual Setup (If Automated Fails)

### Step 1: Fix Directory Structure
```bash
# Fix the main issues
mv frontend/srs frontend/src
mv frontend/index-3.html frontend/index.html

# Verify the fix
ls -la frontend/src/
ls -la frontend/index.html
```

### Step 2: Install Node.js (If Missing)
```bash
# Check if Node.js is installed
node --version
npm --version

# If not installed, install it:

# macOS (with Homebrew)
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows
# Download from https://nodejs.org/
# Or use Chocolatey: choco install nodejs

# Verify installation
node --version  # Should show v18+ or v20+
npm --version   # Should show 9+ or 10+
```

### Step 3: Install Dependencies
```bash
# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
npm install

# Verify installation
npm list --depth=0
```

### Step 4: Setup Environment
```bash
# Create environment file
cp backend/env.example backend/.env

# Edit the file (optional for demo mode)
# nano backend/.env
# Add your Yahoo API credentials if using full mode
```

### Step 5: Start the Application
```bash
# Terminal 1 - Backend (optional for demo mode)
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## 🐛 Troubleshooting Common Issues

### Issue 1: "Module not found: Can't resolve '/src/main.jsx'"

#### Symptoms:
```bash
Error: Module not found: Can't resolve '/src/main.jsx'
```

#### Root Cause:
- Directory is named `srs` instead of `src`
- HTML file references wrong path

#### Solution:
```bash
# Fix directory name
mv frontend/srs frontend/src

# Verify fix
ls -la frontend/src/main.jsx
```

#### Prevention:
- Always use `src` for source directory
- Don't rename standard directories

---

### Issue 2: "Cannot find module 'react'"

#### Symptoms:
```bash
Error: Cannot find module 'react'
Error: Cannot find module 'vite'
```

#### Root Cause:
- Dependencies not installed
- `node_modules` directory missing

#### Solution:
```bash
# Install dependencies
cd frontend
npm install

# Verify installation
npm list react
npm list vite
```

#### Prevention:
- Always run `npm install` after cloning
- Include `package-lock.json` in git

---

### Issue 3: "Port 5173 is already in use"

#### Symptoms:
```bash
Error: Port 5173 is already in use
```

#### Root Cause:
- Another process using port 5173
- Previous Vite server still running

#### Solution:
```bash
# Find process using port
lsof -i :5173

# Kill the process
lsof -ti:5173 | xargs kill -9

# Or use different port
# Edit vite.config.js:
# server: { port: 5174 }
```

#### Prevention:
- Always stop dev servers properly (Ctrl+C)
- Use different ports for multiple projects

---

### Issue 4: "Command not found: npm"

#### Symptoms:
```bash
bash: npm: command not found
```

#### Root Cause:
- Node.js not installed
- PATH not configured

#### Solution:
```bash
# Install Node.js (see Step 2 above)
# Then verify:
which npm
npm --version
```

#### Prevention:
- Install Node.js before starting project
- Use version managers (nvm, n)

---

### Issue 5: "Permission denied" (Linux/Mac)

#### Symptoms:
```bash
Permission denied: ./fix-and-setup.sh
```

#### Root Cause:
- Script not executable
- Wrong permissions

#### Solution:
```bash
# Make script executable
chmod +x fix-and-setup.sh

# Run script
./fix-and-setup.sh
```

#### Prevention:
- Set executable permissions on scripts
- Use proper file permissions

---

### Issue 6: Yahoo OAuth Authentication Fails

#### Symptoms:
```bash
OAuth failed
No leagues found
```

#### Root Cause:
- Missing API credentials
- Wrong callback URL
- Network issues

#### Solution:
```bash
# 1. Get Yahoo API credentials
# Go to https://developer.yahoo.com/apps/create/
# Create app with Fantasy Sports Read/Write access

# 2. Update .env file
nano backend/.env
# Add:
# YAHOO_CLIENT_ID=your_client_id
# YAHOO_CLIENT_SECRET=your_client_secret

# 3. Restart backend
cd backend
npm start
```

#### Prevention:
- Test API credentials before deployment
- Use proper callback URLs
- Handle network errors gracefully

---

### Issue 7: "Cannot read property of undefined"

#### Symptoms:
```bash
TypeError: Cannot read property 'teammates' of undefined
```

#### Root Cause:
- API response structure changed
- Missing data in API response

#### Solution:
```bash
# Check API response
# Add debugging:
console.log('API Response:', data);

# Add null checks:
if (injury && injury.teammates) {
  // Process teammates
}
```

#### Prevention:
- Always validate API responses
- Add error handling for missing data
- Use TypeScript for type safety

---

## 🔍 Advanced Troubleshooting

### Debug Mode Setup
```bash
# Enable verbose logging
export DEBUG=*
npm run dev

# Check browser console
# Open DevTools (F12)
# Look for errors in Console tab
```

### Network Issues
```bash
# Test API connectivity
curl http://localhost:3001/api/health

# Check CORS settings
# In backend/server.js:
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Performance Issues
```bash
# Check bundle size
npm run build
ls -la dist/

# Analyze bundle
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/assets/*.js
```

---

## 🧪 Testing Your Setup

### Basic Functionality Test
```bash
# 1. Start frontend
cd frontend
npm run dev

# 2. Open browser
# Go to http://localhost:5173

# 3. Verify demo mode works
# Should see 3 injury cards
# Should be able to expand cards
# Should see teammate projections
```

### Interactive Features Test
```bash
# 1. Click on injury card
# Should expand showing teammates

# 2. Click "Edit Stats" on teammate
# Should show input fields

# 3. Change a stat value
# Should see projections update live

# 4. Switch to "Full Version" mode
# Should show Yahoo login button
```

### Backend Test (Optional)
```bash
# 1. Start backend
cd backend
npm start

# 2. Test API endpoint
curl http://localhost:3001/api/health

# 3. Check logs
# Should see "Yahoo Fantasy API server running on port 3001"
```

---

## 🔧 Environment-Specific Setup

### macOS Setup
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Start application
cd frontend && npm run dev
```

### Ubuntu/Debian Setup
```bash
# Update package list
sudo apt update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Start application
cd frontend && npm run dev
```

### Windows Setup
```bash
# Install Node.js from https://nodejs.org/
# Or use Chocolatey:
choco install nodejs

# Install dependencies
cd frontend
npm install
cd ../backend
npm install

# Start application
cd frontend
npm run dev
```

### Docker Setup (Advanced)
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 5173

CMD ["npm", "run", "dev"]
```

```bash
# Build and run
docker build -t nba-injury-tracker .
docker run -p 5173:5173 nba-injury-tracker
```

---

## 🚀 Production Deployment

### Frontend Deployment (Netlify/Vercel)
```bash
# Build for production
cd frontend
npm run build

# Deploy dist/ folder
# Netlify: Drag and drop dist/ folder
# Vercel: Connect GitHub repository
```

### Backend Deployment (Heroku/Railway)
```bash
# Create Procfile
echo "web: node server.js" > Procfile

# Set environment variables
heroku config:set YAHOO_CLIENT_ID=your_client_id
heroku config:set YAHOO_CLIENT_SECRET=your_client_secret

# Deploy
git push heroku main
```

### Environment Variables for Production
```bash
# Required
YAHOO_CLIENT_ID=your_client_id
YAHOO_CLIENT_SECRET=your_client_secret

# Optional
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-app.netlify.app
```

---

## 🔒 Security Considerations

### Development Security
```bash
# Never commit .env files
echo ".env" >> .gitignore

# Use environment variables
# Don't hardcode API keys
```

### Production Security
```bash
# Use HTTPS for OAuth
# Validate all inputs
# Rate limit API calls
# Sanitize user data
```

---

## 📊 Performance Optimization

### Frontend Optimization
```bash
# Enable gzip compression
# Use CDN for static assets
# Implement lazy loading
# Optimize images
```

### Backend Optimization
```bash
# Add caching
# Use connection pooling
# Implement rate limiting
# Monitor performance
```

---

## 🆘 Emergency Recovery

### Complete Reset
```bash
# Nuclear option - start completely fresh
rm -rf frontend/node_modules backend/node_modules
rm frontend/package-lock.json backend/package-lock.json
rm backend/.env

# Reinstall everything
./fix-and-setup.sh
```

### Backup and Restore
```bash
# Backup important files
cp frontend/src/components/InjuryTrackerDemo.jsx InjuryTrackerDemo.jsx.backup
cp backend/.env .env.backup

# Restore if needed
cp InjuryTrackerDemo.jsx.backup frontend/src/components/InjuryTrackerDemo.jsx
cp .env.backup backend/.env
```

---

## 📞 Getting Help

### Self-Help Resources
1. **START_HERE.md** - Quick start guide
2. **QUICK_REFERENCE.md** - Command cheat sheet
3. **FIXES_APPLIED.md** - What was broken and fixed
4. **README.md** - Complete documentation

### Debugging Steps
1. Check error messages carefully
2. Look at browser console (F12)
3. Check terminal output
4. Verify file structure
5. Test with minimal setup

### Common Solutions
- Restart development servers
- Clear browser cache
- Reinstall dependencies
- Check file permissions
- Verify environment variables

---

## ✅ Success Checklist

Before considering setup complete:

- [ ] ✅ Directory structure is correct (`frontend/src/` exists)
- [ ] ✅ File names are correct (`frontend/index.html` exists)
- [ ] ✅ Node.js is installed (`node --version` works)
- [ ] ✅ Dependencies are installed (`npm list` shows packages)
- [ ] ✅ Environment is configured (`.env` exists)
- [ ] ✅ Frontend starts without errors (`npm run dev` works)
- [ ] ✅ Backend starts without errors (`npm start` works)
- [ ] ✅ App loads in browser (http://localhost:5173)
- [ ] ✅ Demo mode shows 3 injury cards
- [ ] ✅ Can expand cards and see projections
- [ ] ✅ Can edit stats and see live updates
- [ ] ✅ No console errors in browser
- [ ] ✅ No errors in terminal

**All items checked? Setup is complete! ✅**

---

## 🎉 You're All Set!

**The NBA Injury Tracker is now fully functional and ready to use!**

### Next Steps:
1. **Start using the app** - Open http://localhost:5173
2. **Explore the features** - Try demo mode first
3. **Read the documentation** - Check other .md files
4. **Customize the algorithms** - Modify projection formulas
5. **Set up Yahoo API** - For real league data (optional)

**Go win your fantasy league! 🏀🏆**
