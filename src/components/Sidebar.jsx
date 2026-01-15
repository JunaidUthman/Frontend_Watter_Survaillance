import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, FileBarChart, Info, Waves } from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Sensors & Actuators', path: '/sensors', icon: <Activity size={20} /> },
        { name: 'Reports', path: '/reports', icon: <FileBarChart size={20} /> },
        { name: 'About', path: '/about', icon: <Info size={20} /> },
    ];

    return (
        <aside style={sidebarStyle}>
            <div style={logoContainerStyle}>
                <Waves size={32} color="var(--primary)" />
                <h2 style={logoTextStyle}>SmartAqua</h2>
            </div>

            <nav style={navStyle}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            ...linkStyle,
                            backgroundColor: isActive ? 'rgba(0, 210, 255, 0.1)' : 'transparent',
                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                            borderRight: isActive ? '3px solid var(--primary)' : 'none',
                        })}
                    >
                        {item.icon}
                        <span style={{ marginLeft: '12px', fontWeight: '500' }}>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div style={footerStyle}>
                <div style={statusDotStyle}></div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cloud Connected</span>
            </div>
        </aside>
    );
};

// Inline styles for simplicity for this component
const sidebarStyle = {
    width: 'var(--sidebar-width)',
    height: '100vh',
    backgroundColor: 'var(--bg-card)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 100,
};

const logoContainerStyle = {
    padding: '2rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
};

const logoTextStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    letterSpacing: '-0.5px',
};

const navStyle = {
    flexGrow: 1,
    padding: '1rem 0',
};

const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.875rem 1.5rem',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    marginBottom: '4px',
};

const footerStyle = {
    padding: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
};

const statusDotStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--success)',
};

export default Sidebar;
