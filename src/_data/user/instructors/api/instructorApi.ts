import { axiosApi as axios } from 'shared/axios/Axios';

import { OffsetElementList } from 'shared/model';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';
import { AxiosReturn } from 'shared/present';

import { InstructorSdo } from '../model/InstructorSdo';
import { InstructorDetailRdo } from '../model/InstructorDetailRdo';
import { InstructorWithUserRdo } from '../model/InstructorWithUserRdo';
import qs from 'qs';

const ADMIN_URL = '/api/user/admin';

/**
 * 강사 목록 호출
 * @param instructorSdo
 */
export const findInstructors = (instructorSdo: InstructorSdo): Promise<OffsetElementList<InstructorDetailRdo>> => {
  const apiUrl = `${ADMIN_URL}/instructors`;

  setExcelHistoryParams({
    searchUrl: apiUrl,
    searchParam: instructorSdo,
    workType: 'Excel Download',
  });

  return axios.get(apiUrl, { params: instructorSdo }).then(AxiosReturn);
};

export const findInstructorsByIds = (ids: string[]): Promise<InstructorWithUserRdo[]> => {
  return axios
    .get(`${ADMIN_URL}/instructors/byIds`, {
      params: { instructorIds: ids },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    })
    .then(AxiosReturn);
};
