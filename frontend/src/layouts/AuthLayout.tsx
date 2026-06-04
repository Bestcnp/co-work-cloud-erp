/**
 * Auth Layout
 *
 * Full-screen centered layout for login/register pages.
 * Features animated gradient background and glassmorphism card.
 */

import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Animated Background */}
      <div className="auth-bg" />

      {/* Content Card */}
      <div
        className="glass-strong"
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '440px',
          margin: '24px',
          padding: '48px 40px',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1
            className="gradient-text"
            style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: '8px',
            }}
          >
            Co-Work Cloud
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Enterprise Resource Planning Platform
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
