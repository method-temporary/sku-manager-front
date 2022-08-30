import React from 'react';
import { Container } from 'semantic-ui-react';
import { PageTitle } from 'shared/components';
import { useRequestMainNumberDetail } from 'sms/hooks/useRequestMainNumberDetail';
import { SmsMainNumberCreateView } from '../view/SmsMainNumberCreateView';

export function SmsMainNumberCreateContainer() {
  useRequestMainNumberDetail();
  return (
    <Container fluid>
      <PageTitle breadcrumb={breadcrumb} />
      <SmsMainNumberCreateView />
    </Container>
  );
}

const breadcrumb = [
  { key: 'Home', content: 'HOME', link: true },
  { key: 'Support', content: '서비스 관리', link: true },
  { key: 'Mail', content: 'SMS 대표번호 관리', active: true },
];
