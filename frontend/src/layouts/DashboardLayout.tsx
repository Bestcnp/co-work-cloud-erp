/**
 * Dashboard Layout
 *
 * Main authenticated layout with collapsible sidebar and top header.
 */

import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NAV_ITEMS = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/tasks', icon: '🗂️', label: 'Tasks' },
  { path: '/chat', icon: '💬', label: 'Chat' },
  { path: '/products', icon: '📦', label: 'Products' },
  { path: '/marketplace', icon: '🏪', label: 'Marketplace' },
  { path: '/showcases', icon: '🎨', label: 'Showcases' },
  { path: '/recruitment', icon: '👥', label: 'Recruitment' },
  { path: '/settings', icon: '⚙️', label: 'Settings' },
];

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside
        className="glass-strong"
        style={{
          width: sidebarCollapsed ? '72px' : '260px',
          transition: 'width var(--transition-slow)',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0,
          borderRight: '1px solid var(--border)',
          borderTop: 'none',
          borderBottom: 'none',
          borderLeft: 'none',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: sidebarCollapsed ? '20px 16px' : '20px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: '64px',
          }}
        >
          {!sidebarCollapsed && (
            <span
              className="gradient-text"
              style={{ fontSize: '1.1rem', fontWeight: 700, whiteSpace: 'nowrap' }}
            >
              CW Cloud
            </span>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="btn-ghost"
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
            }}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? '▶' : '◀'}
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: sidebarCollapsed ? '12px 16px' : '10px 16px',
                marginBottom: '4px',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
                transition: 'all var(--transition-fast)',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                fontSize: '0.92rem',
                fontWeight: isActive ? 500 : 400,
              })}
            >
              <span style={{ fontSize: '1.15rem', flexShrink: 0 }}>{item.icon}</span>
              {!sidebarCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Header */}
        <header
          className="glass"
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 24px',
            gap: '16px',
            borderRadius: 0,
            borderBottom: '1px solid var(--border)',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            flexShrink: 0,
          }}
        >
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {user?.email || 'Developer Mode'}
          </span>
          <button onClick={handleLogout} className="btn btn-ghost" style={{ fontSize: '0.85rem' }}>
            Sign Out
          </button>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
