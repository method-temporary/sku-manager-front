import { axiosApi as axios } from 'shared/axios/Axios';
import { GroupMemberTempCdoModel } from '../model/GroupMemberTempCdoModel';
import { GroupMemberTempModel } from '../model/GroupMemberTempModel';

export default class GroupMemberTempProcApi {
  URL: string = '/api/community';

  static instance: GroupMemberTempProcApi;

  // findLearningCompleteProcById(groupMemberTempId: string) {
  //   //
  //   return axios.get<GroupMemberTempModel>(this.URL + `/byLearningCompleteProcId=${groupMemberTempId}`)
  //     .then(response => response && response.data || null);
  // }

  registerGroupMemberTempComplete(communityId: string, groupMemberTempCdoList: GroupMemberTempCdoModel[]) {
    //.put<string>(`${BASE_URL}/${communityId}/groupMembers/${groupMemberIdList.join(',')}`)
    return axios
      .post<GroupMemberTempModel[]>(
        this.URL + `/${communityId}/groupMembers/flow/registerGroupMemberTempComplete`,
        groupMemberTempCdoList
        //this.URL + `/${communityId}/groupMembers/${groupMemberIdList.join(',')}`
      )
      .then((response) => (response && response.data) || null);
  }
}

Object.defineProperty(GroupMemberTempProcApi, 'instance', {
  value: new GroupMemberTempProcApi(),
  writable: false,
  configurable: false,
});
