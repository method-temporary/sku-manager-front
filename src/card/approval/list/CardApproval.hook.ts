import CardRdo from '../../../_data/lecture/cards/model/CardRdo';
import { useQuery, UseQueryResult } from 'react-query';
import { OffsetElementList } from '../../../shared/model';
import CardWithContentsAndRelatedCount from '../../../_data/lecture/cards/model/CardWithContentsAndRelatedCount';
import { queryKeys } from '../../../query/queryKeys';
import { findCardByRdo, findCardCount } from '../../../_data/lecture/cards/api/CardApi';
import CardAdminCount from '../../../_data/lecture/cards/model/CardAdminCount';

/**
 * Card Approval List 목록
 * @param cardRdo
 */
export const useFindCardApprovalByRdo = (
  cardRdo: CardRdo
): UseQueryResult<OffsetElementList<CardWithContentsAndRelatedCount>> => {
  //
  return useQuery(queryKeys.findCardApprovalByRdo(cardRdo), () => findCardByRdo(cardRdo), {
    // cacheTime: 0,
    enabled: cardRdo.startDate !== 0 && cardRdo.endDate !== 0,
    refetchOnWindowFocus: false,
  });
};

/**
 * Card Approval List 갯수
 * @param cardRdo
 */
export const useFindCardApprovalCount = (cardRdo: CardRdo): UseQueryResult<CardAdminCount> => {
  //
  return useQuery(queryKeys.findCardAdminCount(cardRdo), () => findCardCount(cardRdo), {
    cacheTime: 0,
    enabled: cardRdo.startDate !== 0 && cardRdo.endDate !== 0,
  });
};
