import React from 'react';
import { useEffect } from 'react';
import { findUserInfo, onChangeLimit, onClickSendSms, onClickSmsItem } from 'sms/event/smsListEvent';
import { useRequestSmsList } from 'sms/hooks/useRequestSmsList';
import { useSmsNo } from 'sms/hooks/useSmsNo';
import { useSmsListLimit } from 'sms/store/SmsListLimitStore';
import { useSmsListViewModel, useSmsUserInfo } from 'sms/store/SmsListStore';
import { SmsListHeaderView } from '../view/SmsListHeaderView';
import { SmsListView } from '../view/SmsListView';

export function SmsListContainer() {
  useRequestSmsList();
  useEffect(() => {
    findUserInfo();
  }, []);
  const smsList = useSmsListViewModel();
  const smsListLimit = useSmsListLimit() || 20;
  const smsNo = useSmsNo() || 1;

  return (
    <>
      <SmsListHeaderView
        totalCount={smsList?.totalCount || 0}
        smsLimit={smsListLimit}
        onChangeLimit={onChangeLimit}
        onClickSendSms={onClickSendSms}
      />
      <SmsListView smsNo={smsNo} smsList={smsList?.smsList} onClickItem={onClickSmsItem} />
    </>
  );
}
