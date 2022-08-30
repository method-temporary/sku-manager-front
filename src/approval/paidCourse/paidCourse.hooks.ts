import { queryKeys } from 'query/queryKeys';
import { QueryClient, useQuery } from 'react-query';
import { findStudentApprovalsForAdmin } from '_data/lecture/students/api/studentApi';
import { PaidCourseQueryModel } from '_data/lecture/students/model/PaidCourseQueryModel';

export const useFindStudentApprovalsForAdmin = (params: PaidCourseQueryModel) => {
  return useQuery(queryKeys.findStudentApprovalsForAdmin(params), () => findStudentApprovalsForAdmin(params), {
    keepPreviousData: true,
    staleTime: 60000,
  });
};

export const preFetchFindStudentApprovalsForAdmin = (queryClient: QueryClient, params: PaidCourseQueryModel) => {
  queryClient.prefetchQuery(queryKeys.findStudentApprovalsForAdmin(params), () => findStudentApprovalsForAdmin(params));
};
