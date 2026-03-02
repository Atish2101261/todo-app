import { useState, useEffect } from 'react';

const INITIAL = { title: '', description: '', status: 'pending', priority: 'medium', dueDate: '', tags: '' };

const TaskForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [form, setForm] = useState(INITIAL);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setForm({
                title: initialData.title || '',
                description: initialData.description || '',
                status: initialData.status || 'pending',
                priority: initialData.priority || 'medium',
                dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
                tags: initialData.tags?.join(', ') || '',
            });
        } else {
            setForm(INITIAL);
        }
        setErrors({});
    }, [initialData, isOpen]);

    const validate = () => {
        const errs = {};
        if (!form.title.trim()) errs.title = 'Title is required';
        else if (form.title.trim().length < 3) errs.title = 'Title must be at least 3 characters';
        return errs;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }

        setLoading(true);
        try {
            const payload = {
                ...form,
                tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
                dueDate: form.dueDate || null,
            };
            await onSubmit(payload);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{initialData ? 'Edit Task' : 'New Task'}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit} className="task-form">
                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="What needs to be done?"
                            className={errors.title ? 'error' : ''}
                        />
                        {errors.title && <span className="error-msg">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Add details (optional)..."
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Status</label>
                            <select name="status" value={form.status} onChange={handleChange}>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Priority</label>
                            <select name="priority" value={form.priority} onChange={handleChange}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Due Date</label>
                            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Tags (comma separated)</label>
                            <input name="tags" value={form.tags} onChange={handleChange} placeholder="work, urgent, design" />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
