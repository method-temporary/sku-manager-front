import { ProposalState as ProposalStateEnum } from 'student/model/vo/ProposalState';

export type ProposalState =
  | ''
  | 'Drafted'
  | 'Submitted'
  | 'Canceled'
  | 'Approved'
  | 'Rejected'
  | 'ConsentRequested'
  | 'ConsentAgreed'
  | 'CooperationRequested'
  | 'CooperationAccepted'
  | 'ObservationRequested'
  | 'ObservationAccepted';

export function parseProposalState(state: ProposalState): ProposalStateEnum {
  //
  if (state === '') {
    return ProposalStateEnum.DEFAULT;
  } else if (state === 'Drafted') {
    return ProposalStateEnum.Drafted;
  } else if (state === 'Submitted') {
    return ProposalStateEnum.Submitted;
  } else if (state === 'Canceled') {
    return ProposalStateEnum.Canceled;
  } else if (state === 'Approved') {
    return ProposalStateEnum.Approved;
  } else if (state === 'Rejected') {
    return ProposalStateEnum.Rejected;
  } else if (state === 'ConsentRequested') {
    return ProposalStateEnum.ConsentRequested;
  } else if (state === 'ConsentAgreed') {
    return ProposalStateEnum.ConsentAgreed;
  } else if (state === 'CooperationRequested') {
    return ProposalStateEnum.CooperationRequested;
  } else if (state === 'CooperationAccepted') {
    return ProposalStateEnum.CooperationAccepted;
  } else if (state === 'ObservationRequested') {
    return ProposalStateEnum.ObservationRequested;
  } else if (state === 'ObservationAccepted') {
    return ProposalStateEnum.ObservationAccepted;
  } else {
    return ProposalStateEnum.DEFAULT;
  }
}
