import { CpHistoryQdo } from '../../../../_data/contentProvider/cpHistories/model/CpHistoryQdo';
import { useMutation, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { CpHistory } from '../../../../_data/contentProvider/cpHistories/model/CpHistory';
import { queryKeys } from '../../../../query/queryKeys';
import {
  findAllCpHistories,
  findCoursera,
  findCpHistoryById,
} from '../../../../_data/contentProvider/cpHistories/CpHistoriesApis';
import { OffsetElementList } from '../../../../shared/model';
import { CpQdo } from '../../../../_data/contentProvider/cpStudent/model/CpQdo';
import { modifyCourseraCpStudents } from '../../../../_data/contentProvider/cpStudent/CpStudentApis';
import { modifyCourseraCpContents } from '../../../../_data/contentProvider/cpContent/CpContentApis';

export const useFindAllCpHistories = (
  cpHistoryQdo: CpHistoryQdo
): UseQueryResult<OffsetElementList<CpHistory>, unknown> => {
  return useQuery(queryKeys.findAllCpHistories(cpHistoryQdo), () => findAllCpHistories(cpHistoryQdo));
};

export const useFindCoursera = (cpHistoryQdo: CpHistoryQdo): UseQueryResult<OffsetElementList<CpHistory>, unknown> => {
  return useQuery(queryKeys.findCoursera(cpHistoryQdo), () => findCoursera(cpHistoryQdo));
};

export const useFindCpHistoryById = (id: string): UseQueryResult<CpHistory, unknown> => {
  return useQuery(queryKeys.findCpHistoryById(id), () => findCpHistoryById(id));
};

export const useModifyCourseraCpStudents = () => {
  //
  const queryClient = useQueryClient();

  return useMutation(
    (cpQdo: CpQdo) => {
      return modifyCourseraCpStudents(cpQdo);
    },
    {
      onSuccess: async () => {
        //
      },
    }
  );
};

export const useModifyCourseraCpContents = () => {
  //
  const queryClient = useQueryClient();

  return useMutation(
    () => {
      return modifyCourseraCpContents();
    },
    {
      onSuccess: async () => {
        //
      },
    }
  );
};
