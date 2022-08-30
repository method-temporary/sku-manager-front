import React from 'react';
import { observer } from 'mobx-react';
import { Container } from 'semantic-ui-react';
import { PageTitle, SubActions } from 'shared/components';
import { SelectType } from 'shared/model';
import { PaidCourseSearchBox } from './paidCourseSearchBox/PaidCourseSearchBox';
import { PaidCourseTable } from './components/PaidCourseTable';

export function PaidCourse() {
  return (
    <Container fluid>
      <PageTitle breadcrumb={SelectType.paidCourseSections} />
      <PaidCourseSearchBox />
      <PaidCourseTable />
    </Container>
  );
}
