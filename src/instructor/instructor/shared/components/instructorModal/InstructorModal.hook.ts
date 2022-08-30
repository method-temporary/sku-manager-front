import { useQuery, UseQueryResult } from 'react-query';

import { OffsetElementList } from 'shared/model';

import { queryKeys } from 'query/queryKeys';

import { findInstructors } from '_data/user/instructors/api/instructorApi';
import { InstructorSdo } from '_data/user/instructors/model/InstructorSdo';
import { InstructorDetailRdo } from '_data/user/instructors/model/InstructorDetailRdo';

export const useFindInstructors = (
  instructorSdo: InstructorSdo
): UseQueryResult<OffsetElementList<InstructorDetailRdo>> => {
  //
  return useQuery(queryKeys.findInstructors(instructorSdo), () => findInstructors(instructorSdo), {
    enabled: instructorSdo.limit === 10,
  });
};
