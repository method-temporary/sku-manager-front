import React from 'react';
import { Container } from 'semantic-ui-react';
import { PageTitle } from 'shared/components';
import { SmsListContainer } from './SmsListContainer';
import { SmsPaginationContainer } from './SmsPaginationContainer';
import { SmsSearchBoxContainer } from './SmsSearchBoxContainer';

export function SmsManagementContainer() {
  return (
    <Container fluid>
      <PageTitle breadcrumb={breadcrumb} />
      <SmsSearchBoxContainer />
      <SmsListContainer />
      <SmsPaginationContainer />
    </Container>
  );
}

const breadcrumb = [
  { key: 'Home', content: 'HOME', link: true },
  { key: 'Support', content: '서비스 관리', link: true },
  { key: 'MailAdmin', content: '발송 관리', link: true },
  { key: 'Mail', content: 'SMS 발송 관리', active: true },
];
