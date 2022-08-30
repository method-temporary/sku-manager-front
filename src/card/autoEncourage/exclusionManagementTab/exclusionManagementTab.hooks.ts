import { useQuery, useQueryClient, useMutation } from 'react-query';
import { queryKeys } from 'query/queryKeys';
import {
  findAutoEncourageExcludedStudent,
  registerAutoEncourageExcludeStudent,
  removeAutoEncourageExcludeStudent,
  uploadByExcel,
} from '_data/lecture/autoEncourageExcludedStudents/api/autoEncourageExcludedStudents';
import { AutoEncourageExcludedStudentParams } from '_data/lecture/autoEncourageExcludedStudents/model/AutoEncourageExcludedStudentParams';
import { AutoEncourageExcludedStudentCdo } from '_data/lecture/autoEncourageExcludedStudents/model/AutoEncourageExcludedStudentCdo';
import ExclusionManagementTabStore from './exclusionManagementTab.store';
import { reactAlert } from '@nara.platform/accent';

export const useFindAutoEncourageExcludedStudent = (params: AutoEncourageExcludedStudentParams) => {
  return useQuery(queryKeys.findAutoEncourageExcludedStudent(params), () => findAutoEncourageExcludedStudent(params));
};

export const useRegisterAutoEncourageExcludeStudent = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ cardId, emailFormat }: { cardId: string; emailFormat: string }) => {
      return registerAutoEncourageExcludeStudent(cardId, emailFormat);
    },
    {
      onSuccess: () => {
        const params = ExclusionManagementTabStore.instance.autoEncourageExcludedStudentParams;

        queryClient.invalidateQueries(queryKeys.findAutoEncourageExcludedStudent(params));
      },
    }
  );
};

export const useRemoveAutoEncourageExcludeStudent = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (ids: string[]) => {
      return removeAutoEncourageExcludeStudent(ids);
    },
    {
      onSuccess: () => {
        const params = ExclusionManagementTabStore.instance.autoEncourageExcludedStudentParams;

        queryClient.invalidateQueries(queryKeys.findAutoEncourageExcludedStudent(params));
      },
    }
  );
};

export const useUploadByExcel = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (autoEncourageExcludedStudentCdo: AutoEncourageExcludedStudentCdo[]) => {
      return uploadByExcel(autoEncourageExcludedStudentCdo);
    },
    {
      onSuccess: () => {
        const params = ExclusionManagementTabStore.instance.autoEncourageExcludedStudentParams;
        queryClient.invalidateQueries(queryKeys.findAutoEncourageExcludedStudent(params));

        reactAlert({
          title: '자동독려 제외대상 추가',
          message: '일괄 등록이 성공적으로 업로드되었습니다.',
        });
      },
      onError: () => {
        reactAlert({
          title: '자동독려 제외대상 추가',
          message: '일괄 등록이 실패했습니다.엑셀 파일을 다시 확인해주세요.',
        });
      },
    }
  );
};
