import React, { useState, useMemo } from 'react';
import { Plus, CheckSquare, Search, SlidersHorizontal } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import TaskCard from '../components/TaskCard';
import TaskTable from '../components/TaskTable';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function TasksPage({
  tasks,
  loading,
  onOpenCreateModal,
  onStatusChange,
  onEdit,
  onDelete,
  onViewDetails,
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Extract unique categories from tasks
  const categories = useMemo(() => {
    const set = new Set();
    tasks.forEach((t) => {
      if (t.category && t.category.trim()) {
        set.add(t.category.trim());
      }
    });
    return Array.from(set);
  }, [tasks]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search filter
        if (search.trim()) {
          const query = search.toLowerCase();
          const matchTitle = task.title?.toLowerCase().includes(query);
          const matchDesc = task.description?.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc) return false;
        }

        // Status filter
        if (statusFilter !== 'All' && task.status !== statusFilter) {
          return false;
        }

        // Priority filter
        if (priorityFilter !== 'All' && task.priority !== priorityFilter) {
          return false;
        }

        // Category filter
        if (categoryFilter !== 'All' && task.category !== categoryFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortBy === 'priority') {
          const weight = { High: 3, Medium: 2, Low: 1 };
          return (weight[b.priority] || 0) - (weight[a.priority] || 0);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        // Default: newest first (createdAt)
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [tasks, search, statusFilter, priorityFilter, categoryFilter, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
    setSortBy('createdAt');
  };

  return (
    <div>
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
            Task Inventory
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Showing {filteredTasks.length} of {tasks.length} total tasks
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenCreateModal}>
          <Plus size={16} />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Filter and search bar */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onResetFilters={handleResetFilters}
      />

      {/* Content state */}
      {loading ? (
        <LoadingSkeleton count={6} viewMode={viewMode} />
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-wrap">
            <CheckSquare size={32} />
          </div>
          <h3>No matching tasks found</h3>
          <p>
            {tasks.length === 0
              ? "You haven't created any tasks yet. Create one now to get started!"
              : 'Try clearing your search query or relaxing your filter parameters.'}
          </p>
          {tasks.length === 0 ? (
            <button className="btn-primary" onClick={onOpenCreateModal}>
              <Plus size={16} />
              <span>Create Task</span>
            </button>
          ) : (
            <button className="btn-secondary" onClick={handleResetFilters}>
              Reset Filters
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="tasks-grid">
          {filteredTasks.map((task) => (
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
      ) : (
        <TaskTable
          tasks={filteredTasks}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
        />
      )}
    </div>
  );
}

