import { useState, useEffect } from 'react';
import { Activity, TrendingUp, Clock, AlertCircle, Users, Target, Zap, RefreshCw, Settings } from 'lucide-react';

// Demo data that simulates Yahoo Fantasy API responses
const DEMO_INJURIES = [
  {
    id: 1,
    player: 'Tyrese Haliburton',
    team: 'Indiana Pacers',
    position: 'PG',
    injury: 'Achilles',
    status: 'Out (Season)',
    avgMinutes: 34.8,
    usageRate: 29.4,
    teammates: [
      { 
        name: 'Bennedict Mathurin', 
        position: 'SG', 
        currentMin: 28.5, 
        currentUsage: 24.1,
        stats: { pts: 17.2, reb: 5.8, ast: 2.3, stl: 0.9, blk: 0.4, tov: 2.1, fg: 44.3, threes: 2.4 }
      },
      { 
        name: 'Aaron Nesmith', 
        position: 'SF', 
        currentMin: 27.3, 
        currentUsage: 16.8,
        stats: { pts: 11.8, reb: 3.7, ast: 1.9, stl: 0.8, blk: 0.3, tov: 1.2, fg: 48.1, threes: 1.7 }
      },
      { 
        name: 'Obi Toppin', 
        position: 'PF', 
        currentMin: 23.9, 
        currentUsage: 18.3,
        stats: { pts: 10.3, reb: 3.9, ast: 1.5, stl: 0.5, blk: 0.6, tov: 1.0, fg: 52.7, threes: 1.3 }
      },
      { 
        name: 'T.J. McConnell', 
        position: 'PG', 
        currentMin: 19.7, 
        currentUsage: 14.2,
        stats: { pts: 6.8, reb: 2.8, ast: 5.2, stl: 1.3, blk: 0.1, tov: 0.9, fg: 56.3, threes: 0.2 }
      }
    ]
  },
  {
    id: 2,
    player: 'Kawhi Leonard',
    team: 'LA Clippers',
    position: 'SF',
    injury: 'Knee inflammation',
    status: 'Out 2-3 weeks',
    avgMinutes: 33.2,
    usageRate: 31.7,
    teammates: [
      { 
        name: 'James Harden', 
        position: 'PG', 
        currentMin: 35.3, 
        currentUsage: 29.8,
        stats: { pts: 21.2, reb: 7.9, ast: 8.5, stl: 1.3, blk: 0.8, tov: 3.5, fg: 42.8, threes: 2.7 }
      },
      { 
        name: 'Paul George', 
        position: 'SF', 
        currentMin: 33.9, 
        currentUsage: 28.3,
        stats: { pts: 23.4, reb: 5.2, ast: 3.5, stl: 1.5, blk: 0.5, tov: 2.8, fg: 45.7, threes: 3.2 }
      },
      { 
        name: 'Norman Powell', 
        position: 'SG', 
        currentMin: 26.1, 
        currentUsage: 22.9,
        stats: { pts: 13.9, reb: 2.6, ast: 1.3, stl: 0.8, blk: 0.3, tov: 1.3, fg: 46.9, threes: 2.1 }
      },
      { 
        name: 'Ivica Zubac', 
        position: 'C', 
        currentMin: 28.7, 
        currentUsage: 16.4,
        stats: { pts: 11.7, reb: 9.2, ast: 1.4, stl: 0.4, blk: 1.2, tov: 1.5, fg: 64.3, threes: 0.0 }
      }
    ]
  },
  {
    id: 3,
    player: 'Joel Embiid',
    team: 'Philadelphia 76ers',
    position: 'C',
    injury: 'Knee soreness',
    status: 'Day-to-Day',
    avgMinutes: 34.6,
    usageRate: 33.8,
    teammates: [
      { 
        name: 'Tyrese Maxey', 
        position: 'PG', 
        currentMin: 37.2, 
        currentUsage: 30.1,
        stats: { pts: 25.9, reb: 3.7, ast: 6.2, stl: 1.0, blk: 0.5, tov: 2.6, fg: 45.0, threes: 3.1 }
      },
      { 
        name: 'Kelly Oubre Jr.', 
        position: 'SF', 
        currentMin: 32.3, 
        currentUsage: 21.7,
        stats: { pts: 15.4, reb: 5.1, ast: 1.5, stl: 1.1, blk: 0.9, tov: 1.7, fg: 44.6, threes: 1.9 }
      },
      { 
        name: 'Tobias Harris', 
        position: 'PF', 
        currentMin: 30.9, 
        currentUsage: 19.8,
        stats: { pts: 17.2, reb: 6.5, ast: 3.1, stl: 1.0, blk: 0.6, tov: 1.5, fg: 48.7, threes: 1.4 }
      },
      { 
        name: 'Paul Reed', 
        position: 'C', 
        currentMin: 18.4, 
        currentUsage: 15.3,
        stats: { pts: 7.3, reb: 6.0, ast: 0.9, stl: 0.9, blk: 1.1, tov: 1.2, fg: 52.1, threes: 0.0 }
      }
    ]
  }
];

export default function NBAInjuryTrackerDemo() {
  const [injuries, setInjuries] = useState(DEMO_INJURIES);
  const [selectedInjury, setSelectedInjury] = useState(null);
  const [editingTeammate, setEditingTeammate] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [demoMode] = useState(true);

  // Simulate auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
      }, 30000); // Update timestamp every 30 seconds in demo
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

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
            <AlertCircle className="w-5 h-5" />
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
                <span className="font-semibold">Methodology:</span> Projections use per-minute rates adjusted for increased usage. Points and 3PM scale with both minutes and usage (√usage multiplier). Assists scale with minutes and usage^0.6. Rebounds, steals, and blocks scale with minutes. FG% adjusts slightly for usage increase.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {demoMode && (
          <div className="mb-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-900 mb-2">
              <AlertCircle className="w-5 h-5" />
              <p className="font-semibold">Demo Mode - No Backend Required</p>
            </div>
            <p className="text-sm text-yellow-800">
              This is a demo version with sample data. To connect to Yahoo Fantasy Sports API, see the README for backend setup instructions.
            </p>
          </div>
        )}

        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Activity className="w-10 h-10 text-red-600" />
            <h1 className="text-4xl font-bold text-gray-900">NBA Injury Tracker</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Fantasy Basketball Opportunity Calculator
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Click on any injury card to see projected minute and usage redistribution
          </p>
          <div className="mt-2 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
            <Zap className="w-4 h-4" />
            Live Calculations: Edit any stat to see projections update instantly
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="font-medium">{injuries.length} Active Injuries</span>
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
              onClick={() => setLastUpdate(new Date())}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {lastUpdate && (
          <div className="mb-4 text-center">
            <span className="text-xs text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        )}

        <div className="space-y-4">
          {injuries.map(injury => (
            <InjuryCard key={injury.id} injury={injury} />
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            How the Projections Work
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="font-semibold text-blue-900 mb-2">Minute & Usage Redistribution</p>
              <p>
                <span className="font-semibold">Minutes:</span> 85% of the injured player's minutes are redistributed proportionally based on each teammate's current playing time share.
              </p>
              <p className="mt-1">
                <span className="font-semibold">Usage Rate:</span> 70% of the injured player's usage is redistributed proportionally based on each teammate's current usage rate.
              </p>
            </div>

            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <p className="font-semibold text-purple-900 mb-2">Fantasy Stat Calculations</p>
              <ul className="space-y-1 ml-4">
                <li><span className="font-semibold">Points & 3-Pointers:</span> Scale with both minutes AND usage (using square root of usage multiplier for realistic adjustment)</li>
                <li><span className="font-semibold">Assists:</span> Scale with minutes and usage^0.6 (assists increase with opportunity but at diminishing returns)</li>
                <li><span className="font-semibold">Rebounds, Steals, Blocks:</span> Scale primarily with minutes (opportunity-based stats)</li>
                <li><span className="font-semibold">Field Goal %:</span> Typically decreases slightly with increased usage (2% penalty per usage multiplier point)</li>
                <li><span className="font-semibold">Turnovers:</span> Increase with both minutes and usage (more touches = more mistakes)</li>
              </ul>
            </div>

            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <p className="font-semibold text-emerald-900 mb-2">Real-Time Updates</p>
              <p>
                All projections are calculated dynamically using per-minute production rates from current season stats. When you update player data, all calculations automatically recalculate to provide accurate projections. The methodology is based on historical patterns of how players perform with increased opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}