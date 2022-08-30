import React from 'react';
import { Container } from 'semantic-ui-react';
import { PageTitle } from 'shared/components';
import { TestListContainer } from './TestListContainer';
import { TestPaginationContainer } from './TestPaginationContainer';
import { TestSearchBoxContainer } from './TestSearchBoxContainer';

export function TestManagementContainer() {
  return (
    <Container fluid>
      <PageTitle breadcrumb={breadcrumb} />
      <TestSearchBoxContainer />
      <TestListContainer />
      <TestPaginationContainer />
    </Container>
  );
}

const breadcrumb = [
  { key: 'Home', content: 'HOME', active: false, link: true },
  { key: 'Learning', content: 'Learning 관리', active: false, link: true },
  { key: 'Test', content: 'Test 관리', link: true },
  { key: 'TestForm', content: 'Test 관리', active: true, link: false },
];
