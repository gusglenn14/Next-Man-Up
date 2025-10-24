# ⚡ QUICK REFERENCE - NBA Injury Tracker

**Command cheat sheet, fast lookups, and troubleshooting table.**

---

## 🚀 Essential Commands

### Start the App (2 minutes)
```bash
# Auto-setup (recommended)
./fix-and-setup.sh
cd frontend
npm run dev

# Manual setup
mv frontend/srs frontend/src
mv frontend/index-3.html frontend/index.html
cd frontend && npm install && npm run dev
```

### Backend Setup (Yahoo API)
```bash
cd backend
npm install
cp env.example .env
# Edit .env with Yahoo credentials
npm start
```

### Development Commands
```bash
# Frontend
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend  
cd backend
npm start            # Start server
npm run dev          # Start with nodemon (if installed)
```

---

## 🔧 Quick Fixes

### Directory Issues
```bash
# "srs not found" error
mv frontend/srs frontend/src

# "index-3.html not found" error  
mv frontend/index-3.html frontend/index.html

# Both at once
./fix-and-setup.sh
```

### Port Issues
```bash
# Port 5173 in use
lsof -ti:5173 | xargs kill -9

# Port 3001 in use
lsof -ti:3001 | xargs kill -9

# Use different ports
# Frontend: Edit vite.config.js
# Backend: Edit .env PORT=3002
```

### Dependency Issues
```bash
# "Cannot find module" errors
cd frontend && npm install
cd backend && npm install

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Permission Issues
```bash
# Make scripts executable
chmod +x fix-and-setup.sh
chmod +x *.sh

# Run with sudo if needed
sudo ./fix-and-setup.sh
```

---

## 🌐 URLs & Ports

| Service | URL | Port | Purpose |
|---------|-----|------|---------|
| Frontend | http://localhost:5173 | 5173 | React app |
| Backend | http://localhost:3001 | 3001 | API server |
| Yahoo OAuth | https://api.login.yahoo.com | - | Authentication |

---

## 📁 File Locations

### Key Files
```
frontend/src/main.jsx              # App entry point
frontend/src/App.jsx               # Main component
frontend/src/components/           # All components
frontend/index.html                # HTML template
frontend/package.json              # Dependencies
frontend/vite.config.js            # Build config

backend/server.js                  # Express server
backend/package.json               # Dependencies  
backend/.env                       # Environment vars
backend/env.example                # Template
```

### Configuration Files
```
frontend/tailwind.config.js        # Tailwind CSS
frontend/postcss.config.js         # PostCSS
frontend/vite.config.js            # Vite build
backend/.env                        # Environment
```

---

## 🐛 Troubleshooting Table

| Error Message | Quick Fix | Full Solution |
|---------------|-----------|---------------|
| `Module not found: Can't resolve '/src/main.jsx'` | Run `./fix-and-setup.sh` | SETUP_AND_FIX_GUIDE.md |
| `Cannot find module 'react'` | `npm install` in frontend | SETUP_AND_FIX_GUIDE.md |
| `Port 5173 is already in use` | `lsof -ti:5173 \| xargs kill -9` | SETUP_AND_FIX_GUIDE.md |
| `Yahoo OAuth failed` | Check .env file | SETUP_AND_FIX_GUIDE.md |
| `No leagues found` | Verify Yahoo credentials | SETUP_AND_FIX_GUIDE.md |
| `Permission denied` | `chmod +x fix-and-setup.sh` | SETUP_AND_FIX_GUIDE.md |
| `Command not found: npm` | Install Node.js | SETUP_AND_FIX_GUIDE.md |
| `Cannot read property of undefined` | Check API response | SETUP_AND_FIX_GUIDE.md |

---

## 🔍 Debug Commands

### Check Running Processes
```bash
# See what's using ports
lsof -i :5173
lsof -i :3001

# See all node processes
ps aux | grep node

# Kill specific process
kill -9 <PID>
```

### Check File Structure
```bash
# Verify directory structure
ls -la frontend/
ls -la frontend/src/
ls -la backend/

# Check if files exist
test -f frontend/src/main.jsx && echo "✅ main.jsx exists"
test -f frontend/index.html && echo "✅ index.html exists"
```

### Check Dependencies
```bash
# Verify npm packages
cd frontend && npm list
cd backend && npm list

# Check for missing packages
npm audit
npm outdated
```

---

## 📊 Environment Variables

### Frontend (.env.local)
```bash
# Optional - for production
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=NBA Injury Tracker
```

### Backend (.env)
```bash
# Required for Yahoo API
YAHOO_CLIENT_ID=your_client_id_here
YAHOO_CLIENT_SECRET=your_client_secret_here

# Optional
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## 🎯 Component Quick Reference

### InjuryTrackerDemo.jsx
- **Purpose**: Demo version with sample data
- **Data**: 3 hardcoded NBA injuries
- **Backend**: None required
- **Best for**: Learning, testing, no-setup usage

### InjuryTracker.jsx  
- **Purpose**: Full Yahoo API integration
- **Data**: Real league data from Yahoo
- **Backend**: Required (port 3001)
- **Best for**: Production use with real data

### InjuryTrackerOriginal.jsx
- **Purpose**: Manual entry version
- **Data**: User-entered injuries
- **Backend**: None required  
- **Best for**: Custom scenarios, offline use

---

## 🧮 Calculation Quick Reference

### Redistribution Formulas
```javascript
// Minutes redistribution (85% of injured player's minutes)
additionalMinutes = (injury.avgMinutes * minuteShare) * 0.85

// Usage redistribution (70% of injured player's usage)  
additionalUsage = (injury.usageRate * usageShare) * 0.70
```

### Stat Projection Formulas
```javascript
// Points & 3-Pointers (scale with minutes + usage)
projectedPts = ptsPerMin * projectedMinutes * Math.sqrt(usageMultiplier)

// Assists (scale with minutes + usage^0.6)
projectedAst = astPerMin * projectedMinutes * Math.pow(usageMultiplier, 0.6)

// Rebounds, Steals, Blocks (scale with minutes)
projectedReb = rebPerMin * projectedMinutes

// Turnovers (scale with minutes + usage)
projectedTov = tovPerMin * projectedMinutes * Math.sqrt(usageMultiplier)

// Field Goal % (slight decrease with usage)
projectedFg = currentFg * (1 - (usageMultiplier - 1) * 0.02)
```

---

## 🎨 Customization Quick Reference

### Change Redistribution Percentages
```javascript
// In InjuryTrackerDemo.jsx or InjuryTracker.jsx
const additionalMinutes = (injury.avgMinutes * minuteShare) * 0.85;  // Change 0.85
const additionalUsage = (injury.usageRate * usageShare) * 0.70;      // Change 0.70
```

### Add New Stats
```javascript
// Add fantasy points calculation
const fantasyPoints = (
  projectedPts * 1.0 +
  projectedReb * 1.2 +
  projectedAst * 1.5 +
  projectedStl * 3.0 +
  projectedBlk * 3.0 +
  projectedThrees * 3.0
);
```

### Modify Stat Formulas
```javascript
// Change from square root to linear scaling
const projectedPts = ptsPerMin * projectedMinutes * usageMultiplier;  // Linear
// Instead of:
const projectedPts = ptsPerMin * projectedMinutes * Math.sqrt(usageMultiplier);  // Square root
```

---

## 📱 Browser Compatibility

### Supported Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Required Features
- ES6 Modules
- Fetch API
- Local Storage
- CSS Grid
- Flexbox

---

## 🔐 Security Notes

### Development
- ✅ CORS enabled for localhost
- ✅ No sensitive data in frontend
- ✅ Environment variables in backend only

### Production
- 🔒 Use HTTPS for OAuth
- 🔒 Validate all API responses
- 🔒 Rate limit API calls
- 🔒 Sanitize user inputs

---

## 📈 Performance Tips

### Development
- Use React DevTools
- Enable Vite HMR
- Use console.log for debugging
- Check Network tab for API calls

### Production
- Run `npm run build` for optimized bundle
- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies

---

## 🆘 Emergency Recovery

### Complete Reset
```bash
# Nuclear option - start fresh
rm -rf frontend/node_modules backend/node_modules
rm frontend/package-lock.json backend/package-lock.json
./fix-and-setup.sh
```

### Backup Important Files
```bash
# Before making changes
cp frontend/src/components/InjuryTrackerDemo.jsx InjuryTrackerDemo.jsx.backup
cp backend/.env .env.backup
```

### Restore from Backup
```bash
# If something breaks
cp InjuryTrackerDemo.jsx.backup frontend/src/components/InjuryTrackerDemo.jsx
cp .env.backup backend/.env
```

---

## 📞 Get More Help

### Quick Issues
- **This file**: Common commands and fixes
- **FIXES_APPLIED.md**: What was broken and fixed

### Complex Issues  
- **SETUP_AND_FIX_GUIDE.md**: Complete troubleshooting
- **README.md**: Full documentation

### Code Issues
- Inline comments in all components
- Console.log debugging included
- Error messages are descriptive

---

**Need more detail? Check SETUP_AND_FIX_GUIDE.md for complete troubleshooting!**
