import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  registerAutoEncourage,
  modifyAutoEncourage,
  findAutoEncourageQdo,
  deleteAutoEncourageIds,
} from '../../../_data/lecture/autoEncourage/api/autoEncourageApi';
import { AutoEncourageSdo } from '_data/lecture/autoEncourage/model/AutoEncourageSdo';
import { AutoEncourageParams } from '_data/lecture/autoEncourage/model/AutoEncourageQdo';
import { queryKeys } from 'query/queryKeys';

export const useFindAutoEncourageQdo = (autoEncourageParams: AutoEncourageParams) => {
  return useQuery(
    queryKeys.findAutoEncourageQdo(autoEncourageParams),
    () => findAutoEncourageQdo(autoEncourageParams),
    {
      enabled: autoEncourageParams.cardId !== '',
    }
  );
};

export const useRegisterAutoEncourage = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (autoEncourageSdo: AutoEncourageSdo) => {
      return registerAutoEncourage(autoEncourageSdo);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('findAutoEncourageQdo');
      },
    }
  );
};

export const useModifyAutoEncourage = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    (autoEncourageSdo: AutoEncourageSdo) => {
      return modifyAutoEncourage(id, autoEncourageSdo);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('findAutoEncourageQdo');
      },
    }
  );
};

export const useDeleteAutoEncourageIds = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (ids: string[]) => {
      return deleteAutoEncourageIds(ids);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('findAutoEncourageQdo');
      },
      onError: () => {},
    }
  );
};
