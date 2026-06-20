import React from 'react';

export const Spinner: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = 'var(--accent-teal)',
}) => (
  <div style={{
    width: size, height: size,
    border: `2px solid ${color}33`,
    borderTopColor: color,
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    flexShrink: 0,
  }} />
);
