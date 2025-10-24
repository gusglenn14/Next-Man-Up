import { useState, useEffect, useCallback } from 'react';
import { Activity, TrendingUp, Clock, AlertCircle, Users, Plus, X, Target, Zap, RefreshCw, Cloud, CloudOff, Settings } from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:3001';

export default function NBAInjuryTracker() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('yahoo_access_token'));
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [injuries, setInjuries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedInjury, setSelectedInjury] = useState(null);
  const [editingTeammate, setEditingTeammate] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    if (accessToken) {
      setIsAuthenticated(true);
      fetchLeagues();
    }
  }, [accessToken]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    if (autoRefresh && selectedLeague) {
      const interval = setInterval(() => {
        fetchInjuredPlayers();
      }, 5 * 60 * 1000); // 5 minutes
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, selectedLeague]);

  // Yahoo OAuth Authentication
  const handleYahooLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/yahoo`);
      const data = await response.json();
      
      // Open OAuth window
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const authWindow = window.open(
        data.authUrl,
        'Yahoo OAuth',
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      // Listen for OAuth callback
      window.addEventListener('message', async (event) => {
        if (event.data.type === 'yahoo-oauth-callback') {
          authWindow.close();
          
          const callbackResponse = await fetch(`${API_BASE_URL}/auth/yahoo/callback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event.data.params)
          });
          
          const result = await callbackResponse.json();
          
          if (result.success) {
            localStorage.setItem('yahoo_access_token', result.accessToken);
            setAccessToken(result.accessToken);
            setIsAuthenticated(true);
            fetchLeagues();
          }
        }
      });
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's fantasy leagues
  const fetchLeagues = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/leagues?game=nba&season=2024`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      const data = await response.json();
      
      // Parse Yahoo's XML/JSON response
      const leaguesData = data.fantasy_content?.users[0]?.user[1]?.games[0]?.game[1]?.leagues || [];
      const parsedLeagues = leaguesData.map(league => ({
        key: league.league[0].league_key,
        name: league.league[0].name,
        numTeams: league.league[0].num_teams,
        currentWeek: league.league[0].current_week
      }));
      
      setLeagues(parsedLeagues);
      if (parsedLeagues.length > 0) {
        setSelectedLeague(parsedLeagues[0].key);
        fetchInjuredPlayers(parsedLeagues[0].key);
      }
    } catch (error) {
      console.error('Error fetching leagues:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch injured players from league
  const fetchInjuredPlayers = async (leagueKey = selectedLeague) => {
    try {
      setLoading(true);
      
      // Get league data with teams
      const leagueResponse = await fetch(`${API_BASE_URL}/api/league/${leagueKey}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      const leagueData = await leagueResponse.json();
      const teams = leagueData.fantasy_content?.league[1]?.teams || [];
      
      const injuredPlayersData = [];
      
      // Check each team for injured players
      for (const teamEntry of teams) {
        const team = teamEntry.team[0];
        const rosterResponse = await fetch(
          `${API_BASE_URL}/api/team/${team.team_key}/roster`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        
        const rosterData = await rosterResponse.json();
        const players = rosterData.fantasy_content?.team[1]?.roster[0]?.players || [];
        
        // Filter for injured players
        players.forEach(playerEntry => {
          const player = playerEntry.player[0];
          const status = player.status || 'Healthy';
          const injuryNote = player.injury_note || '';
          
          if (status !== 'Healthy' && status !== '') {
            // Get player stats
            const stats = player.player_stats_week || player.player_stats_season;
            const playerStats = parsePlayerStats(stats);
            
            // Get teammates on same team
            const teammates = players
              .filter(p => p.player[0].player_id !== player.player_id)
              .slice(0, 4)
              .map(p => parseTeammate(p.player[0]));
            
            injuredPlayersData.push({
              id: player.player_id,
              player: player.name.full,
              team: player.editorial_team_full_name,
              position: player.display_position,
              injury: injuryNote,
              status: status,
              avgMinutes: playerStats.minutes || 0,
              usageRate: playerStats.usage || 0,
              teammates: teammates
            });
          }
        });
      }
      
      setInjuries(injuredPlayersData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching injured players:', error);
    } finally {
      setLoading(false);
    }
  };

  // Parse player stats from Yahoo API response
  const parsePlayerStats = (statsData) => {
    if (!statsData) return { minutes: 0, usage: 0 };
    
    const stats = {};
    statsData.stats?.forEach(stat => {
      const statId = stat.stat.stat_id;
      const value = parseFloat(stat.stat.value) || 0;
      
      // Map Yahoo stat IDs to our format
      // This mapping would need to be adjusted based on league settings
      if (statId === '0') stats.minutes = value; // Minutes played
      if (statId === '5') stats.usage = value; // Usage rate (if available)
    });
    
    return stats;
  };

  // Parse teammate data
  const parseTeammate = (player) => {
    const stats = player.player_stats_week || player.player_stats_season;
    const parsedStats = parsePlayerStats(stats);
    
    return {
      name: player.name.full,
      position: player.display_position,
      currentMin: parsedStats.minutes || 25,
      currentUsage: parsedStats.usage || 20,
      stats: {
        pts: 12.0,
        reb: 4.5,
        ast: 3.2,
        stl: 0.8,
        blk: 0.5,
        tov: 1.5,
        fg: 45.0,
        threes: 1.8
      }
    };
  };

  const updateTeammateStats = (injuryId, teammateIndex, field, value) => {
    setInjuries(injuries.map(injury => {
      if (injury.id === injuryId) {
        const updatedTeammates = [...injury.teammates];
        if (field === 'currentMin' || field === 'currentUsage') {
          updatedTeammates[teammateIndex] = {
            ...updatedTeammates[teammateIndex],
            [field]: parseFloat(value) || 0
          };
        } else {
          updatedTeammates[teammateIndex] = {
            ...updatedTeammates[teammateIndex],
            stats: {
              ...updatedTeammates[teammateIndex].stats,
              [field]: parseFloat(value) || 0
            }
          };
        }
        return { ...injury, teammates: updatedTeammates };
      }
      return injury;
    }));
  };

  const calculateRedistribution = (injury) => {
    const totalTeammateMinutes = injury.teammates.reduce((sum, tm) => sum + tm.currentMin, 0);
    const totalTeammateUsage = injury.teammates.reduce((sum, tm) => sum + tm.currentUsage, 0);
    
    return injury.teammates.map(teammate => {
      const minuteShare = teammate.currentMin / totalTeammateMinutes;
      const usageShare = teammate.currentUsage / totalTeammateUsage;
      
      const additionalMinutes = (injury.avgMinutes * minuteShare) * 0.85;
      const additionalUsage = (injury.usageRate * usageShare) * 0.70;
      
      const projectedMinutes = teammate.currentMin + additionalMinutes;
      const projectedUsage = teammate.currentUsage + additionalUsage;
      
      const ptsPerMin = teammate.stats.pts / teammate.currentMin;
      const rebPerMin = teammate.stats.reb / teammate.currentMin;
      const astPerMin = teammate.stats.ast / teammate.currentMin;
      const stlPerMin = teammate.stats.stl / teammate.currentMin;
      const blkPerMin = teammate.stats.blk / teammate.currentMin;
      const tovPerMin = teammate.stats.tov / teammate.currentMin;
      const threesPerMin = teammate.stats.threes / teammate.currentMin;
      
      const usageMultiplier = projectedUsage / teammate.currentUsage;
      
      const projectedPts = ptsPerMin * projectedMinutes * Math.sqrt(usageMultiplier);
      const projectedThrees = threesPerMin * projectedMinutes * Math.sqrt(usageMultiplier);
      const projectedAst = astPerMin * projectedMinutes * Math.pow(usageMultiplier, 0.6);
      const projectedReb = rebPerMin * projectedMinutes;
      const projectedStl = stlPerMin * projectedMinutes;
      const projectedBlk = blkPerMin * projectedMinutes;
      const projectedTov = tovPerMin * projectedMinutes * Math.sqrt(usageMultiplier);
      const projectedFg = teammate.stats.fg * (1 - (usageMultiplier - 1) * 0.02);
      
      return {
        ...teammate,
        additionalMinutes: additionalMinutes.toFixed(1),
        additionalUsage: additionalUsage.toFixed(1),
        projectedMinutes: projectedMinutes.toFixed(1),
        projectedUsage: projectedUsage.toFixed(1),
        minuteIncrease: ((additionalMinutes / teammate.currentMin) * 100).toFixed(0),
        usageIncrease: ((additionalUsage / teammate.currentUsage) * 100).toFixed(0),
        projectedStats: {
          pts: projectedPts.toFixed(1),
          reb: projectedReb.toFixed(1),
          ast: projectedAst.toFixed(1),
          stl: projectedStl.toFixed(1),
          blk: projectedBlk.toFixed(1),
          tov: projectedTov.toFixed(1),
          fg: projectedFg.toFixed(1),
          threes: projectedThrees.toFixed(1)
        },
        statIncreases: {
          pts: ((projectedPts - teammate.stats.pts) / teammate.stats.pts * 100).toFixed(0),
          reb: ((projectedReb - teammate.stats.reb) / teammate.stats.reb * 100).toFixed(0),
          ast: ((projectedAst - teammate.stats.ast) / teammate.stats.ast * 100).toFixed(0),
          stl: ((projectedStl - teammate.stats.stl) / teammate.stats.stl * 100).toFixed(0),
          blk: ((projectedBlk - teammate.stats.blk) / teammate.stats.blk * 100).toFixed(0),
          threes: ((projectedThrees - teammate.stats.threes) / teammate.stats.threes * 100).toFixed(0)
        }
      };
    });
  };

  const InjuryCard = ({ injury }) => {
    const redistribution = calculateRedistribution(injury);
    const isExpanded = selectedInjury === injury.id;

    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 cursor-pointer hover:from-red-600 hover:to-red-700 transition-all"
          onClick={() => setSelectedInjury(isExpanded ? null : injury.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold">{injury.player}</h3>
              <p className="text-red-100 text-sm">{injury.team} • {injury.position}</p>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-4 text-sm flex-wrap">
            <span className="bg-red-700 px-3 py-1 rounded-full">{injury.injury}</span>
            <span className="bg-red-700 px-3 py-1 rounded-full">{injury.status}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{injury.avgMinutes.toFixed(1)} MPG</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>{injury.usageRate.toFixed(1)}% Usage</span>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4 text-gray-700">
              <Users className="w-5 h-5" />
              <h4 className="font-semibold text-lg">Projected Impact on Teammates</h4>
            </div>
            
            <div className="space-y-4">
              {redistribution.map((teammate, idx) => {
                const isEditing = editingTeammate === `${injury.id}-${idx}`;
                
                return (
                  <div key={idx} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-semibold text-gray-900 text-lg">{teammate.name}</h5>
                        <p className="text-sm text-gray-600">{teammate.position}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingTeammate(isEditing ? null : `${injury.id}-${idx}`)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            isEditing 
                              ? 'bg-blue-600 text-white hover:bg-blue-700' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {isEditing ? 'Done' : 'Edit Stats'}
                        </button>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                          +{teammate.minuteIncrease}% MIN
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          +{teammate.usageIncrease}% USG
                        </span>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-300">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Edit Current Stats (watch projections update live):</p>
                        <div className="grid grid-cols-4 gap-2">
                          <input
                            type="number"
                            step="0.1"
                            value={teammate.currentMin}
                            onChange={(e) => updateTeammateStats(injury.id, idx, 'currentMin', e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded"
                            placeholder="MIN"
                          />
                          <input
                            type="number"
                            step="0.1"
                            value={teammate.currentUsage}
                            onChange={(e) => updateTeammateStats(injury.id, idx, 'currentUsage', e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded"
                            placeholder="USG%"
                          />
                          <input
                            type="number"
                            step="0.1"
                            value={teammate.stats.pts}
                            onChange={(e) => updateTeammateStats(injury.id, idx, 'pts', e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded"
                            placeholder="PTS"
                          />
                          <input
                            type="number"
                            step="0.1"
                            value={teammate.stats.reb}
                            onChange={(e) => updateTeammateStats(injury.id, idx, 'reb', e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded"
                            placeholder="REB"
                          />
                          <input
                            type="number"
                            step="0.1"
                            value={teammate.stats.ast}
                            onChange={(e) => updateTeammateStats(injury.id, idx, 'ast', e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded"
                            placeholder="AST"
                          />
                          <input
                            type="number"
                            step="0.1"
                            value={teammate.stats.stl}
                            onChange={(e) => updateTeammateStats(injury.id, idx, 'stl', e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded"
                            placeholder="STL"
                          />
                          <input
                            type="number"
                            step="0.1"
                            value={teammate.stats.blk}
                            onChange={(e) => updateTeammateStats(injury.id, idx, 'blk', e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded"
                            placeholder="BLK"
                          />
                          <input
                            type="number"
                            step="0.1"
                            value={teammate.stats.threes}
                            onChange={(e) => updateTeammateStats(injury.id, idx, 'threes', e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded"
                            placeholder="3PM"
                          />
                          <input
                            type="number"
                            step="0.1"
                            value={teammate.stats.tov}
                            onChange={(e) => updateTeammateStats(injury.id, idx, 'tov', e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded"
                            placeholder="TOV"
                          />
                          <input
                            type="number"
                            step="0.1"
                            value={teammate.stats.fg}
                            onChange={(e) => updateTeammateStats(injury.id, idx, 'fg', e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded"
                            placeholder="FG%"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                        <div className="text-xs text-gray-600 mb-1 font-medium">Minutes Per Game</div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{teammate.currentMin}</span>
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-xl font-bold text-green-700">{teammate.projectedMinutes}</span>
                        </div>
                        <div className="text-xs text-green-600 mt-1">+{teammate.additionalMinutes} min</div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                        <div className="text-xs text-gray-600 mb-1 font-medium">Usage Rate %</div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{teammate.currentUsage}%</span>
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span className="text-xl font-bold text-blue-700">{teammate.projectedUsage}%</span>
                        </div>
                        <div className="text-xs text-blue-600 mt-1">+{teammate.additionalUsage}%</div>
                      </div>
                    </div>

                    <div className="border-t-2 border-gray-200 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-4 h-4 text-purple-600" />
                        <h6 className="font-semibold text-gray-900">Fantasy Stats Projection</h6>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2">
                        <StatProjection 
                          label="PTS" 
                          current={teammate.stats.pts} 
                          projected={teammate.projectedStats.pts}
                          increase={teammate.statIncreases.pts}
                        />
                        <StatProjection 
                          label="REB" 
                          current={teammate.stats.reb} 
                          projected={teammate.projectedStats.reb}
                          increase={teammate.statIncreases.reb}
                        />
                        <StatProjection 
                          label="AST" 
                          current={teammate.stats.ast} 
                          projected={teammate.projectedStats.ast}
                          increase={teammate.statIncreases.ast}
                        />
                        <StatProjection 
                          label="3PM" 
                          current={teammate.stats.threes} 
                          projected={teammate.projectedStats.threes}
                          increase={teammate.statIncreases.threes}
                        />
                        <StatProjection 
                          label="STL" 
                          current={teammate.stats.stl} 
                          projected={teammate.projectedStats.stl}
                          increase={teammate.statIncreases.stl}
                        />
                        <StatProjection 
                          label="BLK" 
                          current={teammate.stats.blk} 
                          projected={teammate.projectedStats.blk}
                          increase={teammate.statIncreases.blk}
                        />
                        <StatProjection 
                          label="FG%" 
                          current={teammate.stats.fg} 
                          projected={teammate.projectedStats.fg}
                          increase={((parseFloat(teammate.projectedStats.fg) - teammate.stats.fg) / teammate.stats.fg * 100).toFixed(0)}
                          isPercentage={true}
                        />
                        <StatProjection 
                          label="TOV" 
                          current={teammate.stats.tov} 
                          projected={teammate.projectedStats.tov}
                          increase={((parseFloat(teammate.projectedStats.tov) - teammate.stats.tov) / teammate.stats.tov * 100).toFixed(0)}
                          isNegative={true}
                        />
                      </div>
                    </div>

                    <div className="mt-3 p-2 bg-purple-50 border border-purple-200 rounded">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-purple-600" />
                        <p className="text-xs text-purple-900">
                          <span className="font-semibold">Fantasy Impact:</span> Projected {teammate.projectedStats.pts} PTS, {teammate.projectedStats.reb} REB, {teammate.projectedStats.ast} AST per game
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-900">
                <span className="font-semibold">Methodology:</span> Projections use per-minute rates adjusted for increased usage. Points and 3PM scale with both minutes and usage (√usage multiplier). Assists scale with minutes and usage^0.6. Rebounds, steals, and blocks scale with minutes. FG% adjusts slightly for usage increase. Data synced from Yahoo Fantasy Sports API.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const StatProjection = ({ label, current, projected, increase, isPercentage = false, isNegative = false }) => {
    const increaseNum = parseFloat(increase);
    const isPositive = increaseNum > 0;
    
    return (
      <div className={`p-2 rounded-lg border ${
        isNegative 
          ? 'bg-orange-50 border-orange-200' 
          : isPositive 
            ? 'bg-emerald-50 border-emerald-200' 
            : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="text-xs font-medium text-gray-600 mb-1">{label}</div>
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-gray-500">{current}</span>
          <span className="text-xs text-gray-400">→</span>
          <span className="text-sm font-bold text-gray-900">{projected}</span>
        </div>
        {!isPercentage && (
          <div className={`text-xs font-medium mt-0.5 ${
            isNegative 
              ? increaseNum > 0 ? 'text-orange-600' : 'text-emerald-600'
              : isPositive ? 'text-emerald-600' : increaseNum < 0 ? 'text-red-600' : 'text-gray-500'
          }`}>
            {isPositive ? '+' : ''}{increase}%
          </div>
        )}
      </div>
    );
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Activity className="w-12 h-12 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">NBA Injury Tracker</h1>
          </div>
          
          <p className="text-gray-600 text-center mb-6">
            Connect your Yahoo Fantasy Basketball account to automatically track injuries and project teammate performance.
          </p>
          
          <button
            onClick={handleYahooLogin}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Cloud className="w-5 h-5" />
                Connect Yahoo Fantasy
              </>
            )}
          </button>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Note:</span> You'll need a Yahoo Fantasy Sports account and access to the backend server running on localhost:3001. See setup instructions in the README.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Activity className="w-10 h-10 text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">NBA Injury Tracker</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Fantasy Basketball Opportunity Calculator
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Powered by Yahoo Fantasy Sports API - Auto-synced with your league
          </p>
          <div className="mt-2 flex items-center justify-center gap-4">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
              <Cloud className="w-4 h-4" />
              Live Data
            </div>
            {lastUpdate && (
              <span className="text-xs text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <select
              value={selectedLeague || ''}
              onChange={(e) => {
                setSelectedLeague(e.target.value);
                fetchInjuredPlayers(e.target.value);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium"
            >
              {leagues.map(league => (
                <option key={league.key} value={league.key}>
                  {league.name} ({league.numTeams} teams)
                </option>
              ))}
            </select>
            
            <div className="flex items-center gap-2 text-gray-700">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="font-medium">{injuries.length} Active Injuries</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              <Settings className="w-4 h-4" />
              Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
            </button>
            
            <button
              onClick={() => fetchInjuredPlayers()}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading && injuries.length === 0 ? (
            <div className="text-center py-12">
              <RefreshCw className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading injury data...</h3>
              <p className="text-gray-500">Fetching data from Yahoo Fantasy Sports API</p>
            </div>
          ) : injuries.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Injuries</h3>
              <p className="text-gray-500">Your league currently has no injured players</p>
            </div>
          ) : (
            injuries.map(injury => (
              <InjuryCard key={injury.id} injury={injury} />
            ))
          )}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            How the Yahoo API Integration Works
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="font-semibold text-blue-900 mb-2">Automatic Data Syncing</p>
              <p>
                Connects to Yahoo Fantasy Sports API to fetch real-time injury reports, player stats, and league rosters. Data automatically refreshes every 5 minutes when auto-refresh is enabled.
              </p>
            </div>

            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <p className="font-semibold text-purple-900 mb-2">Yahoo Projections Integration</p>
              <p>
                Uses Yahoo's own stat projections combined with our proprietary redistribution algorithms to calculate how minutes and usage will redistribute among teammates when a star player is injured.
              </p>
            </div>

            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <p className="font-semibold text-emerald-900 mb-2">Setup Requirements</p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>Backend server running on localhost:3001</li>
                <li>Yahoo Developer API credentials (Client ID & Secret)</li>
                <li>Active Yahoo Fantasy Basketball league for 2024-25 season</li>
                <li>OAuth authentication completed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}