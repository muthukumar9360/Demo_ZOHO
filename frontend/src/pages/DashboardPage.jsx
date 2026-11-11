import React from 'react';
import {
  CheckCircle,
  Clock,
  PlayCircle,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingUp,
  Plus,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';

export default function DashboardPage({
  stats,
  tasks,
  loading,
  onOpenCreateModal,
  onStatusChange,
  onEdit,
  onDelete,
  onViewDetails,
  onNavigateToTasks,
}) {
  const total = stats.total || 0;
  const completed = stats.completed || 0;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Filter out recent 6 tasks
  const recentTasks = tasks.slice(0, 6);

  return (
    <div>
      {/* Top Welcome & KPI row */}
      <div className="stats-grid">
        <StatCard
          title="Total Tasks"
          value={total}
          icon={Layers}
          color="#6366f1"
          bg="rgba(99, 102, 241, 0.15)"
          subtitle="All active & archived tasks"
        />
        <StatCard
          title="Completed"
          value={completed}
          icon={CheckCircle}
          color="#10b981"
          bg="rgba(16, 185, 129, 0.15)"
          subtitle={`${completionPercentage}% completion rate`}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress || 0}
          icon={PlayCircle}
          color="#f59e0b"
          bg="rgba(245, 158, 11, 0.15)"
          subtitle="Currently underway"
        />
        <StatCard
          title="Pending"
          value={stats.pending || 0}
          icon={Clock}
          color="#3b82f6"
          bg="rgba(59, 130, 246, 0.15)"
          subtitle="Awaiting start"
        />
        <StatCard
          title="High Priority"
          value={stats.highPriority || 0}
          icon={AlertTriangle}
          color="#ef4444"
          bg="rgba(239, 68, 68, 0.15)"
          subtitle="Urgent attention required"
        />
      </div>

      {/* Progress & Quick Overview */}
      <div className="overview-panel">
        <div className="progress-header">
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="#6366f1" />
              Overall Sprint Completion
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {completed} of {total} tasks completed across all categories
            </p>
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
            {completionPercentage}%
          </span>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div style={{ marginTop: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
              Recent Tasks
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Recently created and updated task items
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className="btn-secondary"
              onClick={onNavigateToTasks}
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
            >
              <span>View All Tasks</span>
              <ArrowRight size={15} />
            </button>
            <button
              className="btn-primary"
              onClick={onOpenCreateModal}
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
            >
              <Plus size={15} />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {recentTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrap">
              <Layers size={32} />
            </div>
            <h3>No tasks found in your workspace</h3>
            <p>Get started by creating your first task to track progress and due dates.</p>
            <button className="btn-primary" onClick={onOpenCreateModal}>
              <Plus size={16} />
              <span>Create Task</span>
            </button>
          </div>
        ) : (
          <div className="tasks-grid">
            {recentTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusChange={onStatusChange}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

