# 🚀 START HERE - NBA Injury Tracker

**Welcome! This is your first stop to get the NBA Injury Tracker running in 2 minutes.**

---

## ⚡ Quick Start (2 Minutes)

### Step 1: Run the Auto-Fix Script
```bash
# Linux/Mac
./fix-and-setup.sh

# Windows
fix-and-setup.bat
```

### Step 2: Start the App
```bash
cd frontend
npm run dev
```

### Step 3: Open Your Browser
Go to: **http://localhost:5173**

**🎉 You're done! The app is running.**

---

## 🎯 What You'll See

1. **Version Selector** (top-right corner)
   - **Demo Mode**: Works immediately (recommended for first time)
   - **Full Version**: Requires Yahoo API setup

2. **3 Injury Cards** (in Demo Mode)
   - Tyrese Haliburton (Pacers)
   - Kawhi Leonard (Clippers) 
   - Joel Embiid (76ers)

3. **Interactive Features**
   - Click any card to expand
   - Click "Edit Stats" to modify projections
   - Watch calculations update live

---

## 🏀 Try These Features

### ✅ Expand an Injury Card
- Click on any red injury card
- See teammate projections appear
- Notice the minute/usage increases

### ✅ Edit Live Stats
- Click "Edit Stats" on any teammate
- Change minutes, usage, or fantasy stats
- Watch projections recalculate instantly

### ✅ Understand the Math
- Read the methodology section at bottom
- See how 85% minutes + 70% usage redistributes
- Learn the stat projection formulas

---

## 🎓 Demo Mode vs Full API

### Demo Mode (No Setup Required)
- ✅ **3 sample injuries** with real NBA data
- ✅ **All calculations work** exactly the same
- ✅ **Perfect for learning** how projections work
- ✅ **No backend needed** - runs in browser only

### Full API Mode (Advanced)
- 🔗 **Connects to Yahoo Fantasy** leagues
- 🔄 **Auto-refreshes** every 5 minutes
- 📊 **Real injury data** from your league
- ⚙️ **Requires setup** (see SETUP_AND_FIX_GUIDE.md)

---

## 🚨 If Something Goes Wrong

### "Command not found" or "Permission denied"
```bash
# Make script executable
chmod +x fix-and-setup.sh
./fix-and-setup.sh
```

### "Port 5173 already in use"
```bash
# Kill existing process
lsof -ti:5173 | xargs kill -9
# Then try again
npm run dev
```

### "Cannot find module"
```bash
cd frontend
npm install
npm run dev
```

### Still having issues?
- **Quick fixes**: See QUICK_REFERENCE.md
- **Complete guide**: See SETUP_AND_FIX_GUIDE.md
- **What was fixed**: See FIXES_APPLIED.md

---

## 📚 Next Steps

### Immediate (Today)
1. ✅ Get the app running (you're here!)
2. ✅ Play with demo mode
3. ✅ Understand the projections
4. ✅ Try editing stats

### Tomorrow
1. 📖 Read QUICK_REFERENCE.md for commands
2. 🔍 Explore the code structure
3. 🎯 Test different injury scenarios
4. 📊 Validate projections against real data

### This Week
1. 🏆 Use for waiver wire decisions
2. 🔗 Set up Yahoo API (optional)
3. 🎨 Customize the algorithms
4. 📈 Track projection accuracy

---

## 🎯 Key Concepts to Understand

### Minute Redistribution
- **85%** of injured player's minutes get redistributed
- **Proportional** based on current playing time
- **Realistic** - not everyone gets equal shares

### Usage Redistribution  
- **70%** of injured player's usage gets redistributed
- **Proportional** based on current usage rates
- **Smart** - high-usage players get more opportunity

### Stat Projections
- **Points/3PM**: Scale with minutes + usage
- **Assists**: Scale with minutes + usage^0.6
- **Rebounds**: Scale with minutes only
- **FG%**: Slight decrease with usage increase

---

## 🏆 Fantasy Basketball Tips

### Best Opportunities
- **+15% minutes** = Waiver wire target
- **+10% minutes + +5% usage** = Priority add  
- **+20% usage** = League winner potential

### Avoid These Traps
- ❌ Players already playing 35+ minutes
- ❌ Three-team timeshares
- ❌ Short-term injuries (< 2 weeks)

---

## 📞 Need Help?

### Quick Help
- **QUICK_REFERENCE.md** - Command cheat sheet
- **FIXES_APPLIED.md** - What was broken/fixed

### Detailed Help  
- **SETUP_AND_FIX_GUIDE.md** - Complete troubleshooting
- **README.md** - Full project documentation

### Code Help
- Inline comments in all components
- Console.log debugging included
- Error messages are descriptive

---

## ✅ Success Checklist

Before moving on, make sure you can:
- [ ] App loads at http://localhost:5173
- [ ] See 3 injury cards in demo mode
- [ ] Click cards to expand them
- [ ] See teammate projections
- [ ] Click "Edit Stats" and modify values
- [ ] Watch projections update live
- [ ] Understand the methodology section

**If you can do all these, you're ready for the next level!**

---

## 🎉 You're Ready!

**Next:** Read QUICK_REFERENCE.md for commands and troubleshooting

**Then:** Explore SETUP_AND_FIX_GUIDE.md for advanced setup

**Finally:** Use README.md as your complete reference

---

**Go win your fantasy league! 🏀🏆**

*Built with ❤️ for fantasy basketball managers everywhere*
