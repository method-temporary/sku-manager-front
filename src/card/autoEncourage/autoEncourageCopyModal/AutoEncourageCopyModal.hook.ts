import { queryKeys } from 'query/queryKeys';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { copyAutoEncouragesByCardIds } from '_data/lecture/autoEncourage/api/autoEncourageApi';
import { CopyAutoEncourageCdo } from '_data/lecture/autoEncourage/model/CopyAutoEncourageCdo';
import { findAutoEncourageCards } from '_data/lecture/cards/api/findAutoEncourageCards';
import { AutoEncourageCardParams } from '_data/lecture/cards/model/AutoEncourageCardParams';
import HistoryTabStore from '../historyTab/historyTab.store';

export const useCopyAutoEncouragesByCardIds = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (copyAutoEncourageCdo: CopyAutoEncourageCdo) => {
      return copyAutoEncouragesByCardIds(copyAutoEncourageCdo);
    },
    {
      onSuccess: () => {
        const { autoEncourageParams, initHistoryTabState } = HistoryTabStore.instance;
        initHistoryTabState();
        queryClient.invalidateQueries(queryKeys.findAutoEncourageQdo(autoEncourageParams));
      },
    }
  );
};

export const useFindAutoEncourage = (autoEncourageCardParams: AutoEncourageCardParams) => {
  return useQuery(
    queryKeys.findAutoEncourageCards(autoEncourageCardParams),
    () => findAutoEncourageCards(autoEncourageCardParams)
    // {
    //   enabled: false,
    // }
  );
};
