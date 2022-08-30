import { CardStudentQdo } from '../../../_data/lecture/students/model/CardStudentQdo';
import { useMutation, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { OffsetElementList } from '../../../shared/model';
import { queryKeys } from '../../../query/queryKeys';
import {
  findCardStudentForAdmin,
  findCardStudentForExcelDownload,
  findStudentCount,
  modifyStudentsState,
} from '../../../_data/lecture/students/api/studentApi';
import { StudentLearningStateUdo } from '_data/lecture/students/model/sdo/StudentLearningStateUdo';
import CardStudentResultStore from './CardStudentResult.store';
import StudentCount from '../../../student/model/vo/StudentCount';
import { StudentCountQdo } from '../../../_data/lecture/students/model/sdo/StudentCountQdo';
import { StudentWithUserIdentity } from '_data/lecture/students/model/sdo/StudentWithUserIdentity';

export const useFindCardStudentForAdminResult = (
  params: CardStudentQdo
): UseQueryResult<OffsetElementList<StudentWithUserIdentity>> => {
  return useQuery(queryKeys.findCardStudentForAdmin_Result(params), () => findCardStudentForAdmin(params), {
    staleTime: 0,
    cacheTime: 0,
    enabled: params.startTime > 0 && params.endTime > 0 && params.cardId !== '',
    refetchOnWindowFocus: false,
  });
};

export const useFindCardStudentResultForAdminResultExcelDown = () => {
  return useMutation(
    (params: CardStudentQdo) => {
      return findCardStudentForExcelDownload(params);
    },
    {
      onSuccess: async () => {},
    }
  );
  // return useQuery(queryKeys.findCardStudentForAdmin_Result_ExcelDown(params), () => findCardStudentForAdmin(params), {
  //   cacheTime: 0,
  //   enabled: params.limit === 9999999 && params.cardId !== '',
  //   refetchOnWindowFocus: false,
  // });
};

export const useFindStudentCount = (studentCountQdo: StudentCountQdo): UseQueryResult<StudentCount> => {
  return useQuery(queryKeys.findStudentCount(studentCountQdo), () => findStudentCount(studentCountQdo), {
    enabled: studentCountQdo.startTime > 0 && studentCountQdo.endTime > 0 && studentCountQdo.cardId !== '',
    refetchOnWindowFocus: false,
  });
};

export const useModifyStudentsState = () => {
  //
  const queryClient = useQueryClient();

  return useMutation(
    (studentLearningStateUdo: StudentLearningStateUdo) => {
      return modifyStudentsState(studentLearningStateUdo);
    },
    {
      onSuccess: () => {
        const { cardStudentResultParams, setCardStudentSelected } = CardStudentResultStore.instance;
        queryClient.invalidateQueries(queryKeys.findCardStudentForAdmin_Result(cardStudentResultParams));
        setCardStudentSelected([]);
      },
    }
  );
};
