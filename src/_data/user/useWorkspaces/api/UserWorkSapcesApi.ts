import { axiosApi as axios } from 'shared/axios/Axios';
import { AxiosReturn } from 'shared/present';

import { UserWorkSpace } from '../model/UserWorkSpace';

const ADMIN_URL = '/api/user/userWorkspaces/admin';

/**
 * WorkSpace 목록 전부 가져오기
 */
export function findAllUserWorkSpaces(): Promise<UserWorkSpace[]> {
  //
  return axios.get(`${ADMIN_URL}/all`).then(AxiosReturn);
}
