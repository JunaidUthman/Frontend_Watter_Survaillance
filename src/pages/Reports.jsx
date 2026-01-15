import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Loader2, Download, FileText, Droplets } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Reports = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('custom');
    const [customRange, setCustomRange] = useState({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [isDownloading, setIsDownloading] = useState(false);
    const reportRef = useRef(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            let url = `${API_URL}/api/reports/stats?period=${period}`;
            if (period === 'custom') {
                url += `&startDate=${customRange.start}&endDate=${customRange.end}`;
            }
            const res = await axios.get(url);
            console.log('--- FRONTEND REPORT DEBUG ---');
            console.log('API URL:', url);
            console.log('API Response Data:', res.data);

            if (res.data.success) {
                const reportData = res.data.data;
                setStats({
                    ...reportData,
                    dateRange: res.data.dateRange || { start: null, end: null }
                });
                console.log('SUCCESS: State updated with', reportData.history?.length || 0, 'history points.');
            }
            console.log('--- DEBUG END ---');
        } catch (err) {
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [period]);

    const handleDownloadPDF = async () => {
        if (!reportRef.current) return;

        try {
            setIsDownloading(true);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Buffer for rendering deep data

            const canvas = await html2canvas(reportRef.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: 1123
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgProps = pdf.getImageProperties(imgData);
            const ratio = imgProps.width / imgProps.height;

            let finalWidth = pdfWidth;
            let finalHeight = pdfWidth / ratio;

            if (finalHeight > pdfHeight) {
                finalHeight = pdfHeight;
                finalWidth = finalHeight * ratio;
            }

            const marginX = (pdfWidth - finalWidth) / 2;
            const marginY = (pdfHeight - finalHeight) / 2;

            pdf.addImage(imgData, 'PNG', marginX, marginY, finalWidth, finalHeight);
            pdf.save(`Aquarium_Audit_HighFidelity_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (err) {
            console.error('PDF Generation error:', err);
        } finally {
            setIsDownloading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString();
    };

    return (
        <div className="main-content">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Analytics & Reports</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Professional high-density audit system</p>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        {['custom', 'week', 'month', 'year'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                style={periodBtnStyle(period === p)}
                            >
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Start Date</label>
                    <input
                        type="date"
                        value={customRange.start}
                        onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                        style={inputStyle}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>End Date</label>
                    <input
                        type="date"
                        value={customRange.end}
                        onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                        style={inputStyle}
                    />
                </div>
                <button
                    onClick={fetchStats}
                    className="btn-primary"
                    style={{ height: '42px', padding: '0 24px' }}
                >
                    Apply Filter
                </button>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                    <Loader2 size={40} className="spin-slow" color="var(--primary)" />
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={20} color="var(--primary)" />
                            <h2 style={{ fontSize: '1.25rem' }}>Report Preview</h2>
                        </div>
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isDownloading}
                            className="download-btn-v3"
                        >
                            {isDownloading ? <Loader2 size={16} className="spin-slow" /> : <Download size={16} />}
                            {isDownloading ? 'Processing High-Res Graphics...' : 'Download Official Audit'}
                        </button>
                    </div>

                    <div
                        id="official-report-capture"
                        ref={reportRef}
                        style={{
                            background: '#ffffff',
                            color: '#1a202c',
                            padding: '50px 70px',
                            width: '1123px',
                            margin: '0 auto',
                            fontFamily: "'Segoe UI', system-ui, sans-serif",
                            border: '1px solid #e2e8f0',
                            position: 'relative',
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Header Section */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #1a202c', paddingBottom: '25px', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <Droplets size={50} color="#2b6cb0" />
                                <div>
                                    <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '900', color: '#1a202c', letterSpacing: '-1.5px' }}>
                                        Junaid & Salhi organization
                                    </h1>
                                    <div style={{ fontSize: '16px', color: '#4a5568', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        High-Density Environmental Audit
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '22px', fontWeight: '900', color: '#1a202c' }}>REF-{Math.floor(Date.now() / 100000)}</div>
                                <div style={{ fontSize: '11px', color: '#718096', fontWeight: '900', background: '#f7fafc', padding: '4px 8px', borderRadius: '4px', marginTop: '5px' }}>DOC STATUS: VERIFIED</div>
                            </div>
                        </div>

                        {/* Summary Narrative */}
                        <div style={{ marginBottom: '40px', padding: '25px', background: '#f8fafc', borderLeft: '5px solid #2b6cb0', borderRadius: '0 4px 4px 0' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#1a202c', marginBottom: '10px', textTransform: 'uppercase' }}>
                                1.0 High-Density Surveillance Summary
                            </h2>
                            <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.7', color: '#2d3748', textAlign: 'justify' }}>
                                Surveillance Window: <strong>{formatDate(stats?.dateRange?.start)}</strong> to <strong>{formatDate(stats?.dateRange?.end)}</strong>.
                                This document provides a certified log of water quality metrics. The following graphs utilize <strong>High-Density Adaptive Sampling</strong> to ensure that all environmental fluctuations are captured and visualized with high fidelity, regardless of the inspection duration.
                            </p>
                        </div>

                        {/* High-Fidelity 2+1 Graph Layout */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginBottom: '50px' }}>
                            <div style={{ display: 'flex', gap: '30px' }}>
                                <div style={{ flex: 1, border: '1px solid #edf2f7', padding: '20px', borderRadius: '8px', background: '#fff' }}>
                                    <h3 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '20px', color: '#1a202c', textAlign: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                                        PH LEVEL FLUCTUATIONS
                                    </h3>
                                    <LineChart width={460} height={220} data={stats?.history || []}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis dataKey="timestamp" hide />
                                        <YAxis domain={['6', '9']} fontSize={11} stroke="#94a3b8" tickFormatter={(val) => `${val} pH`} />
                                        <Tooltip
                                            labelFormatter={(val) => new Date(val).toLocaleString()}
                                            formatter={(value) => [`${value} pH`, 'pH']}
                                        />
                                        <Line
                                            name="pH"
                                            type="monotone"
                                            dataKey="ph"
                                            stroke="var(--primary)"
                                            strokeWidth={2.5}
                                            dot={false}
                                            isAnimationActive={false}
                                        />
                                    </LineChart>
                                </div>
                                <div style={{ flex: 1, border: '1px solid #edf2f7', padding: '20px', borderRadius: '8px', background: '#fff' }}>
                                    <h3 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '20px', color: '#1a202c', textAlign: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                                        THERMAL STABILITY ANALYSIS (°C)
                                    </h3>
                                    <LineChart width={460} height={220} data={stats?.history || []}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis dataKey="timestamp" hide />
                                        <YAxis domain={['auto', 'auto']} fontSize={11} stroke="#94a3b8" tickFormatter={(val) => `${val}°C`} />
                                        <Tooltip
                                            labelFormatter={(val) => new Date(val).toLocaleString()}
                                            formatter={(value) => [`${value} °C`, 'Temperature']}
                                        />
                                        <Line
                                            name="Temp"
                                            type="monotone"
                                            dataKey="temperature"
                                            stroke="#f43f5e"
                                            strokeWidth={2.5}
                                            dot={false}
                                            isAnimationActive={false}
                                        />
                                    </LineChart>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <div style={{ border: '1px solid #edf2f7', padding: '20px', borderRadius: '8px', background: '#fff', width: '650px' }}>
                                    <h3 style={{ fontSize: '13px', fontWeight: '800', marginBottom: '20px', color: '#1a202c', textAlign: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                                        TURBIDITY DISTRIBUTION (NTU)
                                    </h3>
                                    <AreaChart width={610} height={220} data={stats?.history || []}>
                                        <defs>
                                            <linearGradient id="colorTurb" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis dataKey="timestamp" hide />
                                        <YAxis domain={['auto', 'auto']} fontSize={11} stroke="#94a3b8" tickFormatter={(val) => `${val} NTU`} />
                                        <Tooltip
                                            labelFormatter={(val) => new Date(val).toLocaleString()}
                                            formatter={(value) => [`${value} NTU`, 'Turbidity']}
                                        />
                                        <Area
                                            name="Turbidity"
                                            type="monotone"
                                            dataKey="turbidity"
                                            stroke="#f59e0b"
                                            fill="url(#colorTurb)"
                                            strokeWidth={2.5}
                                            dot={false}
                                            isAnimationActive={false}
                                        />
                                    </AreaChart>
                                </div>
                            </div>
                        </div>

                        {/* Audit Log Table */}
                        <div style={{ marginTop: 'auto', paddingBottom: '30px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#1a202c', marginBottom: '20px', textTransform: 'uppercase', borderLeft: '4px solid #1a202c', paddingLeft: '12px' }}>
                                2.0 Operational Status Log
                            </h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #1a202c', textAlign: 'left', background: '#f7fafc' }}>
                                        <th style={{ padding: '12px' }}>HARDWARE ASSET</th>
                                        <th style={{ padding: '12px' }}>CLASS</th>
                                        <th style={{ padding: '12px' }}>HEALTH</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.sensors?.concat(stats?.actuators || []).map((item, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #edf2f7' }}>
                                            <td style={{ padding: '10px 12px', fontWeight: '700' }}>{item.name}</td>
                                            <td style={{ padding: '10px 12px' }}>{item.type ? 'SENSOR' : 'ACTUATOR'}</td>
                                            <td style={{
                                                padding: '10px 12px',
                                                fontWeight: '800',
                                                color: (item.status?.toUpperCase() === 'ACTIF' || item.status?.toUpperCase() === 'ON' || item.status?.toUpperCase() === 'WORKING')
                                                    ? '#059669' // Green for working
                                                    : '#dc2626' // Red for broken/off
                                            }}>
                                                {item.status?.toUpperCase()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Disclaimer */}
                        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '10px', color: '#718096' }}>
                            <div>
                                VERIFIED EXTRACT FROM AQUARIUM SURVEILLANCE DATABASE | {new Date().getFullYear()}
                            </div>
                            <div style={{ textAlign: 'right', color: '#1a202c', fontWeight: '800' }}>
                                GENERATED: {new Date().toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .download-btn-v3 {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: #0f172a;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    border: none;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .download-btn-v3:hover { background: #1e293b; transform: translateY(-2px); }
                .download-btn-v3:disabled { opacity: 0.7; cursor: wait; }
            `}</style>
        </div>
    );
};

const periodBtnStyle = (active) => ({
    padding: '6px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: active ? 'var(--primary)' : 'transparent',
    color: active ? '#fff' : 'var(--text-muted)',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.875rem'
});

const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff'
};

export default Reports;
