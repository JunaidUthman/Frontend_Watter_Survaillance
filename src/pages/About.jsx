import React, { useState } from 'react';
import {
    HelpCircle,
    Waves,
    ChevronDown,
    ChevronUp,
    LayoutDashboard,
    Cpu,
    FileText,
    Cloud,
    Search,
    ShieldCheck,
    BarChart3
} from 'lucide-react';

const About = () => {
    const [openSection, setOpenSection] = useState('dashboard');

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="main-content">
            <header style={headerStyle}>
                <div style={heroIconStyle}>
                    <Waves color="var(--primary)" size={32} />
                </div>
                <h1 style={heroTitleStyle}>Smart Monitoring Solution</h1>
                <p style={heroSubStyle}>
                    Aquarium Surveillance & Cloud Analytics Ecosystem
                </p>
                <div style={badgeContainer}>
                    <span style={heroBadge}><Cloud size={14} /> Cloud Powered</span>
                    <span style={heroBadge}><ShieldCheck size={14} /> Edge Surveillance</span>
                    <span style={heroBadge}><BarChart3 size={14} /> Advanced BI</span>
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '1000px', margin: '0 auto' }}>

                {/* Visual Overview Section */}
                <section className="glass-card" style={overviewCardStyle}>
                    <div style={sectionHeaderStyle}>
                        <HelpCircle color="var(--primary)" size={24} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Platform Overview</h2>
                    </div>

                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.8' }}>
                        This system is a comprehensive IoT solution designed for the rigorous monitoring of smart pools and high-end aquariums.
                        It integrates distributed sensors for <strong>pH, Temperature, and Turbidity</strong> into a unified cloud interface
                        that provides real-time alerts, historical data analysis, and automated hardware health auditing.
                    </p>

                    <div style={stepGridStyle}>
                        <div style={stepCard}>
                            <div style={stepNum}>01</div>
                            <h4 style={stepTitle}>Real-time Streams</h4>
                            <p style={stepText}>Direct WebSocket ingestion from aquarium edge gateways.</p>
                        </div>
                        <div style={stepCard}>
                            <div style={stepNum}>02</div>
                            <h4 style={stepTitle}>History Analysis</h4>
                            <p style={stepText}>Advanced statistical modeling and period-based comparative analysis.</p>
                        </div>
                        <div style={stepCard}>
                            <div style={stepNum}>03</div>
                            <h4 style={stepTitle}>Audit Reporting</h4>
                            <p style={stepText}>Certified documentation for chemical stability and hardware uptime.</p>
                        </div>
                    </div>
                </section>

                {/* Interactive Details Section */}
                <div>
                    <div style={{ ...sectionHeaderStyle, marginBottom: '1.5rem', paddingLeft: '1rem' }}>
                        <Search color="var(--primary)" size={22} />
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Feature Deep-Dive</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <AccordionItem
                            title="Interactive Intelligence Dashboard"
                            isOpen={openSection === 'dashboard'}
                            onClick={() => toggleSection('dashboard')}
                            icon={<LayoutDashboard size={20} />}
                            desc="The central hub for data visualization and system health."
                        >
                            <div style={accordionContentStyle}>
                                <div style={bulletItem}>
                                    <div style={bulletDot} />
                                    <span><strong>Triple-Axis Rendering:</strong> Synchronized plotting of all variables without scale overlap.</span>
                                </div>
                                <div style={bulletItem}>
                                    <div style={bulletDot} />
                                    <span><strong>Dynamic Gauges:</strong> High-precision visual indicators for immediate pool health assessment.</span>
                                </div>
                                <div style={bulletItem}>
                                    <div style={bulletDot} />
                                    <span><strong>Hot-Switch Periods:</strong> Toggle between 24h, 7-day, and 30-day views with zero lag.</span>
                                </div>
                            </div>
                        </AccordionItem>

                        <AccordionItem
                            title="Hardware & Actuator Monitoring"
                            isOpen={openSection === 'hardware'}
                            onClick={() => toggleSection('hardware')}
                            icon={<Cpu size={20} />}
                            desc="Comprehensive management of all IoT sensor nodes and pump systems."
                        >
                            <div style={accordionContentStyle}>
                                <div style={bulletItem}>
                                    <div style={bulletDot} />
                                    <span><strong>Smart Registry:</strong> Auto-detection and status tracking of every physical hardware component.</span>
                                </div>
                                <div style={bulletItem}>
                                    <div style={bulletDot} />
                                    <span><strong>Failure Detection:</strong> Immediate visual alerts if hardware indicates a 'Broken' or 'POLLUÉE' state.</span>
                                </div>
                                <div style={bulletItem}>
                                    <div style={bulletDot} />
                                    <span><strong>Operation Logs:</strong> Automated tracking of the last active operation for every actuator.</span>
                                </div>
                            </div>
                        </AccordionItem>

                        <AccordionItem
                            title="High-Fidelity Automated Reports"
                            isOpen={openSection === 'reports'}
                            onClick={() => toggleSection('reports')}
                            icon={<FileText size={20} />}
                            desc="Professional-grade auditing and documentation engine."
                        >
                            <div style={accordionContentStyle}>
                                <div style={bulletItem}>
                                    <div style={bulletDot} />
                                    <span><strong>Adaptive Data Sampling:</strong> AI-driven reduction of data points to ensure silky smooth report curves.</span>
                                </div>
                                <div style={bulletItem}>
                                    <div style={bulletDot} />
                                    <span><strong>Faceted Consistency:</strong> Guarantees that summary stats match the visual trends 100% of the time.</span>
                                </div>
                                <div style={bulletItem}>
                                    <div style={bulletDot} />
                                    <span><strong>PDF Export Core:</strong> A4-Landscape optimized layouts for professional aquarium management documentation.</span>
                                </div>
                            </div>
                        </AccordionItem>
                    </div>
                </div>
            </div>

            <footer style={footerStyle}>
                <Waves size={20} color="rgba(255,255,255,0.2)" />
                <p>&copy; 2026 SmartAqua Ecosystem • Version 2.0-Alpha</p>
                <div style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.75rem' }}>CONNECTED TO EDGE-CLOUD</div>
            </footer>
        </div>
    );
};

const AccordionItem = ({ title, icon, desc, isOpen, onClick, children }) => (
    <div style={{
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden',
        boxShadow: isOpen ? '0 10px 30px -10px rgba(0, 210, 255, 0.2)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
        <button
            onClick={onClick}
            style={{
                width: '100%',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: isOpen ? 'rgba(0, 210, 255, 0.05)' : 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                textAlign: 'left'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                    color: isOpen ? 'var(--primary)' : 'var(--text-muted)',
                    background: isOpen ? 'rgba(0, 210, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                    padding: '10px',
                    borderRadius: '10px',
                    transition: 'all 0.3s'
                }}>
                    {icon}
                </div>
                <div>
                    <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '4px' }}>{title}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{desc}</p>
                </div>
            </div>
            {isOpen ? <ChevronUp size={20} color="var(--primary)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
        </button>
        {isOpen && (
            <div style={{
                padding: '1.5rem 2rem 2rem 5.25rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                color: 'var(--text-muted)',
                animation: 'slideIn 0.3s ease-out'
            }}>
                {children}
            </div>
        )}
    </div>
);

const headerStyle = {
    textAlign: 'center',
    marginBottom: '5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const heroIconStyle = {
    width: '64px',
    height: '64px',
    background: 'rgba(0, 210, 255, 0.1)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    boxShadow: '0 0 20px rgba(0, 210, 255, 0.2)'
};

const heroTitleStyle = {
    fontSize: '2.5rem',
    fontWeight: '900',
    letterSpacing: '-1.5px',
    marginBottom: '0.5rem',
    background: 'linear-gradient(to right, #fff, var(--primary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
};

const heroSubStyle = {
    color: 'var(--text-muted)',
    fontSize: '1.25rem',
    fontWeight: '500'
};

const overviewCardStyle = {
    padding: '3rem',
    backgroundImage: 'radial-gradient(at top right, rgba(0, 210, 255, 0.05), transparent 40%)'
};

const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '2rem'
};

const stepGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginTop: '1rem'
};

const stepCard = {
    background: 'rgba(255,255,255,0.02)',
    padding: '1.5rem',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.03)'
};

const stepNum = {
    fontSize: '0.75rem',
    fontWeight: '900',
    color: 'var(--primary)',
    marginBottom: '10px'
};

const stepTitle = {
    fontSize: '1rem',
    fontWeight: '700',
    marginBottom: '8px'
};

const stepText = {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5'
};

const badgeContainer = {
    display: 'flex',
    gap: '12px',
    marginTop: '1.5rem'
};

const heroBadge = {
    padding: '6px 14px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    fontSize: '0.7rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const accordionContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
};

const bulletItem = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    fontSize: '0.925rem'
};

const bulletDot = {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary)',
    marginTop: '8px',
    flexShrink: 0
};

const footerStyle = {
    marginTop: '6rem',
    padding: '4rem 2rem',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    color: 'rgba(255,255,255,0.2)',
    fontSize: '0.8rem'
};

export default About;
