import { reactAlert } from '@nara.platform/accent';
import { isPhoneNumber } from 'shared/helper';

export interface SmsSendFormViewModel {
  from: string;
  to: string;
  message: string;
}

export function initSmsSendFormViewModel(): SmsSendFormViewModel {
  return {
    from: '',
    to: '',
    message: '',
  };
}

export function validateSmsSendForm(smsSendForm: SmsSendFormViewModel): boolean {
  let isValid = true;

  const emptyField = getEmptyField(smsSendForm);
  if (emptyField !== '') {
    reactAlert({
      title: '필수 항목',
      message: `${emptyField}는 필수로 입력해야 합니다.`,
    });
    isValid = false;
    return isValid;
  }

  const to: string[] = smsSendForm.to.split('\n').filter((t) => t !== '');
  to.forEach((t) => {
    if (!isPhoneNumber(t)) {
      isValid = false;
      reactAlert({
        title: '필수 양식',
        message: '잘못된 휴대폰 번호를 입력했습니다.',
      });
    }
  });

  return isValid;
}

export function getEmptyField(smsSendForm: SmsSendFormViewModel): string {
  if (smsSendForm.to === undefined || smsSendForm.to === '') {
    return '수신자';
  }
  if (smsSendForm.message === undefined || smsSendForm.message === '') {
    return '내용';
  }
  if (smsSendForm.from === undefined || smsSendForm.from === '') {
    return '발신자';
  }
  return '';
}
