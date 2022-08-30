import React from 'react';
import { useClearSmsManagement } from 'sms/hooks/useClearSmsManagement';
import { SmsManagementContainer } from '../container/SmsManagementContainer';
import { SmsModalContainer } from '../container/SmsModalContainer';

export function SmsManagementPage() {
  useClearSmsManagement();
  return (
    <>
      <SmsManagementContainer />
      <SmsModalContainer />
    </>
  );
}