// Yahoo Fantasy Sports API Backend Server
// Run with: node server.js
// Required: npm install express cors axios oauth-1.0a crypto dotenv

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// OAuth 1.0a setup
const oauth = OAuth({
  consumer: {
    key: process.env.YAHOO_CLIENT_ID,
    secret: process.env.YAHOO_CLIENT_SECRET,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto
      .createHmac('sha1', key)
      .update(base_string)
      .digest('base64');
  },
});

// Store tokens (use a database in production)
let userTokens = {};

// OAuth endpoints
app.get('/auth/yahoo', (req, res) => {
  const request_data = {
    url: 'https://api.login.yahoo.com/oauth/v2/get_request_token',
    method: 'POST',
    data: { oauth_callback: 'http://localhost:3000/auth/yahoo/callback' }
  };
  
  const authHeader = oauth.toHeader(oauth.authorize(request_data));
  
  axios.post(request_data.url, null, { headers: authHeader })
    .then(response => {
      const params = new URLSearchParams(response.data);
      const token = params.get('oauth_token');
      const authUrl = `https://api.login.yahoo.com/oauth/v2/request_auth?oauth_token=${token}`;
      res.json({ authUrl, requestToken: token });
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
});

app.post('/auth/yahoo/callback', async (req, res) => {
  const { oauth_token, oauth_verifier } = req.body;
  
  try {
    const request_data = {
      url: 'https://api.login.yahoo.com/oauth/v2/get_token',
      method: 'POST',
    };
    
    const token = {
      key: oauth_token,
      secret: userTokens[oauth_token]?.secret || '',
    };
    
    const authHeader = oauth.toHeader(oauth.authorize(request_data, token));
    
    const response = await axios.post(
      `${request_data.url}?oauth_verifier=${oauth_verifier}`,
      null,
      { headers: authHeader }
    );
    
    const params = new URLSearchParams(response.data);
    const accessToken = params.get('oauth_token');
    const accessSecret = params.get('oauth_token_secret');
    
    userTokens[accessToken] = {
      key: accessToken,
      secret: accessSecret,
      guid: params.get('xoauth_yahoo_guid')
    };
    
    res.json({ accessToken, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoints
async function makeYahooRequest(url, accessToken) {
  const token = userTokens[accessToken];
  if (!token) {
    throw new Error('Invalid access token');
  }
  
  const request_data = { url, method: 'GET' };
  const authHeader = oauth.toHeader(oauth.authorize(request_data, token));
  
  const response = await axios.get(url, { headers: authHeader });
  return response.data;
}

// Get user's leagues
app.get('/api/leagues', async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const gameCode = req.query.game || 'nba';
    const season = req.query.season || '2024';
    
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_codes=${gameCode}/leagues?format=json`;
    const data = await makeYahooRequest(url, accessToken);
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get league settings and rosters
app.get('/api/league/:leagueKey', async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const { leagueKey } = req.params;
    
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey};out=settings,teams,scoreboard?format=json`;
    const data = await makeYahooRequest(url, accessToken);
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get team roster
app.get('/api/team/:teamKey/roster', async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const { teamKey } = req.params;
    const week = req.query.week || 'current';
    
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster?format=json`;
    const data = await makeYahooRequest(url, accessToken);
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get player stats and injury status
app.get('/api/players/:playerKeys', async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const { playerKeys } = req.params;
    
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/players;player_keys=${playerKeys};out=stats,ownership?format=json`;
    const data = await makeYahooRequest(url, accessToken);
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get injured players for a league
app.get('/api/league/:leagueKey/injured-players', async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const { leagueKey } = req.params;
    
    // Get all teams
    const teamsUrl = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/teams?format=json`;
    const teamsData = await makeYahooRequest(teamsUrl, accessToken);
    
    // Get rosters for each team
    const injuredPlayers = [];
    
    // This would need to iterate through teams and check player status
    // For now, return structure
    res.json({ injuredPlayers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get player projections
app.get('/api/players/:playerKeys/projections', async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const { playerKeys } = req.params;
    const week = req.query.week || 'current';
    
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/players;player_keys=${playerKeys}/stats;type=projected_season?format=json`;
    const data = await makeYahooRequest(url, accessToken);
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get league transactions (adds/drops/injuries)
app.get('/api/league/:leagueKey/transactions', async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const { leagueKey } = req.params;
    
    const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/transactions?format=json`;
    const data = await makeYahooRequest(url, accessToken);
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Yahoo Fantasy API server running on port ${PORT}`);
  console.log('Make sure to set YAHOO_CLIENT_ID and YAHOO_CLIENT_SECRET in .env file');
});

// Export for serverless deployment
module.exports = app;
