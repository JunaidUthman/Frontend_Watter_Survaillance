import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { RefreshCw, Zap, Activity, Thermometer, Droplets, Clock } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000';

const Dashboard = ({ isConnected, lastReading }) => {
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statsPeriod, setStatsPeriod] = useState('week');

    const fetchData = async (period = statsPeriod) => {
        try {
            setLoading(true);
            const [historyRes, statsRes] = await Promise.all([
                axios.get(`${API_URL}/api/sensors/history`),
                axios.get(`${API_URL}/api/reports/stats?period=${period}`)
            ]);

            if (historyRes.data.success) {
                setHistory(historyRes.data.data.reverse());
            }
            if (statsRes.data.success) {
                setStats(statsRes.data.data);
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatsOnly = async (period) => {
        try {
            const res = await axios.get(`${API_URL}/api/reports/stats?period=${period}`);
            if (res.data.success) {
                setStats(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (lastReading) {
            setHistory(prev => {
                const newHistory = [...prev, lastReading];
                return newHistory.length > 50 ? newHistory.slice(1) : newHistory;
            });
        }
    }, [lastReading]);

    const handlePeriodChange = (e) => {
        const newPeriod = e.target.value;
        setStatsPeriod(newPeriod);
        fetchStatsOnly(newPeriod);
    };

    return (
        <div className="main-content">
            <header style={headerStyle}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Live Surveillance</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Real-time telemetry and advanced analytics</p>
                </div>

                <div style={statusBadgeStyle(isConnected)}>
                    <Zap size={14} className={isConnected ? 'pulse' : ''} />
                    {isConnected ? 'STREAMING' : 'DISCONNECTED'}
                </div>
            </header>

            {/* Side-by-Side Charts Container - NOW AT TOP */}
            <div style={chartsGridStyle}>
                {/* Triple Line Chart */}
                <div className="glass-card" style={{ height: '480px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '1.125rem' }}>History Stream (Triple Axis)</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Latest 50 captures</p>
                        </div>
                        <button onClick={() => fetchData()} style={refreshBtnStyle}>
                            <RefreshCw size={16} />
                        </button>
                    </div>

                    {loading && history.length === 0 ? (
                        <div style={centerStyle}>Synchronizing...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height="85%" minHeight={0}>
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis
                                    dataKey="timestamp"
                                    tickFormatter={(val) => new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    stroke="#64748b"
                                    fontSize={10}
                                />
                                <YAxis yAxisId="left" stroke="#64748b" fontSize={11} />
                                <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={11} domain={[0, 400]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                                <Legend verticalAlign="top" height={36} />
                                <Line
                                    yAxisId="left"
                                    name="pH Level"
                                    type="monotone"
                                    dataKey="ph"
                                    stroke="var(--primary)"
                                    strokeWidth={3}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                                <Line
                                    yAxisId="left"
                                    name="Temperature (°C)"
                                    type="monotone"
                                    dataKey="temperature"
                                    stroke="#f43f5e"
                                    strokeWidth={3}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                                <Line
                                    yAxisId="right"
                                    name="Turbidity (NTU)"
                                    type="monotone"
                                    dataKey="turbidity"
                                    stroke="var(--warning)"
                                    strokeWidth={3}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Adjustable Bar Chart */}
                <div className="glass-card" style={{ height: '480px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.125rem' }}>Statistical Comparison</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={14} color="var(--text-muted)" />
                            <select
                                value={statsPeriod}
                                onChange={handlePeriodChange}
                                style={selectStyle}
                            >
                                <option value="day">Last 24h</option>
                                <option value="week">Weekly</option>
                                <option value="month">Monthly</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ height: '85%' }}>
                        {loading ? (
                            <div style={centerStyle}>Calculating averages...</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%" minHeight={0}>
                                <BarChart data={[
                                    { name: 'pH', value: stats?.avgPh },
                                    { name: 'Temp', value: stats?.avgTemp },
                                    { name: 'Turb (Log)', value: stats?.avgTurb ? (Math.log10(stats.avgTurb) * 2).toFixed(2) : 0 }
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" />
                                    <YAxis stroke="#64748b" />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                    />
                                    <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '10px' }}>
                            *Turbidity scaled to logarithmic visibility for comparative analysis
                        </p>
                    </div>
                </div>
            </div>

            {/* REAL-TIME GAUGES (2+1 Layout) - NOW AT BOTTOM */}
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <GaugeCard
                        title="Real-time pH"
                        value={lastReading?.ph || history[history.length - 1]?.ph || 7.0}
                        min={0} max={14}
                        color="var(--primary)"
                        unit="pH"
                    />
                    <GaugeCard
                        title="Real-time Temperature"
                        value={lastReading?.temperature || history[history.length - 1]?.temperature || 25.0}
                        min={0} max={50}
                        color="#f43f5e"
                        unit="°C"
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: 'calc(50% - 1rem)' }}>
                        <GaugeCard
                            title="Real-time Turbidity"
                            value={lastReading?.turbidity || history[history.length - 1]?.turbidity || 0}
                            min={0} max={500}
                            color="var(--warning)"
                            unit="NTU"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const GaugeCard = ({ title, value, min, max, color, unit }) => {
    const data = [
        { name: 'value', value: value > max ? max : (value < min ? min : value), fill: color },
        { name: 'remaining', value: max - (value > max ? max : (value < min ? min : value)), fill: '#1e293b' }
    ];

    return (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '700' }}>{title}</h4>
            <div style={{ position: 'relative', width: '200px', height: '120px' }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={0}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{typeof value === 'number' ? value.toFixed(1) : value}</div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>{unit}</div>
                </div>
            </div>
        </div>
    );
};

const chartsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const statusBadgeStyle = (connected) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 16px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '900',
    backgroundColor: connected ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    color: connected ? 'var(--success)' : 'var(--danger)',
    border: `1px solid ${connected ? 'var(--success)' : 'var(--danger)'}`,
    letterSpacing: '1px'
});

const refreshBtnStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
};

const selectStyle = {
    padding: '4px 12px',
    borderRadius: '6px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: '0.75rem',
    cursor: 'pointer',
    outline: 'none'
};

const centerStyle = {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.875rem'
};

export default Dashboard;
