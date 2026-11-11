import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import TaskModal from './components/TaskModal';
import TaskDetailModal from './components/TaskDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import {
  getTasks,
  getTaskStats,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  checkHealth,
} from './services/api';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    highPriority: 0,
  });
  const [loading, setLoading] = useState(true);

  // System & DB Health State
  const [backendOnline, setBackendOnline] = useState(false);
  const [dbStatus, setDbStatus] = useState({
    connected: false,
    checking: true,
    name: '',
  });

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Health Check
  const verifyHealth = useCallback(async () => {
    try {
      const data = await checkHealth();
      setBackendOnline(true);
      setDbStatus({
        connected: data.database?.connected || false,
        checking: false,
        name: data.database?.name || 'cloud_task_manager',
      });
    } catch (err) {
      setBackendOnline(false);
      setDbStatus({
        connected: false,
        checking: false,
        name: '',
      });
    }
  }, []);

  // Fetch all tasks and stats
  const fetchData = useCallback(async (showToast = false) => {
    setLoading(true);
    try {
      await verifyHealth();
      const [tasksRes, statsRes] = await Promise.all([
        getTasks(),
        getTaskStats().catch(() => ({ data: null })),
      ]);

      const loadedTasks = tasksRes.data || [];
      setTasks(loadedTasks);

      if (statsRes.data) {
        setStats(statsRes.data);
      } else {
        // Fallback stats computation
        setStats({
          total: loadedTasks.length,
          completed: loadedTasks.filter((t) => t.status === 'Completed').length,
          pending: loadedTasks.filter((t) => t.status === 'Pending').length,
          inProgress: loadedTasks.filter((t) => t.status === 'In Progress').length,
          highPriority: loadedTasks.filter((t) => t.priority === 'High').length,
        });
      }

      if (showToast) {
        addToast('Workspace data refreshed successfully', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [verifyHealth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Create or Update task
  const handleSaveTask = async (taskPayload) => {
    try {
      if (editingTask) {
        const res = await updateTask(editingTask._id, taskPayload);
        setTasks((prev) =>
          prev.map((t) => (t._id === editingTask._id ? res.data : t))
        );
        addToast(`Task "${res.data.title}" updated successfully`, 'success');
      } else {
        const res = await createTask(taskPayload);
        setTasks((prev) => [res.data, ...prev]);
        addToast(`Task "${res.data.title}" created successfully`, 'success');
      }
      fetchData(false);
    } catch (err) {
      throw err;
    }
  };

  // Handle quick status change
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );

      const res = await updateTaskStatus(taskId, newStatus);
      addToast(`Status updated to ${newStatus}`, 'success');
      fetchData(false);
    } catch (err) {
      fetchData(false); // Rollback on failure
      addToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    setDeleteLoading(true);
    try {
      await deleteTask(deletingTask._id);
      setTasks((prev) => prev.filter((t) => t._id !== deletingTask._id));
      addToast(`Task "${deletingTask.title}" deleted`, 'info');
      setDeletingTask(null);
      fetchData(false);
    } catch (err) {
      addToast(err.message || 'Failed to delete task', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        dbStatus={dbStatus}
        taskCount={tasks.length}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <Navbar
          activeTab={activeTab}
          onRefresh={() => fetchData(true)}
          loading={loading}
          onOpenCreateModal={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
          backendOnline={backendOnline}
        />

        <div className="content-body">
          {activeTab === 'dashboard' ? (
            <DashboardPage
              stats={stats}
              tasks={tasks}
              loading={loading}
              onOpenCreateModal={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              onStatusChange={handleStatusChange}
              onEdit={(task) => {
                setEditingTask(task);
                setIsTaskModalOpen(true);
              }}
              onDelete={(task) => setDeletingTask(task)}
              onViewDetails={(task) => setViewingTask(task)}
              onNavigateToTasks={() => setActiveTab('tasks')}
            />
          ) : (
            <TasksPage
              tasks={tasks}
              loading={loading}
              onOpenCreateModal={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              onStatusChange={handleStatusChange}
              onEdit={(task) => {
                setEditingTask(task);
                setIsTaskModalOpen(true);
              }}
              onDelete={(task) => setDeletingTask(task)}
              onViewDetails={(task) => setViewingTask(task)}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSaveTask}
        initialTask={editingTask}
      />

      <TaskDetailModal
        isOpen={Boolean(viewingTask)}
        task={viewingTask}
        onClose={() => setViewingTask(null)}
        onEdit={(task) => {
          setViewingTask(null);
          setEditingTask(task);
          setIsTaskModalOpen(true);
        }}
        onDelete={(task) => {
          setViewingTask(null);
          setDeletingTask(task);
        }}
        onStatusChange={handleStatusChange}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingTask)}
        taskTitle={deletingTask?.title || ''}
        loading={deleteLoading}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Floating Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

