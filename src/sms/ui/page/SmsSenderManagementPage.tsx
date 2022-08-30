import React from 'react';
import { useClearSenderManagement } from 'sms/hooks/useClearSenderManagement';
import { SmsSenderManagementContainer } from '../container/SmsSenderManagementContainer';

export function SmsSenderManagementPage() {
  useClearSenderManagement();
  return (
    <>
      <SmsSenderManagementContainer />
    </>
  );
}
