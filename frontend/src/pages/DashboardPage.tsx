/**
 * Dashboard Page
 *
 * Main overview with stat cards, system status, and quick actions.
 */

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface HealthStatus {
  status: string;
  timestamp: string;
}

interface HermesStatus {
  connected: boolean;
  models: string[];
  error?: string;
}

const STAT_CARDS = [
  { icon: '🗂️', value: '24', label: 'Total Tasks', accent: 'var(--accent-cyan)' },
  { icon: '📁', value: '6', label: 'Active Projects', accent: 'var(--accent-violet)' },
  { icon: '👥', value: '12', label: 'Team Members', accent: 'var(--accent-emerald)' },
  { icon: '🤖', value: '3', label: 'AI Reviews', accent: 'var(--accent-amber)' },
];

const QUICK_ACTIONS = [
  { icon: '➕', label: 'New Task', path: '/tasks' },
  { icon: '📦', label: 'New Product', path: '/products' },
  { icon: '🔍', label: 'Compliance Audit', path: '/compliance' },
  { icon: '🏪', label: 'Marketplace', path: '/marketplace' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [hermes, setHermes] = useState<HermesStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [hermesLoading, setHermesLoading] = useState(true);

  useEffect(() => {
    api
      .health()
      .then(setHealth)
      .catch(() => setHealth(null))
      .finally(() => setHealthLoading(false));

    api
      .hermesStatus()
      .then(setHermes)
      .catch(() => setHermes(null))
      .finally(() => setHermesLoading(false));
  }, []);

  return (
    <div>
      {/* Welcome Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '4px' }}>
          Welcome back
          <span className="gradient-text" style={{ marginLeft: '8px' }}>
            {user?.email?.split('@')[0] || 'Developer'}
          </span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Here's an overview of your enterprise platform
        </p>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className="card hover-glow"
            style={{
              borderLeft: `3px solid ${card.accent}`,
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span style={{ fontSize: '2rem' }}>{card.icon}</span>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, lineHeight: 1 }}>
                {card.value}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                {card.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Status */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>
        System Status
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {/* API Health */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span
              className={`status-dot ${healthLoading ? 'loading' : health ? 'online' : 'offline'}`}
            />
            <span style={{ fontWeight: 500 }}>Backend API</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {healthLoading
              ? 'Checking...'
              : health
                ? `Healthy — ${health.status}`
                : 'Unreachable'}
          </p>
        </div>

        {/* Hermes AI */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span
              className={`status-dot ${hermesLoading ? 'loading' : hermes?.connected ? 'online' : 'offline'}`}
            />
            <span style={{ fontWeight: 500 }}>Hermes AI</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {hermesLoading
              ? 'Checking...'
              : hermes?.connected
                ? `Connected — ${hermes.models.join(', ')}`
                : hermes?.error || 'Disconnected'}
          </p>
        </div>

        {/* Firebase */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span className={`status-dot ${user ? 'online' : 'offline'}`} />
            <span style={{ fontWeight: 500 }}>Firebase Auth</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {user ? `Authenticated as ${user.email}` : 'Not authenticated'}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>
        Quick Actions
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
        }}
      >
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            className="card hover-glow"
            style={{
              cursor: 'pointer',
              textAlign: 'center',
              padding: '20px',
              border: '1px solid var(--border)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '8px' }}>
              {action.icon}
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
