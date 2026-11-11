import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  PlayCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  AlertCircle,
} from 'lucide-react';

export default function TaskCard({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  onViewDetails,
}) {
  const isCompleted = task.status === 'Completed';

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Check if overdue
  const isOverdue =
    task.dueDate &&
    !isCompleted &&
    new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

  // Quick toggle next status
  const handleQuickStatusToggle = () => {
    if (task.status === 'Pending') onStatusChange(task._id, 'In Progress');
    else if (task.status === 'In Progress') onStatusChange(task._id, 'Completed');
    else onStatusChange(task._id, 'Pending');
  };

  return (
    <div className={`task-card ${isCompleted ? 'completed' : ''}`}>
      <div>
        {/* Card Top: Badges & Actions */}
        <div className="task-card-header">
          <div className="task-badges">
            {/* Priority Badge */}
            <span className={`badge badge-priority-${task.priority.toLowerCase()}`}>
              {task.priority === 'High' && '🔥 '}
              {task.priority}
            </span>

            {/* Category */}
            {task.category && (
              <span className="badge badge-category">{task.category}</span>
            )}
          </div>

          {/* Quick Status Dropdown */}
          <select
            className={`badge badge-status-${task.status.toLowerCase().replace(/\s+/g, '')}`}
            style={{ cursor: 'pointer', border: 'none', outline: 'none' }}
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Title */}
        <h3
          className="task-title"
          style={{ marginTop: '0.75rem', cursor: 'pointer' }}
          onClick={() => onViewDetails(task)}
        >
          {task.title}
        </h3>

        {/* Description snippet */}
        {task.description ? (
          <p className="task-desc" style={{ marginTop: '0.4rem' }}>
            {task.description}
          </p>
        ) : (
          <p className="task-desc" style={{ marginTop: '0.4rem', fontStyle: 'italic', color: '#6b7280' }}>
            No additional description.
          </p>
        )}
      </div>

      {/* Card Footer: Due Date & Actions */}
      <div className="task-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {task.dueDate ? (
            <span className={`task-due-date ${isOverdue ? 'overdue' : ''}`}>
              <Calendar size={13} />
              <span>{formatDate(task.dueDate)}</span>
              {isOverdue && <span style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>(Overdue)</span>}
            </span>
          ) : (
            <span className="task-due-date" style={{ color: '#6b7280' }}>
              <Clock size={13} />
              <span>No due date</span>
            </span>
          )}
        </div>

        <div className="task-actions">
          {/* Quick status toggle button */}
          <button
            className="btn-icon"
            onClick={handleQuickStatusToggle}
            title={`Current: ${task.status}. Click to cycle status.`}
          >
            {task.status === 'Completed' ? (
              <CheckCircle size={18} color="#10b981" />
            ) : task.status === 'In Progress' ? (
              <PlayCircle size={18} color="#f59e0b" />
            ) : (
              <Circle size={18} color="#94a3b8" />
            )}
          </button>

          {/* View Details */}
          <button
            className="btn-icon"
            onClick={() => onViewDetails(task)}
            title="View Task Details"
          >
            <Eye size={17} />
          </button>

          {/* Edit */}
          <button
            className="btn-icon"
            onClick={() => onEdit(task)}
            title="Edit Task"
          >
            <Edit2 size={17} />
          </button>

          {/* Delete */}
          <button
            className="btn-icon"
            onClick={() => onDelete(task)}
            title="Delete Task"
            style={{ color: '#ef4444' }}
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
