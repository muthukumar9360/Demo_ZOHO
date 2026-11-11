import React from 'react';
import { X, Calendar, Clock, Tag, Flag, CheckCircle2, Edit2, Trash2 } from 'lucide-react';

export default function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  if (!isOpen || !task) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`badge badge-priority-${task.priority.toLowerCase()}`}>
              {task.priority} Priority
            </span>
            <span className={`badge badge-status-${task.status.toLowerCase().replace(/\s+/g, '')}`}>
              {task.status}
            </span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Title */}
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.3 }}>
            {task.title}
          </h2>

          {/* Description */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              whiteSpace: 'pre-wrap',
              fontSize: '0.9rem',
              color: task.description ? 'var(--text-main)' : '#6b7280',
              fontStyle: task.description ? 'normal' : 'italic',
            }}
          >
            {task.description || 'No description provided for this task.'}
          </div>

          {/* Meta Details Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              fontSize: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
              <Tag size={16} color="#6366f1" />
              <span>Category:</span>
              <strong style={{ color: '#f8fafc' }}>{task.category || 'General'}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
              <Calendar size={16} color="#f59e0b" />
              <span>Due Date:</span>
              <strong style={{ color: '#f8fafc' }}>{formatDate(task.dueDate)}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
              <Clock size={16} color="#10b981" />
              <span>Created:</span>
              <strong style={{ color: '#f8fafc' }}>{formatDate(task.createdAt)}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
              <Clock size={16} color="#3b82f6" />
              <span>Updated:</span>
              <strong style={{ color: '#f8fafc' }}>{formatDate(task.updatedAt)}</strong>
            </div>
          </div>

          {/* MongoDB Document ID */}
          <div
            style={{
              marginTop: '1.5rem',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: '#94a3b8',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>MongoDB ID:</span>
            <span>{task._id}</span>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div>
            <button
              className="btn-secondary"
              onClick={() => {
                onClose();
                onDelete(task);
              }}
              style={{ color: '#ef4444' }}
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className="btn-secondary"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
            >
              <Edit2 size={16} />
              <span>Edit Task</span>
            </button>

            <button
              className="btn-primary"
              onClick={() => {
                onStatusChange(
                  task._id,
                  task.status === 'Completed' ? 'Pending' : 'Completed'
                );
                onClose();
              }}
            >
              <CheckCircle2 size={16} />
              <span>{task.status === 'Completed' ? 'Mark Pending' : 'Mark Completed'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
