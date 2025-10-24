# Quick Start Guide - NBA Injury Tracker

Get up and running in 5 minutes!

## Option 1: Try the Demo (No Setup Required) ⚡

**Perfect for testing the projections without connecting to Yahoo API**

1. Use the demo file: `nba-injury-tracker-demo.jsx`
2. This version includes 3 sample injured players with real stats
3. All projection features work exactly the same
4. Great for understanding how the tool works before setting up the API

**Features in Demo:**
- ✅ Live stat projections
- ✅ Editable player stats
- ✅ All calculation methods
- ✅ No backend required

## Option 2: Full Yahoo API Integration 🔥

**For live data from your Yahoo Fantasy Basketball leagues**

### Quick Setup (5 minutes)

1. **Get Yahoo API Credentials** (2 min)
   - Go to https://developer.yahoo.com/apps/create/
   - Create app with Fantasy Sports Read/Write access
   - Copy your Client ID and Client Secret

2. **Backend Setup** (2 min)
   ```bash
   # Install dependencies
   npm install
   
   # Create .env file
   cp .env.example .env
   
   # Edit .env and add your credentials
   # YAHOO_CLIENT_ID=your_client_id
   # YAHOO_CLIENT_SECRET=your_client_secret
   
   # Start server
   npm start
   ```
   Server runs on http://localhost:3001

3. **Frontend Setup** (1 min)
   - Use the file: `nba-injury-tracker-with-api.jsx`
   - Ensure `API_BASE_URL = 'http://localhost:3001'`
   - Open in browser and click "Connect Yahoo Fantasy"

Done! 🎉

## Which File Should I Use?

### Use `nba-injury-tracker-demo.jsx` if:
- You want to test immediately without setup
- You're evaluating the projection methodology
- You don't have a Yahoo Fantasy league yet
- You're learning how the tool works

### Use `nba-injury-tracker-with-api.jsx` if:
- You have a Yahoo Fantasy Basketball league
- You want real-time injury data from your league
- You want automatic updates every 5 minutes
- You've completed the backend setup

### Use `nba-injury-tracker.jsx` if:
- You want the original enhanced version (previous iteration)
- You want manual data entry with live calculations
- You need a standalone version without API dependencies

## Common Issues & Fixes

### "Server not running" error
```bash
# Make sure backend is running:
cd backend-directory
npm start

# Should see: "Yahoo Fantasy API server running on port 3001"
```

### "OAuth failed" error
- Check your Client ID and Secret in .env
- Ensure callback domain is set to `localhost` in Yahoo Developer Console
- Try disabling popup blockers

### "No leagues found" error
- Make sure you have an active Yahoo Fantasy Basketball league for 2024-25 season
- Check that your account has proper league access
- Try refreshing the page

## Next Steps

After getting started:

1. **Customize Projections**
   - Edit redistribution percentages (currently 85% minutes, 70% usage)
   - Adjust calculation multipliers for your league's scoring

2. **Add Features**
   - Filter by position or team
   - Export projections to CSV
   - Add notifications for new injuries

3. **Deploy to Production**
   - See deployment section in full README
   - Use environment variables for security
   - Add rate limiting

## Need Help?

- Check the full README.md for detailed instructions
- Review the troubleshooting section
- Verify your Yahoo API credentials
- Ensure all dependencies are installed

## Files Overview

```
/outputs/
├── nba-injury-tracker-demo.jsx           # Demo version (no backend needed)
├── nba-injury-tracker-with-api.jsx       # Full API integration version
├── nba-injury-tracker.jsx                # Original enhanced version
├── server.js                              # Backend OAuth server
├── package.json                           # Backend dependencies
├── .env.example                           # Environment variables template
├── README.md                              # Complete documentation
└── QUICKSTART.md                          # This file
```

**Pro Tip:** Start with the demo to understand the projections, then move to the API version when you're ready to connect your league!

Happy Fantasy Basketball! 🏀✨
