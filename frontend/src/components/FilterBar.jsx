import React from 'react';
import { Search, X, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

export default function FilterBar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  categories = [],
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onResetFilters,
}) {
  const hasActiveFilters =
    search ||
    statusFilter !== 'All' ||
    priorityFilter !== 'All' ||
    categoryFilter !== 'All' ||
    sortBy !== 'createdAt';

  return (
    <div className="filter-bar">
      {/* Search Input */}
      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search tasks by title or description..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="filter-actions">
        {/* Status Filter */}
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          className="filter-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>

        {/* Category Filter */}
        <select
          className="filter-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Sort By */}
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="createdAt">Newest First</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Alphabetical</option>
        </select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            className="btn-secondary"
            onClick={onResetFilters}
            style={{ padding: '0.65rem 0.85rem', fontSize: '0.8rem' }}
          >
            Clear Filters
          </button>
        )}

        {/* View Mode Toggle */}
        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid Cards View"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Table View"
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
