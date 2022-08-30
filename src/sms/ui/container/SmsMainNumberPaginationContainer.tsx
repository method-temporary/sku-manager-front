import React from 'react';
import { Pagination } from 'semantic-ui-react';
import { useSmsMainNumberPagination } from 'sms/hooks/useSmsMainNumberPagination';

export function SmsMainNumberPaginationContainer() {
  const [activePage, totalPages, onPageChange] = useSmsMainNumberPagination();
  return (
    <div className="center">
      <Pagination activePage={activePage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
