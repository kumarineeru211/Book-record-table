import React from 'react';

const Pagination = ({ totalRecords, recordsPerPage, currentPage, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalRecords / recordsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination-container">
      <ul className="pagination-nav">
        {pageNumbers.map(number => (
          <li key={number} className={`pagination-indexNumber ${number === currentPage ? 'pagination-active' : ''}`}>
            <button onClick={() => onPageChange(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
