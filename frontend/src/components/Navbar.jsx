import React from 'react';
import { RefreshCw, Server, Plus, Menu } from 'lucide-react';

export default function Navbar({
  activeTab,
  onRefresh,
  loading,
  onOpenCreateModal,
  backendOnline,
}) {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-title-wrap">
          <h1>{activeTab === 'dashboard' ? 'Overview & Analytics' : 'Task Workspace'}</h1>
          <p>
            {activeTab === 'dashboard'
              ? 'Real-time metrics, workload distribution and active sprints'
              : 'Manage, filter, prioritize and update all task records'}
          </p>
        </div>
      </div>

      <div className="header-actions">
        {/* Server Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '999px',
            background: backendOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: backendOnline ? '#34d399' : '#f87171',
            border: `1px solid ${backendOnline ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          }}
        >
          <Server size={14} />
          <span>{backendOnline ? 'Backend API: 5000' : 'Backend Offline'}</span>
        </div>

        {/* Refresh button */}
        <button
          className="btn-secondary"
          onClick={onRefresh}
          disabled={loading}
          title="Refresh data"
          style={{ padding: '0.55rem 0.85rem' }}
        >
          <RefreshCw size={16} className={loading ? 'spin-anim' : ''} />
          <span style={{ fontSize: '0.85rem' }}>Refresh</span>
        </button>

        {/* Quick Add */}
        <button className="btn-primary" onClick={onOpenCreateModal} style={{ padding: '0.55rem 1rem' }}>
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      </div>
    </header>
  );
}

