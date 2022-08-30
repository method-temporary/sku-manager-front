import { axiosApi as axios } from 'shared/axios/Axios';
import UserWorkspaceModel from '../../model/UserWorkspaceModel';
import UserWorkspaceRdo from '../../model/dto/UserWorkspaceRdo';
import { NameValueList, OffsetElementList } from 'shared/model';

class UserWorkspaceApi {
  //
  userWorkspaceURL = '/api/user/userWorkspaces/admin';

  static instance: UserWorkspaceApi;

  findParentUserWorkspaces(): Promise<UserWorkspaceModel[]> {
    //
    return axios.get(this.userWorkspaceURL + `/parent`).then((response) => (response && response.data) || []);
  }

  findUserWorkspacesByRdo(userWorkspaceRdo: UserWorkspaceRdo): Promise<OffsetElementList<UserWorkspaceModel>> {
    //
    return axios
      .getLoader(this.userWorkspaceURL, { params: userWorkspaceRdo })
      .then((response) => OffsetElementList.fromResponse(response.data));
  }

  findAllWorkspace(): Promise<UserWorkspaceModel[]> {
    //
    return axios.get(this.userWorkspaceURL + `/all`).then((response) => (response && response.data) || null);
  }

  findUserWorkspaceById(id: string): Promise<UserWorkspaceModel> {
    //
    return axios.get(this.userWorkspaceURL + `/${id}`).then((response) => (response && response.data) || null);
  }

  findUserWorkspacesByParentId(parentId: string): Promise<UserWorkspaceModel[]> {
    //
    return axios
      .get(this.userWorkspaceURL + `/byParentId?parentId=${parentId}`)
      .then((response) => (response && response.data) || null);
  }

  modifyUserWorkspace(id: string, nameValues: NameValueList): Promise<void> {
    //
    return axios
      .putLoader(this.userWorkspaceURL + `/${id}`, nameValues)
      .then((response) => (response && response.data) || null);
  }

  activeUserWorkspaces(ids: string[]): Promise<void> {
    //
    return axios
      .putLoader(this.userWorkspaceURL + `/active`, ids)
      .then((response) => (response && response.data) || null);
  }

  dormantUserWorkspaces(ids: string[]): Promise<void> {
    //
    return axios
      .putLoader(this.userWorkspaceURL + `/dormant`, ids)
      .then((response) => (response && response.data) || null);
  }
}

UserWorkspaceApi.instance = new UserWorkspaceApi();
export default UserWorkspaceApi;
