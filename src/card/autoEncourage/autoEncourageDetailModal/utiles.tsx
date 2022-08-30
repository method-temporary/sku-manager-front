import { LearningStateType } from 'lecture/student/model/LearningState';
import { EmailFormat } from '_data/lecture/autoEncourage/model/EmailFormat';
import { SmsFormat } from '_data/lecture/autoEncourage/model/SmsFormat';
import { Target } from '_data/lecture/autoEncourage/model/Target';

export const parseLeaningState = (learningState: LearningStateType) => {
  switch (learningState) {
    case 'Progress':
      return '결과처리 대기자';
    case 'Missed':
      return '미이수자';
    case 'NoShow':
      return '불참자';
    case 'Passed':
      return '이수자';
    default:
      return '전체';
  }
};

export const parseTarget = (target: Target) => {
  const targetArray = [];

  if (target.reportNotPassed) {
    targetArray.push('Survey 미제출자');
  }
  if (target.testNotPassed) {
    targetArray.push('Report 미제출/불합격자');
  }
  if (target.testNotPassed) {
    targetArray.push('Test 미제출/불합격자');
  }

  return targetArray.join(',');
};

export const getSendingMedia = (emailFormat?: EmailFormat, smsFormat?: SmsFormat) => {
  const array = [];

  if (emailFormat?.title) {
    array.push('E-mail');
  }
  if (smsFormat?.operatorName) {
    array.push('SMS');
  }

  return array.join(', ');
};
