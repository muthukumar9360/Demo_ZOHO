import React from 'react';
import {
  Calendar,
  CheckCircle,
  Circle,
  PlayCircle,
  Edit2,
  Trash2,
  Eye,
} from 'lucide-react';

export default function TaskTable({
  tasks,
  onStatusChange,
  onEdit,
  onDelete,
  onViewDetails,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="table-container">
      <table className="task-table">
        <thead>
          <tr>
            <th style={{ width: '40px' }}>Done</th>
            <th>Title & Description</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Due Date</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const isOverdue =
              task.dueDate &&
              !isCompleted &&
              new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

            return (
              <tr key={task._id}>
                {/* Done Checkbox */}
                <td>
                  <button
                    className="btn-icon"
                    onClick={() =>
                      onStatusChange(
                        task._id,
                        task.status === 'Completed' ? 'Pending' : 'Completed'
                      )
                    }
                    title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                  >
                    {isCompleted ? (
                      <CheckCircle size={18} color="#10b981" />
                    ) : task.status === 'In Progress' ? (
                      <PlayCircle size={18} color="#f59e0b" />
                    ) : (
                      <Circle size={18} color="#94a3b8" />
                    )}
                  </button>
                </td>

                {/* Title & Desc */}
                <td style={{ maxWidth: '320px' }}>
                  <div
                    style={{
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: isCompleted ? 'line-through' : 'none',
                      color: isCompleted ? '#94a3b8' : '#f8fafc',
                    }}
                    onClick={() => onViewDetails(task)}
                  >
                    {task.title}
                  </div>
                  {task.description && (
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {task.description}
                    </div>
                  )}
                </td>

                {/* Category */}
                <td>
                  <span className="badge badge-category">{task.category || 'General'}</span>
                </td>

                {/* Priority */}
                <td>
                  <span className={`badge badge-priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </td>

                {/* Status selector */}
                <td>
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
                </td>

                {/* Due Date */}
                <td>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: isOverdue ? '#f87171' : '#94a3b8',
                      fontWeight: isOverdue ? 600 : 400,
                    }}
                  >
                    {formatDate(task.dueDate)}
                    {isOverdue && ' (Overdue)'}
                  </span>
                </td>

                {/* Actions */}
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                    <button
                      className="btn-icon"
                      onClick={() => onViewDetails(task)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => onEdit(task)}
                      title="Edit Task"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => onDelete(task)}
                      title="Delete Task"
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
