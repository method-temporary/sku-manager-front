import { axiosApi as axios } from 'shared/axios/Axios';
import { MemberTempCdoModel } from '../model/MemberTempCdoModel';
import { MemberTempModel } from '../model/MemberTempModel';

export default class MemberTempProcApi {
  URL: string = '/api/community/communities';

  static instance: MemberTempProcApi;

  // findLearningCompleteProcById(memberTempId: string) {
  //   //
  //   return axios.get<MemberTempModel>(this.URL + `/byLearningCompleteProcId=${memberTempId}`)
  //     .then(response => response && response.data || null);
  // }

  registerMemberTempComplete(communityId: string, memberTempCdoList: MemberTempCdoModel[]) {
    //.put<string>(`${BASE_URL}/${communityId}/members/${memberIdList.join(',')}`)
    return axios
      .post<MemberTempModel[]>(
        this.URL + `/${communityId}/members/flow/registerMemberTempComplete`,
        memberTempCdoList
        //this.URL + `/${communityId}/members/${memberIdList.join(',')}`
      )
      .then((response) => (response && response.data) || null);
  }
}

Object.defineProperty(MemberTempProcApi, 'instance', {
  value: new MemberTempProcApi(),
  writable: false,
  configurable: false,
});
