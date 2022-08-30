import React from 'react';
import { Pagination } from 'semantic-ui-react';
import { useTestPagination } from 'exam/hooks/useTestPagination';


export function TestPaginationContainer() {
  const [activePage, totalPages, onPageChange] = useTestPagination();

  return (
    <div className="center">
      <Pagination
        activePage={activePage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
