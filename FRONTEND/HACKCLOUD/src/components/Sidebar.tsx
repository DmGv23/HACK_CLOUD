import React from 'react';
import { Home, BarChart3, Clock, ChevronRight } from 'lucide-react';

type View = 'home' | 'results' | 'history';

interface SidebarProps {
  current: View;
  onChange: (v: View) => void;
  hasJob: boolean;
}

const items: { id: View; label: string; icon: React.ReactNode; requiresJob?: boolean }[] = [
  { id: 'home',    label: 'Inicio',     icon: <Home size={18} /> },
  { id: 'results', label: 'Resultados', icon: <BarChart3 size={18} />, requiresJob: true },
  { id: 'history', label: 'Historial',  icon: <Clock size={18} /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ current, onChange, hasJob }) => (
  <aside style={{
    width: 220,
    minHeight: '100vh',
    background: 'var(--bg-card)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
    position: 'fixed',
    top: 0, left: 0, bottom: 0,
    zIndex: 50,
  }}>
    {/* Logo */}
    <div style={{ padding: '0 20px 28px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-purple))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 700, color: '#fff',
          fontFamily: 'var(--font-display)',
          boxShadow: '0 0 16px var(--accent-teal-glow)',
        }}>
          IA
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Impact<span style={{ color: 'var(--accent-teal)' }}>IA</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>Evaluación Social</div>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav style={{ padding: '16px 12px', flex: 1 }}>
      {items.map((item) => {
        const disabled = item.requiresJob && !hasJob;
        const active = current === item.id;
        return (
          <button
            key={item.id}
            onClick={() => !disabled && onChange(item.id)}
            disabled={disabled}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 10, padding: '10px 12px',
              marginBottom: 4,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: active ? 'var(--accent-teal-dim)' : 'transparent',
              color: active ? 'var(--accent-teal)' : disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontSize: 13,
              fontFamily: 'var(--font-body)',
              fontWeight: active ? 600 : 400,
              transition: 'all 0.15s',
              textAlign: 'left',
              borderLeft: active ? '2px solid var(--accent-teal)' : '2px solid transparent',
            }}
            onMouseEnter={(e) => { if (!disabled && !active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {item.icon}
              {item.label}
            </span>
            {active && <ChevronRight size={14} />}
          </button>
        );
      })}
    </nav>

    {/* Footer */}
    <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
      <p style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.5 }}>
        Hackathon Cloud 2026<br />
        <span style={{ color: 'var(--accent-teal)', opacity: 0.7 }}>ImpactIA v1.0</span>
      </p>
    </div>
  </aside>
);
