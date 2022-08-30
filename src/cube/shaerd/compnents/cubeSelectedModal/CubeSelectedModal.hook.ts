import { useQuery } from 'react-query';
import { findCubeByRdo } from '_data/cube/api/cubeApis';

import { queryKeys } from '../../../../query/queryKeys';
import { CubeAdminRdo } from '../../../cube';

export const useFindCubeByRdoForModal = (cubeAdminRdo: CubeAdminRdo) => {
  //
  return useQuery(queryKeys.findCubeByRdo(cubeAdminRdo), () => findCubeByRdo(cubeAdminRdo), {
    enabled: cubeAdminRdo.startDate !== 0 && cubeAdminRdo.endDate !== 0,
  });
};
