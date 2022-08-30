import React from 'react';
import { Container } from 'semantic-ui-react';
import { PageTitle } from 'shared/components';
import { PortletListContainer } from './portletList/PortletListContainer';
import { useClearPortletManagement } from './portletManagement.services';
import { PortletPaginationContainer } from './portletPagination/PortletPaginationContainer';
import { PortletSearchBoxContainer } from './portletSerchBox/PortletSearchBoxContainer';

export function PortletManagementContainer() {
  useClearPortletManagement();

  return (
    <Container fluid>
      <PageTitle breadcrumb={breadcrumb} />
      <PortletSearchBoxContainer />
      <PortletListContainer />
      <PortletPaginationContainer />
    </Container>
  );
}

const breadcrumb = [
  { key: 'home', content: 'HOME', active: false, link: true },
  { key: 'arrage-management', content: '전시 관리', active: false, link: true },
  { key: 'content-management', content: 'Content 관리', active: false, link: true },
  { key: 'toktok-portlet', content: 'toktok', active: true, link: false },
];
