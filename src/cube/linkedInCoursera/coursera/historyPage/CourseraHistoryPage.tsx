import { observer } from 'mobx-react';
import { CourseHistorySearchBox } from './components/CourseHistorySearchBox';
import React, { useCallback } from 'react';
import { Breadcrumb, Container, Header, PaginationProps } from 'semantic-ui-react';
import SelectType from '../../../../shared/model/SelectType';
import { CompletionCourse } from './components/CompletionCourse';
import { CourseHistoryListTable } from './components/CourseraHistoryListTable';
import CourseraHistoryPageStore from './CourseraHistoryPage.store';
import { useFindCoursera } from './CourseraHistoryPage.hooks';
import { Pagination } from '../../../../shared/ui';

export const CourseraHistoryPage = observer(() => {
  //
  const { offset, limit, params } = CourseraHistoryPageStore.instance;
  const { setOffset, setLimit, setParams } = CourseraHistoryPageStore.instance;

  const { data, isLoading } = useFindCoursera(params);

  const totalPages = () => {
    if (data === undefined) {
      return 0;
    }

    return Math.ceil(data.totalCount / limit);
  };

  const onClickSearch = useCallback(() => {
    setParams();
  }, [setParams]);

  const onPageChange = (_: React.MouseEvent, data: PaginationProps) => {
    setOffset(data.activePage as number);
    onClickSearch();
  };

  return (
    <Container fluid>
      <div>
        <Breadcrumb icon="right angle" sections={SelectType.learningStateSection} />
        <Header as="h2">Coursera 학습완료 처리</Header>
      </div>
      <CourseHistorySearchBox />
      <CompletionCourse />
      <CourseHistoryListTable cpHistories={(data && data.results) || []} />
      <Pagination offset={offset} totalPages={totalPages()} onPageChange={onPageChange} />
    </Container>
  );
});
