import { useState, useEffect, useCallback } from 'react';
import { fetchTasks, fetchTaskStats } from '../api/tasks';
import toast from 'react-hot-toast';

const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ pending: 0, 'in-progress': 0, completed: 0, total: 0 });
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        search: '',
        sortBy: 'createdAt',
        order: 'desc',
        page: 1,
        limit: 6,
    });

    const loadTasks = useCallback(async () => {
        setLoading(true);
        try {
            const [tasksRes, statsRes] = await Promise.all([
                fetchTasks(filters),
                fetchTaskStats(),
            ]);
            setTasks(tasksRes.data.data);
            setPagination(tasksRes.data.pagination);
            setStats(statsRes.data.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load tasks');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : value }));
    };

    const setPage = (page) => setFilters((prev) => ({ ...prev, page }));

    return { tasks, stats, pagination, loading, filters, updateFilter, setPage, refresh: loadTasks };
};

export default useTasks;
