import React from 'react';

export default function LoadingSkeleton({ count = 6, viewMode = 'grid' }) {
  if (viewMode === 'table') {
    return (
      <div className="table-container" style={{ padding: '1rem' }}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              height: '48px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '0.75rem',
              animation: 'pulse 1.5s infinite ease-in-out',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="tasks-grid">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="task-card"
          style={{
            minHeight: '170px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            animation: 'pulse 1.5s infinite ease-in-out',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ width: '60px', height: '20px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px' }} />
            <div style={{ width: '70px', height: '20px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px' }} />
          </div>
          <div style={{ width: '80%', height: '22px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', marginBottom: '0.75rem' }} />
          <div style={{ width: '100%', height: '14px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', marginBottom: '0.5rem' }} />
          <div style={{ width: '60%', height: '14px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', marginTop: 'auto' }} />
        </div>
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.25; }
        }
      `}</style>
    </div>
  );
}
