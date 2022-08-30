import React from 'react';
import { Pagination } from 'semantic-ui-react';
import { useSmsPagination } from 'sms/hooks/useSmsPagination';

export function SmsPaginationContainer() {
  const [activePage, totalPages, onPageChange] = useSmsPagination();
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