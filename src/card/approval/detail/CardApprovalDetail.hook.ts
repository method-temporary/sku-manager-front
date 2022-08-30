import { useMutation } from 'react-query';
import { openedCard, rejectedCard } from '../../../_data/lecture/cards/api/CardApi';
import { NameValueList } from '../../../shared/model';

export const useOpenedCard = () => {
  //
  return useMutation((cardId: string) => {
    return openedCard(cardId);
  });
};

export const useRejectedCard = () => {
  //
  return useMutation(({ cardId, nameValues }: { cardId: string; nameValues: NameValueList }) => {
    return rejectedCard(cardId, nameValues);
  });
};
