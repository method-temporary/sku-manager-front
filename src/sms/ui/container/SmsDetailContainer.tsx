import React from 'react';
import { useSmsDetailViewModel } from 'sms/store/SmsDetailStore';
import { SmsDetailView } from '../view/SmsDetailView';

export function SmsDetailContainer() {
  const smsDetail = useSmsDetailViewModel();

  return (
    <>
      {smsDetail !== undefined && (
        <SmsDetailView
          from={smsDetail.from}
          to={smsDetail.to}
          message={smsDetail.message}
          sentDate={smsDetail.sentDate}
          detail={smsDetail.detail}
        />
      )}
    </>
  );
}
