import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';

const Pagination = ({ currentPage = 1, totalPages = 1, onClick }) => {
  return (
    <div className="flex items-center">
      <FlatButton color="primary" icon="paginationDecrease" isDisabled={currentPage === 1} onClick={() => onClick('down')} />
      <span className="px-1 rounded text-xs mx-2 border border-lm-3 dark:border-dm-3 min-w-10 text-center tabular-nums">{currentPage}/{totalPages}</span>
      <FlatButton color="primary" icon="paginationIncrease" isDisabled={currentPage === totalPages} onClick={() => onClick('up')} />
    </div>
  );
};

export default Pagination;