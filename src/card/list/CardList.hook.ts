import { useMutation, useQuery, UseQueryResult } from 'react-query';
import { OffsetElementList } from 'shared/model';
import CardRdo from '_data/lecture/cards/model/CardRdo';
import CardAdminCount from '_data/lecture/cards/model/CardAdminCount';
import { CardPolyglotUdo } from '_data/lecture/cards/model/CardPolyglotUdo';
import { findCardById, findCardByRdo, findCardCount, modifyPolyglotsForAdmin } from '_data/lecture/cards/api/CardApi';
import CardWithContentsAndRelatedCount from '_data/lecture/cards/model/CardWithContentsAndRelatedCount';
import { queryKeys } from '../../query/queryKeys';
import CardListStore from './CardList.store';

/**
 * Card List 목록
 * @param cardRdo
 */
export const useFindCardRdo = (
  cardRdo: CardRdo
): UseQueryResult<OffsetElementList<CardWithContentsAndRelatedCount>> => {
  //
  return useQuery(queryKeys.findCardByRdo(cardRdo), () => findCardByRdo(cardRdo), {
    // cacheTime: 0,
    enabled: cardRdo.startDate !== 0 && cardRdo.endDate !== 0,
  });
};

/**
 * Card List 갯수
 * @param cardRdo
 */
export const useFindCardAdminCount = (cardRdo: CardRdo): UseQueryResult<CardAdminCount> => {
  //
  return useQuery(queryKeys.findCardAdminCount(cardRdo), () => findCardCount(cardRdo), {
    cacheTime: 0,
    enabled: cardRdo.startDate !== 0 && cardRdo.endDate !== 0,
  });
};

/**
 * Card List Excel Down 목록
 */
export const useFindCardRdoForExcel = () => {
  //
  return useMutation((cardRdo: CardRdo) => findCardByRdo(cardRdo));

  // cacheTime: 0,
  //   refetchOnWindowFocus: false,
  //   enabled: cardRdo.limit === 99999999,
};

/**
 * Card List 다국어 Excel Upload
 */
export const useModifyPolyglotsForAdmin = () => {
  //
  const { mutateCount, cardPolyglotUdos, addFailedIds, addMutateCount, setLoadingText } = CardListStore.instance;

  return useMutation(
    (cardPolyglotUdo: CardPolyglotUdo) => {
      return modifyPolyglotsForAdmin(cardPolyglotUdo);
    },
    {
      onMutate: () => {
        //
        addMutateCount();
        setLoadingText(`일괄 변경 중(${mutateCount}/${cardPolyglotUdos.length})`);
      },
      onError: (error, variables) => {
        //
        addFailedIds(variables.cardId);
      },
      onSettled: () => {
        //
        mutateCount === cardPolyglotUdos.length && setLoadingText('Loading...');
      },
    }
  );
};

/**
 * Card 단일 검색
 */
export const useFindCardByIdMutation = () => {
  //
  return useMutation((cardId: string) => {
    return findCardById(cardId);
  });
};

/**
 * Card 단일 검색
 */
export const useFindCardById = (cardId: string): UseQueryResult<CardWithContentsAndRelatedCount> => {
  //
  return useQuery(queryKeys.findCardById(cardId), () => findCardById(cardId), {
    enabled: cardId !== '' && cardId !== undefined,
    // enabled: cardId !== '',
    refetchOnWindowFocus: false,
  });
};
