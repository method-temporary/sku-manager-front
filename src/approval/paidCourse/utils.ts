import { LearningStateType } from 'lecture/student/model/LearningState';
import { PaidCourseProposalState } from '_data/lecture/students/model/PaidCourseProposalState';
import { isEmpty } from 'lodash';

export function getApprovalName(proposalState?: PaidCourseProposalState) {
  if (!proposalState) {
    return '신청일자';
  }

  switch (proposalState) {
    case 'Approved':
      return '승인일자';
    case 'Rejected':
      return '반려일자';
    default:
      '신청일자';
  }
}

export function getStateName(proposalState?: PaidCourseProposalState) {
  switch (proposalState) {
    case 'Approved':
      return '승인';
    case 'Submitted':
      return '승인대기';
    case 'Canceled':
      return '취소';
    case 'Rejected':
      return '반려';
    default:
      return '';
  }
}

export function parseLearningState(proposalState?: PaidCourseProposalState, learningStateType?: LearningStateType) {
  if (proposalState === 'Approved' && isEmpty(learningStateType)) {
    return '학습예정';
  }

  if (proposalState === 'Approved') {
    switch (learningStateType) {
      case 'Progress':
        return '학습중';
      case 'Waiting':
        return '결과처리 대기';
      case 'Passed':
        return '이수';
      case 'Missed':
        return '미이수';
      case 'NoShow':
        return '불참';
      default:
        return '';
    }
  }

  return '';
}

export function getCardCompleteNumber(cardId: string, denizenId: string) {
  //
  return `${cardId.substring(cardId.indexOf('-') + 1)}-${
    denizenId === null || denizenId === '' || denizenId === undefined
      ? '퇴직'
      : denizenId.substring(0, denizenId.indexOf('@'))
  }`;
}
