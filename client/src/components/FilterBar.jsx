const FilterBar = ({ filters, onFilterChange }) => {
    return (
        <div className="filter-bar">
            <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={filters.search}
                    onChange={(e) => onFilterChange('search', e.target.value)}
                    className="search-input"
                />
            </div>

            <select
                value={filters.status}
                onChange={(e) => onFilterChange('status', e.target.value)}
                className="filter-select"
            >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
            </select>

            <select
                value={filters.priority}
                onChange={(e) => onFilterChange('priority', e.target.value)}
                className="filter-select"
            >
                <option value="">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
            </select>

            <select
                value={`${filters.sortBy}:${filters.order}`}
                onChange={(e) => {
                    const [sortBy, order] = e.target.value.split(':');
                    onFilterChange('sortBy', sortBy);
                    onFilterChange('order', order);
                }}
                className="filter-select"
            >
                <option value="createdAt:desc">Newest First</option>
                <option value="createdAt:asc">Oldest First</option>
                <option value="dueDate:asc">Due Date ↑</option>
                <option value="dueDate:desc">Due Date ↓</option>
                <option value="priority:desc">Priority ↑</option>
                <option value="title:asc">Title A–Z</option>
            </select>
        </div>
    );
};

export default FilterBar;
