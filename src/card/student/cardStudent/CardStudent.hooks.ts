import { CardStudentQdo } from '../../../_data/lecture/students/model/CardStudentQdo';
import { useMutation, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { queryKeys } from '../../../query/queryKeys';
import {
  accept,
  deleteCardStudent,
  findCardStudentForAdmin,
  findCardStudentForExcelDownload,
  findStudentCount,
  modifyCardStudentRound,
  registerRelatedStudents,
  reject,
} from '../../../_data/lecture/students/api/studentApi';
import { OffsetElementList } from '../../../shared/model';
import { UseMutationResult } from 'react-query/types/react/types';
import StudentDeleteResultModel from '../../../student/model/StudentDeleteResultModel';
import CardStudentStore from './CardStudent.store';
import { StudentWithUserIdentity } from '_data/lecture/students/model/sdo/StudentWithUserIdentity';
import { CardRelatedStudentCdo } from '../../../_data/lecture/students/model/sdo/CardRelatedStudentCdo';
import { StudentAcceptOrRejectUdo } from '../../../_data/lecture/students/model/sdo/StudentAcceptOrRejectUdo';
import { StudentCountQdo } from '_data/lecture/students/model/sdo/StudentCountQdo';
import StudentCount from 'student/model/vo/StudentCount';
import { StudentModifyRoundUdo } from '../model/StudentModifyRoundUdo';

export const useFindCardStudentForAdminStudent = (
  params: CardStudentQdo
): UseQueryResult<OffsetElementList<StudentWithUserIdentity>> => {
  return useQuery(queryKeys.findCardStudentForAdmin_Student(params), () => findCardStudentForAdmin(params), {
    enabled: params.startTime > 0 && params.endTime > 0 && params.cardId !== '',
    refetchOnWindowFocus: false,
  });
};

export const useFindCardStudentForAdminStudentExcelDown = () => {
  return useMutation(
    (params: CardStudentQdo) => {
      return findCardStudentForExcelDownload(params);
    },
    {
      onSuccess: async () => {},
    }
  );

  // return useQuery(queryKeys.findCardStudentForAdmin_Student_ExcelDown(params), () => findCardStudentForAdmin(params), {
  //   cacheTime: 0,
  //   enabled: params.limit === 9999999 && params.cardId !== '',
  //   refetchOnWindowFocus: false,
  // });
};

export const useDeleteCardStudent = (): UseMutationResult<StudentDeleteResultModel[], unknown, string[], unknown> => {
  const queryClient = useQueryClient();

  return useMutation(
    (ids: string[]): Promise<StudentDeleteResultModel[]> => {
      return deleteCardStudent(ids);
    },
    {
      onSuccess: async (data) => {
        const { cardStudentParams, setDeletedCardStudentIds } = CardStudentStore.instance;

        await setDeletedCardStudentIds(data);
        queryClient.invalidateQueries(queryKeys.findCardStudentForAdmin_Student(cardStudentParams));
      },
    }
  );
};

export const useAccept = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (studentAcceptOrReject: StudentAcceptOrRejectUdo): Promise<void> => {
      return accept(studentAcceptOrReject);
    },
    {
      onSuccess: async () => {
        const { cardStudentParams, setCardStudentSelected } = CardStudentStore.instance;
        setCardStudentSelected([]);
        queryClient.invalidateQueries(queryKeys.findCardStudentForAdmin_Student(cardStudentParams));
      },
    }
  );
};

export const useReject = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (studentAcceptOrReject: StudentAcceptOrRejectUdo): Promise<void> => {
      return reject(studentAcceptOrReject);
    },
    {
      onSuccess: async () => {
        const { cardStudentParams, setCardStudentSelected } = CardStudentStore.instance;
        setCardStudentSelected([]);
        queryClient.invalidateQueries(queryKeys.findCardStudentForAdmin_Student(cardStudentParams));
      },
    }
  );
};

export const useFindStudentCount = (studentCountQdo: StudentCountQdo): UseQueryResult<StudentCount> => {
  return useQuery(queryKeys.findStudentCount(studentCountQdo), () => findStudentCount(studentCountQdo), {
    enabled: studentCountQdo.startTime > 0 && studentCountQdo.endTime > 0 && studentCountQdo.cardId !== '',
    refetchOnWindowFocus: false,
  });
};

export const useModifyCardStudentRound = () => {
  const queryClient = useQueryClient();

  return useMutation((cardStudentChangeRoundParams: StudentModifyRoundUdo): Promise<void> => {
    return modifyCardStudentRound(cardStudentChangeRoundParams);
  });
};

// export const useRegisterRelatedStudents = () => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     (cardRelatedStudentCdo: CardRelatedStudentCdo) => {
//       return registerRelatedStudents(cardRelatedStudentCdo);
//     },
//     {
//       onSuccess: async (data) => {
//         const { uploadFailedList, setUploadFailedList } = CardStudentStore.instance;
//         if (!data) {
//           setUploadFailedList([...uploadFailedList, cardRelated])
//         }
//       },
//     }
//   );
// };
