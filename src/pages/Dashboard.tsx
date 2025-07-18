import React from 'react';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Helper Functions & Types ---

// Defines the structure for the tooltip props for type safety
type CustomTooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
};

// Determines AQI category and color based on the value
const getAqiInfo = (aqi: number) => {
  if (aqi <= 50) return { category: 'Good', color: 'text-green-400', bgColor: 'from-green-500/20 to-slate-800/10' };
  if (aqi <= 100) return { category: 'Satisfactory', color: 'text-lime-400', bgColor: 'from-lime-500/20 to-slate-800/10' };
  if (aqi <= 200) return { category: 'Moderate', color: 'text-yellow-400', bgColor: 'from-yellow-500/20 to-slate-800/10' };
  if (aqi <= 300) return { category: 'Poor', color: 'text-orange-400', bgColor: 'from-orange-500/20 to-slate-800/10' };
  if (aqi <= 400) return { category: 'Very Poor', color: 'text-red-500', bgColor: 'from-red-500/20 to-slate-800/10' };
  return { category: 'Severe', color: 'text-rose-600', bgColor: 'from-rose-600/20 to-slate-800/10' };
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-lg p-3 shadow-lg">
                <p className="text-sm font-semibold text-slate-200">{`Month: ${label}`}</p>
                <p className="text-sm text-cyan-400">{`Average AQI: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};


// --- Main Dashboard Component ---

const App: React.FC = () => {
    
    // The single source of truth for all AQI data
    const monthlyAqiData = [
        { Month: 'Jan 24', Average_AQI: 354 }, { Month: 'Feb 24', Average_AQI: 217 },
        { Month: 'Mar 24', Average_AQI: 175 }, { Month: 'Apr 24', Average_AQI: 183 },
        { Month: 'May 24', Average_AQI: 224 }, { Month: 'Jun 24', Average_AQI: 179 },
        { Month: 'Jul 24', Average_AQI: 96 },  { Month: 'Aug 24', Average_AQI: 72 },
        { Month: 'Sep 24', Average_AQI: 105 }, { Month: 'Oct 24', Average_AQI: 234 },
        { Month: 'Nov 24', Average_AQI: 374 }, { Month: 'Dec 24', Average_AQI: 293 },
        { Month: 'Jan 25', Average_AQI: 305 }, { Month: 'Feb 25', Average_AQI: 214 },
        { Month: 'Mar 25', Average_AQI: 169 }, { Month: 'Apr 25', Average_AQI: 207 },
        { Month: 'May 25', Average_AQI: 237 }, { Month: 'Jun 25', Average_AQI: 173 },
        { Month: 'Jul 25', Average_AQI: 105 }, { Month: 'Aug 25', Average_AQI: 85 },
        { Month: 'Sep 25', Average_AQI: 153 }, { Month: 'Oct 25', Average_AQI: 224 },
        { Month: 'Nov 25', Average_AQI: 328 }, { Month: 'Dec 25', Average_AQI: 257 }
    ];

    // --- Dynamically derive all values from the data ---

    // Find the data for the current month (July 2025)
    const currentMonthData = monthlyAqiData.find(d => d.Month === "Jul 25") || monthlyAqiData[monthlyAqiData.length - 1];
    const previousMonthData = monthlyAqiData.find(d => d.Month === "Jun 25") || monthlyAqiData[monthlyAqiData.length - 2];
    
    // Derive all current AQI information
    const currentAQI = currentMonthData.Average_AQI;
    const { category: aqiCategory, color: aqiColor, bgColor } = getAqiInfo(currentAQI);
    const aqiDifference = currentAQI - previousMonthData.Average_AQI;

    // Dynamically generate the list of recent readings
    const recentReadings = monthlyAqiData.slice(13, 18).reverse().map((month) => {
        const prevMonthIndex = monthlyAqiData.findIndex(d => d.Month === month.Month) - 1;
        const prevMonthAqi = prevMonthIndex >= 0 ? monthlyAqiData[prevMonthIndex].Average_AQI : 0;
        return {
            time: month.Month.replace(' ', "'"),
            aqi: month.Average_AQI,
            trend: month.Average_AQI > prevMonthAqi ? 'up' : 'down'
        };
    });

    return (
        <div className="bg-slate-900 text-white min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-6 pt-8">
                <header className="pb-4">
                    <h1 className="text-3xl font-bold text-slate-100">Air Quality Dashboard</h1>
                    <p className="text-slate-400">Delhi, India</p>
                </header>

                {/* Chart */}
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-4 sm:p-6">
                    <h2 className="text-xl font-semibold text-slate-300 mb-4">24-Month Trend</h2>
                    <div className="h-80 bg-slate-900/50 rounded-lg">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={monthlyAqiData}
                                margin={{ top: 20, right: 20, left: -20, bottom: 5 }}
                            >
                                <defs>
                                    <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis 
                                    dataKey="Month" 
                                    stroke="#94a3b8" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                />
                                <YAxis 
                                    stroke="#94a3b8" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}/>
                                <Area 
                                    type="monotone" 
                                    dataKey="Average_AQI" 
                                    name="Avg. AQI"
                                    stroke="#22d3ee" 
                                    strokeWidth={2}
                                    fillOpacity={1} 
                                    fill="url(#colorAqi)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Current AQI Card */}
                <div className={`p-6 rounded-2xl bg-gradient-to-r ${bgColor} border border-slate-700/50`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-300 mb-2">Current Month's Average AQI</h2>
                            <div className="flex items-baseline space-x-2">
                                <span className={`text-4xl font-bold ${aqiColor}`}>{currentAQI}</span>
                                <span className={`text-xl font-medium ${aqiColor}`}>{aqiCategory}</span>
                            </div>
                            <p className="text-slate-400 mt-2 max-w-md">
                                Air quality is {aqiCategory}. Acceptable, but sensitive individuals should take precautions.
                            </p>
                        </div>
                        <div className="text-left sm:text-right flex-shrink-0">
                            <div className="flex items-center space-x-2 text-slate-400 mb-2">
                                <Calendar size={16} />
                                <span>July 2025</span>
                            </div>
                            <div className={`flex items-center space-x-2 ${aqiDifference > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                {aqiDifference > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                <span>{Math.abs(aqiDifference)} from last month</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent AQI Readings */}
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-4 sm:p-6">
                    <h2 className="text-xl font-semibold text-slate-300 mb-4">Recent Monthly AQI Readings</h2>
                    <div className="space-y-3">
                        {recentReadings.map((reading, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-900/50 hover:bg-slate-700/50 transition-colors duration-200 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <span className="text-slate-400 font-mono text-sm">{reading.time}</span>
                                    <span className="text-white font-medium">Average AQI {reading.aqi}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`text-xs font-semibold ${reading.trend === 'up' ? 'text-red-400' : 'text-green-400'}`}>
                                        {reading.trend === 'up' ? 'Worsened' : 'Improved'}
                                    </span>
                                    {reading.trend === 'up' ? (
                                        <TrendingUp size={16} className="text-red-400" />
                                    ) : (
                                        <TrendingDown size={16} className="text-green-400" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default App;
