import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import './Pagination.css';

const Pagination = ({
                        currentPage,
                        totalPages,
                        onPageChange,
                        itemsPerPage = 20,
                        onItemsPerPageChange
                    }) => {
    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i);
            }
        }

        let prev = 0;
        for (const i of range) {
            if (i - prev > 1) {
                rangeWithDots.push('...');
            }
            rangeWithDots.push(i);
            prev = i;
        }

        return rangeWithDots;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="pagination-container">
            <div className="pagination-controls">
                <div className="pagination-info">
                    <span>Items per page:</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        className="items-per-page-select"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                <div className="pagination-buttons">
                    <button
                        className="pagination-btn pagination-prev"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={16} />
                        Previous
                    </button>

                    <div className="page-numbers">
                        {getVisiblePages().map((page, index) =>
                            page === '...' ? (
                                <span key={`dots-${index}`} className="page-dots">
                                    <MoreHorizontal size={16} />
                                </span>
                            ) : (
                                <button
                                    key={page}
                                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => onPageChange(page)}
                                >
                                    {page}
                                </button>
                            )
                        )}
                    </div>

                    <button
                        className="pagination-btn pagination-next"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>

                <div className="pagination-stats">
                    Page {currentPage} of {totalPages}
                </div>
            </div>
        </div>
    );
};

export default Pagination;