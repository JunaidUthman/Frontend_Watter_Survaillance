import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Settings,
    Cpu,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Thermometer,
    Droplet,
    Wind,
    Zap,
    RefreshCw,
    Activity,
    Shield
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Sensors = ({ lastReading }) => {
    const [sensors, setSensors] = useState([]);
    const [actuators, setActuators] = useState([]);
    const [latestState, setLatestState] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [sensorRes, actuatorRes, historyRes] = await Promise.all([
                axios.get(`${API_URL}/api/sensors`),
                axios.get(`${API_URL}/api/actuators`),
                axios.get(`${API_URL}/api/sensors/history`)
            ]);

            if (sensorRes.data.success) setSensors(sensorRes.data.data);
            if (actuatorRes.data.success) setActuators(actuatorRes.data.data);
            if (historyRes.data.success && historyRes.data.data.length > 0) {
                setLatestState(historyRes.data.data[0]); // Most recent reading
            }
        } catch (err) {
            console.error('Error fetching hardware health:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getFuncIcon = (func) => {
        switch (func.toLowerCase()) {
            case 'ph': return <Droplet size={18} color="var(--primary)" />;
            case 'temperature': return <Thermometer size={18} color="#f43f5e" />;
            case 'turbidity': return <Wind size={18} color="var(--warning)" />;
            case 'tds': return <Zap size={18} color="#a855f7" />;
            case 'water_pump': return <RefreshCw size={18} color="var(--primary)" />;
            default: return <Cpu size={18} color="var(--text-muted)" />;
        }
    };

    return (
        <div className="main-content">
            <header style={headerStyle}>
                <div style={titleArea}>
                    <div style={badge}>SYSTEM INTEGRITY</div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' }}>Hardware Health</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        Live diagnostic monitoring for aquarium edge components
                    </p>
                </div>
                <button onClick={fetchData} className="glass-card" style={refreshButtonStyle}>
                    <RefreshCw size={18} className={loading ? 'spin-slow' : ''} />
                    <span>Scan System</span>
                </button>
            </header>

            {loading ? (
                <div style={loaderContainer}>
                    <Loader2 size={48} className="spin-slow" color="var(--primary)" />
                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Polling Edge Gateway...</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>

                    {/* Sensors Section */}
                    <section>
                        <div style={sectionTitleStyle}>
                            <div className="icon-box" style={{ background: 'rgba(0, 210, 255, 0.1)' }}>
                                <Cpu size={22} color="var(--primary)" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Integrated Sensor Network</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real-time telemetry nodes for environmental stability</p>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                            <table className="health-table">
                                <thead>
                                    <tr>
                                        <th>Hardware Identifier</th>
                                        <th>Functional Layer</th>
                                        <th>Integrity Status</th>
                                        <th>Diagnostic Sync</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sensors.map((sensor) => (
                                        <tr key={sensor._id}>
                                            <td style={{ fontWeight: '700', color: 'white' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sensor.status === 'working' ? 'var(--success)' : 'var(--danger)' }} />
                                                    {sensor.name}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={smallIconBox}>{getFuncIcon(sensor.functionality)}</div>
                                                    <span style={{ textTransform: 'uppercase', fontWeight: '700', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                                        {sensor.functionality}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${sensor.status === 'working' ? 'status-working' : 'status-broken'}`}>
                                                    {sensor.status === 'working' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                                                    {sensor.status === 'working' ? 'Operational' : 'Broken'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: '500' }}>Active</span>
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Syncing with Cloud</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Actuators Section */}
                    <section>
                        <div style={sectionTitleStyle}>
                            <div className="icon-box" style={{ background: 'rgba(58, 123, 213, 0.1)' }}>
                                <Settings size={22} color="var(--secondary)" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Control Actuators</h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Automated mechanical systems for aquarium regulation</p>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                            <table className="health-table">
                                <thead>
                                    <tr>
                                        <th>Mechanical Device</th>
                                        <th>Task Type</th>
                                        <th>Pump Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {actuators.map((actuator) => {
                                        const isPump = actuator.functionality === 'water_pump';
                                        // Priority: 1. Live WebSocket Reading, 2. Last known State from DB
                                        const activeReading = lastReading || latestState;
                                        const livePumpState = isPump && activeReading?.pumpState?.toUpperCase();

                                        return (
                                            <tr key={actuator._id}>
                                                <td style={{ fontWeight: '700', color: 'white' }}>{actuator.name}</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={smallIconBox}>{getFuncIcon(actuator.functionality)}</div>
                                                        <span style={{ textTransform: 'uppercase', fontWeight: '700', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                                                            {actuator.functionality.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    {isPump && activeReading ? (
                                                        <span className={`status-badge ${livePumpState === 'ON' ? 'status-working' : 'status-broken'}`} style={{ borderStyle: livePumpState === 'ON' ? 'solid' : 'dashed', borderWidth: '2px' }}>
                                                            <Activity size={13} className={livePumpState === 'ON' ? 'pulse' : ''} />
                                                            {livePumpState === 'ON' ? 'STATE: ON' : 'STATE: OFF'}
                                                        </span>
                                                    ) : (
                                                        <span className={`status-badge ${actuator.status === 'working' ? 'status-working' : 'status-broken'}`}>
                                                            {actuator.status === 'working' ? <Shield size={13} /> : <AlertCircle size={13} />}
                                                            {actuator.status === 'working' ? 'Ready' : 'Inspection Required'}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>

                </div>
            )}
        </div>
    );
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '4rem'
};

const titleArea = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
};

const badge = {
    fontSize: '0.7rem',
    fontWeight: '900',
    color: 'var(--primary)',
    letterSpacing: '2px',
    background: 'rgba(0, 210, 255, 0.1)',
    padding: '4px 12px',
    borderRadius: '6px',
    width: 'fit-content'
};

const refreshButtonStyle = {
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    color: 'white',
    fontWeight: '700',
    fontSize: '0.9rem'
};

const sectionTitleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    marginBottom: '2rem'
};

const loaderContainer = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '150px 0'
};

const smallIconBox = {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.03)'
};

export default Sensors;
