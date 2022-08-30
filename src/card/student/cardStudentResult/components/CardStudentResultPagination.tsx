import { observer } from 'mobx-react';
import CardStudentStore from '../../cardStudent/CardStudent.store';
import { useFindCardStudentForAdminStudent } from '../../cardStudent/CardStudent.hooks';
import React, { useCallback } from 'react';
import { PaginationProps } from 'semantic-ui-react';
import { Pagination } from '../../../../shared/ui';
import CardStudentResultStore from '../CardStudentResult.store';

export const CardStudentResultPagination = observer(() => {
  //
  const { cardStudentResultQuery, cardStudentResultParams, setOffset, setParams } = CardStudentResultStore.instance;
  const { data: students } = useFindCardStudentForAdminStudent(cardStudentResultParams);

  const totalPages = () => {
    if (students === undefined) {
      return 0;
    }

    return Math.ceil(students.totalCount / cardStudentResultQuery.limit);
  };

  const onClickSearch = useCallback(() => {
    setParams();
  }, [setParams]);

  const onPageChange = (_: React.MouseEvent, data: PaginationProps) => {
    setOffset(data.activePage as number);
    onClickSearch();
  };

  return <Pagination offset={cardStudentResultQuery.offset} totalPages={totalPages()} onPageChange={onPageChange} />;
});
