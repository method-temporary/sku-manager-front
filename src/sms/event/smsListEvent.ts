import { ButtonProps, DropdownProps } from 'semantic-ui-react';

import { reactAlert } from '@nara.platform/accent';

import { SendSmsApi } from 'shared/present';
import { getCurrentHistory } from 'shared/store';

import { findUser } from 'sms/api/senderApi';
import { getSmsSendPath } from 'sms/viewmodel/SmsRoutePath';
import { SmsListItem } from 'sms/viewmodel/SmsListViewModel';
import { setSmsListPage } from 'sms/store/SmsListPageStore';
import { setSmsListLimit } from 'sms/store/SmsListLimitStore';
import { setSmsModalViewModel } from 'sms/store/SmsModalStore';
import { setSmsDetailViewModel } from 'sms/store/SmsDetailStore';
import { getSmsUserInfo, setSmsUserInfo } from 'sms/store/SmsListStore';

export async function findUserInfo() {
  const user = await findUser();
  let userPhone = '';
  let userAllowed = false;
  if (user != undefined) {
    userPhone = user.phone;
  }
  const myQualified = await SendSmsApi.instance.findMySmsSenderQualified();
  if (myQualified !== undefined) {
    userAllowed = myQualified.qualified;
  }
  setSmsUserInfo({ userPhone, userAllowed });
  return { userPhone, userAllowed };
}

export function onChangeLimit(_: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
  setSmsListPage(1);
  setSmsListLimit(data.value as number);
}

export function onClickSendSms(_: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) {
  const userInfo = getSmsUserInfo();
  if (userInfo?.userAllowed) {
    const currentHistory = getCurrentHistory();
    currentHistory?.push(getSmsSendPath());
  } else {
    reactAlert({
      title: '알림',
      message: 'SMS 발송 권한이 없으므로 Help Desk(02-6323-9002)로 문의 주시기 바랍니다',
    });
  }
}

export async function onClickSmsItem(item: SmsListItem) {
  //
  const detaileResult = await SendSmsApi.instance.findSendSmsResult(item.id);

  await setSmsDetailViewModel({
    from: item.from,
    to: item.to,
    message: item.message,
    sentDate: item.sentDate,
    detail: detaileResult,
  });

  await setSmsModalViewModel({
    isOpen: true,
  });
}
