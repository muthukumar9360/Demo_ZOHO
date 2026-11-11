import React from 'react';

export default function StatCard({ title, value, icon: Icon, color, bg, subtitle }) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <h3>{title}</h3>
        <div className="stat-value">{value}</div>
        {subtitle && (
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            {subtitle}
          </p>
        )}
      </div>
      <div className="stat-icon-wrapper" style={{ backgroundColor: bg, color: color }}>
        <Icon size={24} />
      </div>
    </div>
  );
}

