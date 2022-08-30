import React from 'react';
import { Pagination } from 'semantic-ui-react';
import { useSmsSenderPagination } from 'sms/hooks/useSmsSenderPagination';

export function SmsSenderPaginationContainer() {
  const [activePage, totalPages, onPageChange] = useSmsSenderPagination();
  return (
    <div className="center">
      <Pagination activePage={activePage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
