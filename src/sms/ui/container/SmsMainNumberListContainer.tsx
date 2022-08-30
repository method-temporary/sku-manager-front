import React from 'react';
import { onChangeLimit, onClickCreateMainNumber } from 'sms/event/smsMainNumberEvent';
import { useRequestMainNumberList } from 'sms/hooks/useRequestMainNumberList';
import { useSmsMainNumberNo } from 'sms/hooks/useSmsMainNumberNo';
import { useSmsMainNumberListLimit, useSmsMainNumberListViewModel } from 'sms/store/SmsMainNumberStore';
import { SmsMainNumberListHeaderView } from '../view/SmsMainNumberListHeaderView';
import { SmsMainNumberListView } from '../view/SmsMainNumberListView';

export function SmsMainNumberListContainer() {
  useRequestMainNumberList();
  const smsList = useSmsMainNumberListViewModel();
  const smsListLimit = useSmsMainNumberListLimit() || 20;
  const smsNo = useSmsMainNumberNo() || 1;

  return (
    <>
      <SmsMainNumberListHeaderView
        totalCount={smsList?.totalCount || 0}
        smsLimit={smsListLimit}
        onChangeLimit={onChangeLimit}
        onClickCreateMainNumber={onClickCreateMainNumber}
      />
      <SmsMainNumberListView smsNo={smsNo} smsList={smsList?.results} />
    </>
  );
}
