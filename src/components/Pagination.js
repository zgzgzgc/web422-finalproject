import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ marginTop: '20px' }}>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          style={{
            padding: '10px',
            margin: '5px',
            backgroundColor: currentPage === index + 1 ? '#0070f3' : '#fff',
            color: currentPage === index + 1 ? '#fff' : '#000',
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
