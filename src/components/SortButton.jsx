import React from 'react';

const SortButton = ({ column, onSort, children }) => {
  return (
    <button onClick={() => onSort(column)}>
      {children} 
    </button>
  );
};

export default SortButton;
