import { CardService } from 'card';
import { cineroomIdFromUrl, getDisplayName } from 'lib/common';
import { learningManagementUrl } from 'Routes';
import { AutoEncourageSdo } from '_data/lecture/autoEncourage/model/AutoEncourageSdo';
import { EmailFormat } from '_data/lecture/autoEncourage/model/EmailFormat';
import { SmsFormat } from '_data/lecture/autoEncourage/model/SmsFormat';
import { EnrollmentCard } from '_data/lecture/cards/model/EnrollmentCard';
import AutoEncourageStore from './autoEncourage.store';
import { AutoEncourageForm } from './autoEncourageFormModal/AutoEncourageFormModal';

export function cardListUrl() {
  return `/cineroom/${cineroomIdFromUrl()}/${learningManagementUrl}/cards/card-list`;
}

export const getAutoEncourageSdo = (formData: AutoEncourageForm): AutoEncourageSdo => {
  const {
    encourageTitle,
    encourageIsUse,
    scheduledSendTime,
    encourageTarget,
    emailFormat,
    sendMediaUseEmail,
    sendMediaUseSMS,
    smsFormat,
    round,
  } = formData;

  return {
    cardId: AutoEncourageStore.instance.cardId,
    title: encourageTitle,
    scheduledSendTime: encourageIsUse ? scheduledSendTime : undefined,
    target: encourageTarget || {},
    emailFormat: sendMediaUseEmail
      ? {
          ...emailFormat,
          usingTemplate: true,
          operatorEmail: 'mysuni@sk.com',
          operatorName: getDisplayName(),
          subject: '',
        }
      : ({} as EmailFormat),
    smsFormat: sendMediaUseSMS ? smsFormat : ({} as SmsFormat),
    round,
  };
};

export const countRound = (enrollmentCards?: EnrollmentCard[]) => {
  const roundList: {
    key: number;
    text: string;
    value: number;
  }[] = [];

  if (enrollmentCards) {
    enrollmentCards.forEach((enrollmentCard) => {
      roundList.push({ key: enrollmentCard.round, text: `${enrollmentCard.round}차수`, value: enrollmentCard.round });
    });
  }

  return roundList;
};
