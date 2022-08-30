import { reactAlert, reactConfirm } from '@nara.platform/accent';
import { TextAreaProps } from 'semantic-ui-react';
import { getCurrentHistory } from 'shared/store';
import { registSentSms } from 'sms/api/sentSmsApi';
import { getSentSmsCdo } from 'sms/model/SentSmsCdo';
import { getSmsUserInfo } from 'sms/store/SmsListStore';
import { getSmsListPath } from 'sms/viewmodel/SmsRoutePath';
import { getSmsSendFormViewModel, setSmsSendFormViewModel } from 'sms/store/SmsSendFormStore';
import { SmsSendFormViewModel, validateSmsSendForm } from 'sms/viewmodel/SmsSendFormViewModel';

export function onChangeFrom(value: string) {
  const smsSendForm = getSmsSendFormViewModel();
  if (smsSendForm !== undefined) {
    setSmsSendFormViewModel({
      ...smsSendForm,
      from: value,
    });
  }
}

export function onChangeTo(event: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) {
  const smsSendForm = getSmsSendFormViewModel();
  if (smsSendForm !== undefined) {
    setSmsSendFormViewModel({
      ...smsSendForm,
      to: data.value as string,
    });
  }
}

export function onChangeMessage(event: React.FormEvent<HTMLTextAreaElement>, data: TextAreaProps) {
  const smsSendForm = getSmsSendFormViewModel();
  if (smsSendForm !== undefined) {
    setSmsSendFormViewModel({
      ...smsSendForm,
      message: data.value as string,
    });
  }
}

export function onClickList() {
  const currentHistory = getCurrentHistory();
  currentHistory?.push(getSmsListPath());
}

export function onClickSendSms() {
  const userInfo = getSmsUserInfo();
  if (userInfo?.userAllowed) {
    const smsSendForm = getSmsSendFormViewModel();
    if (smsSendForm === undefined) {
      return;
    }
    const isValid = validateSmsSendForm(smsSendForm);
    if (isValid === true) {
      reactConfirm({
        title: 'SMS 발송',
        message: 'sms 발송 하시겠습니까?',
        onOk: () => onSendSms(smsSendForm),
      });
    }
  } else {
    reactAlert({
      title: '알림',
      message: 'SMS 발송 권한이 없으므로 Help Desk(02-6323-9002)로 문의 주시기 바랍니다',
    });
  }
}

export async function onSendSms(smsSendForm: SmsSendFormViewModel) {
  const sentSmsCdo = getSentSmsCdo(smsSendForm);
  const result = await registSentSms(sentSmsCdo);
  if (result !== undefined) {
    reactAlert({
      title: 'SMS 발송',
      message: 'SMS 발송 성공했습니다.',
    });
    const currentHistory = getCurrentHistory();
    currentHistory?.push(getSmsListPath());
  } else {
    reactAlert({
      title: 'SMS 발송',
      message: 'SMS 발송 실패했습니다. 잠시 후 다시 발송해 주세요.',
    });
  }
}
