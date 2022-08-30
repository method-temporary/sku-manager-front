import { AutoEncourageForm } from './AutoEncourageFormModal';
import { reactAlert } from '@nara.platform/accent';
import { FieldErrors } from 'react-hook-form';

const autoEncourageFormErrorAlert = (title: string, message?: string) => {
  if (message !== undefined) {
    reactAlert({
      title: '자동독려 신규 등록',
      message,
    });
  }
};

export const autoEncourageValidation = (errors: FieldErrors<AutoEncourageForm>, type: 'register' | 'modify') => {
  const { encourageTitle, scheduledSendTime, sendMediaUseEmail, sendMediaUseSMS, emailFormat, smsFormat, round } =
    errors;

  const alertTitle = type === 'register' ? '자동독려 신규 등록' : '자동 독려 수정';
  let alertMessage: string | undefined = '';

  if (encourageTitle) {
    alertMessage = encourageTitle?.message;
  } else if (scheduledSendTime) {
    alertMessage = scheduledSendTime?.message;
  } else if (round) {
    alertMessage = round?.message;
  } else if (sendMediaUseEmail) {
    alertMessage = sendMediaUseEmail.message;
  } else if (sendMediaUseSMS) {
    alertMessage = sendMediaUseSMS.message;
  } else if (emailFormat?.title) {
    alertMessage = emailFormat.title.message;
  } else if (emailFormat?.mailContents) {
    alertMessage = emailFormat.mailContents.message;
  } else if (smsFormat?.operatorName) {
    alertMessage = smsFormat?.operatorName.message;
  } else if (smsFormat?.operatorPhone) {
    alertMessage = smsFormat?.operatorPhone.message;
  } else if (smsFormat?.smsContents) {
    alertMessage = smsFormat?.smsContents?.message;
  }

  autoEncourageFormErrorAlert(alertTitle, alertMessage);
};
