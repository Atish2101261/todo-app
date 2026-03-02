const statusConfig = {
    'pending': { label: 'Pending', className: 'badge-pending' },
    'in-progress': { label: 'In Progress', className: 'badge-inprogress' },
    'completed': { label: 'Completed', className: 'badge-completed' },
};

const priorityConfig = {
    'low': { label: '↓ Low', className: 'priority-low' },
    'medium': { label: '→ Medium', className: 'priority-medium' },
    'high': { label: '↑ High', className: 'priority-high' },
};

const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || statusConfig['pending'];
    return <span className={`badge ${config.className}`}>{config.label}</span>;
};

const PriorityBadge = ({ priority }) => {
    const config = priorityConfig[priority] || priorityConfig['medium'];
    return <span className={`priority-badge ${config.className}`}>{config.label}</span>;
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

    return (
        <div className={`task-card ${task.status === 'completed' ? 'task-completed' : ''}`}>
            <div className="task-card-header">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
            </div>

            <h3 className="task-title">{task.title}</h3>

            {task.description && (
                <p className="task-description">{task.description}</p>
            )}

            {task.tags?.length > 0 && (
                <div className="task-tags">
                    {task.tags.map((tag, i) => (
                        <span key={i} className="tag">#{tag}</span>
                    ))}
                </div>
            )}

            {task.dueDate && (
                <div className={`task-due ${isOverdue ? 'overdue' : ''}`}>
                    📅 {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {isOverdue && <span className="overdue-label"> · Overdue</span>}
                </div>
            )}

            <div className="task-card-footer">
                <select
                    className="status-select"
                    value={task.status}
                    onChange={(e) => onStatusChange(task._id, e.target.value)}
                >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
                <div className="task-actions">
                    <button className="icon-btn edit-btn" onClick={() => onEdit(task)} title="Edit task">✎</button>
                    <button className="icon-btn delete-btn" onClick={() => onDelete(task._id)} title="Delete task">✕</button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
