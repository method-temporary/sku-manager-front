import React from 'react';
import { Container } from 'semantic-ui-react';
import { PageTitle } from 'shared/components';
import { SmsMainNumberListContainer } from './SmsMainNumberListContainer';
import { SmsMainNumberPaginationContainer } from './SmsMainNumberPaginationContainer';
import { SmsMainNumberSearchBoxContainer } from './SmsMainNumberSearchBoxContainer';

export function SmsMainNumberManagementContainer() {
  return (
    <Container fluid>
      <PageTitle breadcrumb={breadcrumb} />
      <SmsMainNumberSearchBoxContainer />
      <SmsMainNumberListContainer />
      <SmsMainNumberPaginationContainer />
    </Container>
  );
}

const breadcrumb = [
  { key: 'Home', content: 'HOME', link: true },
  { key: 'Support', content: '서비스 관리', link: true },
  { key: 'MailAdmin', content: '발송 관리', link: true },
  { key: 'Mail', content: 'SMS 대표번호 관리', active: true },
];
