import { findAllUserWorkSpaces } from '../_data/user/useWorkspaces/api/UserWorkSapcesApi';
import { useQuery } from 'react-query';
import { queryKeys } from '../query/queryKeys';

export const useFindAllUserWorkSpaces = () => {
  //
  return useQuery(queryKeys.findAllUserWorkSpaces, findAllUserWorkSpaces, {
    refetchOnWindowFocus: false,
  });
};
