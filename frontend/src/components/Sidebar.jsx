import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  PlusCircle,
  Database,
  Cloud,
  Layers,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  onOpenCreateModal,
  dbStatus,
  taskCount,
}) {
  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Cloud size={22} />
        </div>
        <div>
          <div className="brand-name">CloudTask</div>
          <span className="brand-tag">MERN SaaS</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <CheckSquare size={19} />
          <span>All Tasks</span>
          {taskCount > 0 && (
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '0.75rem',
                padding: '0.1rem 0.5rem',
                borderRadius: '999px',
                background: activeTab === 'tasks' ? 'rgba(255,255,255,0.2)' : 'rgba(148, 163, 184, 0.15)',
              }}
            >
              {taskCount}
            </span>
          )}
        </button>

        <div style={{ marginTop: '1.5rem', padding: '0 0.5rem' }}>
          <button
            className="btn-primary"
            style={{ width: '100%', padding: '0.75rem' }}
            onClick={onOpenCreateModal}
          >
            <PlusCircle size={18} />
            <span>New Task</span>
          </button>
        </div>
      </nav>

      {/* Footer / Database Status */}
      <div className="sidebar-footer">
        <div className="db-status-pill">
          <span
            className={`status-dot ${
              dbStatus.connected ? 'connected' : dbStatus.checking ? 'checking' : 'disconnected'
            }`}
          />
          <Database size={14} color="#94a3b8" />
          <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 500 }}>
            {dbStatus.connected
              ? `DB: ${dbStatus.name || 'Atlas Connected'}`
              : dbStatus.checking
              ? 'Connecting DB...'
              : 'DB: Disconnected'}
          </span>
        </div>
      </div>
    </aside>
  );
}

