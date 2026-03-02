import useTasks from '../hooks/useTasks';
import { createTask, updateTask, deleteTask } from '../api/tasks';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
    const { user } = useAuth();
    const { tasks, stats, pagination, loading, filters, updateFilter, setPage, refresh } = useTasks();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const handleCreate = async (data) => {
        try {
            await createTask(data);
            toast.success('Task created! 🎯');
            refresh();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create task');
            throw err;
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setModalOpen(true);
    };

    const handleUpdate = async (data) => {
        try {
            await updateTask(editingTask._id, data);
            toast.success('Task updated! ✅');
            refresh();
            setEditingTask(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update task');
            throw err;
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await deleteTask(id);
            toast.success('Task deleted');
            refresh();
        } catch (err) {
            toast.error('Failed to delete task');
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await updateTask(id, { status });
            refresh();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    return (
        <>
            <Navbar />
            <main className="main-content">
                {/* Welcome header */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Good day, {user?.name?.split(' ')[0]} 👋</h1>
                        <p className="page-subtitle">Here's your task overview</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => { setEditingTask(null); setModalOpen(true); }}>
                        + New Task
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card total">
                        <div className="stat-icon">📋</div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.total}</span>
                            <span className="stat-label">Total Tasks</span>
                        </div>
                    </div>
                    <div className="stat-card pending">
                        <div className="stat-icon">🕐</div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.pending}</span>
                            <span className="stat-label">Pending</span>
                        </div>
                    </div>
                    <div className="stat-card inprogress">
                        <div className="stat-icon">⚡</div>
                        <div className="stat-info">
                            <span className="stat-value">{stats['in-progress']}</span>
                            <span className="stat-label">In Progress</span>
                        </div>
                    </div>
                    <div className="stat-card completed">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.completed}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                {stats.total > 0 && (
                    <div className="progress-section">
                        <div className="progress-label">
                            <span>Overall Progress</span>
                            <span>{Math.round((stats.completed / stats.total) * 100)}% complete</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${(stats.completed / stats.total) * 100}%` }} />
                        </div>
                    </div>
                )}

                {/* Filters */}
                <FilterBar filters={filters} onFilterChange={updateFilter} />

                {/* Tasks Grid */}
                {loading ? (
                    <div className="spinner-container"><div className="spinner" /></div>
                ) : tasks.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <h3>No tasks found</h3>
                        <p>Try adjusting your filters or create a new task</p>
                        <button className="btn btn-primary" onClick={() => { setEditingTask(null); setModalOpen(true); }}>
                            + Create First Task
                        </button>
                    </div>
                ) : (
                    <div className="tasks-grid">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <Pagination pagination={pagination} onPageChange={setPage} />
            </main>

            <TaskForm
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditingTask(null); }}
                onSubmit={editingTask ? handleUpdate : handleCreate}
                initialData={editingTask}
            />
        </>
    );
};

export default DashboardPage;
