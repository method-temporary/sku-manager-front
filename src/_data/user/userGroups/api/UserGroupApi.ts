import { OffsetElementList } from '../../../../shared/model';
import { UserGroupQueryModel } from '../../../../usergroup/group/model';
import { axiosApi as axios } from '../../../../shared/axios/Axios';
import { AxiosReturn } from '../../../../shared/present';

const URL = '/api/user/userGroups';

/** UserGroup 목록 전체 조회 api  ( 모든 UserGroup )
 * @Method GET
 * @Param(QUERY) {offset}, {limit}
 * @USE SkProfile List
 */
export const findAllUserGroup = (): Promise<OffsetElementList<UserGroupQueryModel>> => {
  //
  return axios.get(`${URL}?offset=0&limit=9999999`).then(AxiosReturn);
};
