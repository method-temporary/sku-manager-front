import React from 'react';
import { Pagination } from 'semantic-ui-react';
import { usePortletPagination } from './portletPagination.services';

export function PortletPaginationContainer() {
  const [activePage, totalPages, onPageChange] = usePortletPagination();

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