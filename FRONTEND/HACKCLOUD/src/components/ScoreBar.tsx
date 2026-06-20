import React from 'react';

interface ScoreBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

const getColor = (value: number) => {
  if (value >= 8) return '#00d4b1';
  if (value >= 5) return '#f59e0b';
  return '#ef4444';
};

export const ScoreBar: React.FC<ScoreBarProps> = ({ label, value, max = 10, color }) => {
  const pct = (value / max) * 100;
  const c = color ?? getColor(value);

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>{label}</span>
        <span style={{
          fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-display)',
          color: c,
        }}>
          {value}<span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>/{max}</span>
        </span>
      </div>
      <div style={{
        height: 6, borderRadius: 3,
        background: 'rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 3,
          background: `linear-gradient(90deg, ${c}99, ${c})`,
          transition: 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          boxShadow: `0 0 8px ${c}66`,
        }} />
      </div>
    </div>
  );
};
