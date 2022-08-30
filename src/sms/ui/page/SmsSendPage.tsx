import React from 'react';
import { useClearSmsSend } from 'sms/hooks/useClearSmsSend';
import { SmsSendFormContainer } from '../container/SmsSendFormContainer';

export function SmsSendPage() {
  useClearSmsSend();
  return (
    <SmsSendFormContainer />
  );
}