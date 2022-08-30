import CardRdo, { getEmptyCardRdo } from '../../../_data/lecture/cards/model/CardRdo';

export const getInitCardApprovalRdo = (): CardRdo => {
  //
  return {
    ...getEmptyCardRdo(),
    cardState: ['Opened', 'OpenApproval', 'Rejected'],
  };
};
