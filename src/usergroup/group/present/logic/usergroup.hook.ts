import { queryKeys } from '../../../../query/queryKeys';
import { useQuery } from 'react-query';
import { findAllUserGroup } from '../../../../_data/user/userGroups/api/UserGroupApi';

export const useFindAllUserGroup = () => {
  //
  return useQuery(queryKeys.findAllUserGroupMap(), () => findAllUserGroup(), {
    refetchOnWindowFocus: false,
  });
};
