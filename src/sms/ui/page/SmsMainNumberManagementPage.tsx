import React from 'react';
import { useClearMainNumberManagement } from 'sms/hooks/useClearMainNumberManagement';
import { SmsMainNumberManagementContainer } from '../container/SmsMainNumberManagementContainer';

export function SmsMainNumberManagementPage() {
  useClearMainNumberManagement();
  return (
    <>
      <SmsMainNumberManagementContainer />
    </>
  );
}
