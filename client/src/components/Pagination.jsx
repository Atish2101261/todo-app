const Pagination = ({ pagination, onPageChange }) => {
    const { page, totalPages, total, limit } = pagination;
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    return (
        <div className="pagination">
            <span className="pagination-info">
                Showing {start}–{end} of {total} tasks
            </span>
            <div className="pagination-controls">
                <button
                    className="page-btn"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                >
                    ‹
                </button>
                {pages.map((p) => (
                    <button
                        key={p}
                        className={`page-btn ${p === page ? 'active' : ''}`}
                        onClick={() => onPageChange(p)}
                    >
                        {p}
                    </button>
                ))}
                <button
                    className="page-btn"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                >
                    ›
                </button>
            </div>
        </div>
    );
};

export default Pagination;
