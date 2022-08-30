import { useQuery, UseQueryResult } from 'react-query';

import { GroupBasedAccessRule, OffsetElementList } from 'shared/model';
import { queryKeys } from 'query/queryKeys';

import CardRdo from '_data/lecture/cards/model/CardRdo';
import { findByRdoForModal, findCardByRdoIgnoreAccessRule } from '_data/lecture/cards/api/CardApi';
import { CardWithAccessRuleResult } from '_data/lecture/cards/model/CardWithAccessRuleResult';

export const useFindCardByRdoForModal = (
  cardRdo: CardRdo,
  groupAccessRoles: GroupBasedAccessRule
): UseQueryResult<OffsetElementList<CardWithAccessRuleResult>> => {
  //
  return useQuery(
    queryKeys.findCardByRdoForModal(cardRdo, groupAccessRoles),
    () => findByRdoForModal(cardRdo, groupAccessRoles),
    {
      enabled: cardRdo.startDate !== 0 && cardRdo.endDate !== 0,
    }
  );
};

export const useFindCardByRdoIgnoreAccessRule = (
  cardRdo: CardRdo,
  groupAccessRoles: GroupBasedAccessRule
): UseQueryResult<OffsetElementList<CardWithAccessRuleResult>> => {
  //
  return useQuery(
    queryKeys.findCardByRdoIgnoreAccessRule(cardRdo, groupAccessRoles),
    () => findCardByRdoIgnoreAccessRule(cardRdo, groupAccessRoles),
    {
      enabled: cardRdo.startDate !== 0 && cardRdo.endDate !== 0,
    }
  );
};
