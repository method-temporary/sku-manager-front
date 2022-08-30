import { axiosApi as axios } from 'shared/axios/Axios';
import { CubeSdo } from '../../model/sdo/CubeSdo';
import { UserCubeAdminRdo } from '../../model/sdo/UserCubeAdminRdo';
import { OffsetElementList } from 'shared/model';
import { UserCubeWithIdentity } from '../../model/sdo/UserCubeWithIdentity';
import { UserCubeCounts } from '../../model/vo/UserCubeCounts';
import { UserCubeModel } from '../../model/UserCubeModel';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

class UserCubeApi {
  URL = '/api/cube/userCubes';

  static instance: UserCubeApi;

  registerUserCube(cubeSdo: CubeSdo): Promise<string> {
    //
    return axios.post(this.URL, cubeSdo).then((response) => (response && response.data) || '');
  }

  findUserCubeWithIdentitiesForAdmin(
    userCubeAdminRdo: UserCubeAdminRdo
  ): Promise<OffsetElementList<UserCubeWithIdentity>> {
    const apiUrl = this.URL + `/admin`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: userCubeAdminRdo,
      workType: 'Excel Download'
    })

    //
    return axios
      .getLoader(apiUrl, { params: userCubeAdminRdo })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  findUserCubeForAdmin(cubeId: string): Promise<UserCubeModel> {
    //
    return axios.get(this.URL + `/admin/${cubeId}`).then((response) => (response && response.data) || null);
  }

  modifyUserCube(cubeId: string, cubeSdo: CubeSdo): Promise<void> {
    //
    return axios.putLoader(this.URL + `/${cubeId}`, cubeSdo).then((response) => (response && response.data) || null);
  }

  requestOpenUserCube(cubeId: string): Promise<void> {
    //
    return axios
      .putLoader(this.URL + `/${cubeId}/requestOpenUserCube`)
      .then((response) => (response && response.data) || null);
  }

  openUserCubes(ids: string[]): Promise<void> {
    //
    return axios
      .putLoader(this.URL + `/admin/openUserCubesByIds?ids=${ids}`)
      .then((response) => (response && response.data) || null);
  }

  rejectUserCubes(ids: string[], remark: string): Promise<void> {
    //
    return axios
      .putLoader(this.URL + `/admin/rejectUserCubesByIds?ids=${ids}&remark=${remark}`)
      .then((response) => (response && response.data) || null);
  }

  countUserCubesForAdmin(userCubeAdminRdo: UserCubeAdminRdo): Promise<UserCubeCounts> {
    //
    return axios
      .get(this.URL + `/admin/counts`, { params: userCubeAdminRdo })
      .then((response) => (response && response.data) || null);
  }
}

UserCubeApi.instance = new UserCubeApi();
export default UserCubeApi;
