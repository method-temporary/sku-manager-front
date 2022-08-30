import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { PaginationProps } from 'semantic-ui-react';
import { Pagination } from '../../../../shared/ui';
import CardStudentStore from '../CardStudent.store';
import { useFindCardStudentForAdminStudent } from '../CardStudent.hooks';

export const CardStudentPagination = observer(() => {
  //
  const { cardStudentQuery, cardStudentParams, setOffset, setParams } = CardStudentStore.instance;
  const { data: students } = useFindCardStudentForAdminStudent(cardStudentParams);

  const totalPages = () => {
    if (students === undefined) {
      return 0;
    }

    return Math.ceil(students.totalCount / cardStudentQuery.limit);
  };

  const onClickSearch = useCallback(() => {
    setParams();
  }, [setParams]);

  const onPageChange = (_: React.MouseEvent, data: PaginationProps) => {
    setOffset(data.activePage as number);
    onClickSearch();
  };

  return <Pagination offset={cardStudentQuery.offset} totalPages={totalPages()} onPageChange={onPageChange} />;
});
