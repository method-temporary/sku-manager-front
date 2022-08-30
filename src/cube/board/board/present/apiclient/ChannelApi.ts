import { axiosApi as axios, NameValueList } from '@nara.platform/accent';
import { IdName } from 'shared/model';
import { CollegeModel } from '../../model/CollegeModel';
import { ChannelModel } from '../../model/ChannelModel';

export default class ChannelApi {
  //
  URL = '/api/college';

  static instance: ChannelApi;

  // College 목록 조회 api(selectbox 용)
  // Method : get
  // param : {}
  // URL : /api/college/colleges
  getCollegeInfo() {
    return axios.get<CollegeModel[]>(this.URL + '/colleges').then((response) => (response && response.data) || null);
  }

  // CollegeId로 채널 리스트 호출
  // Method : get
  // paramKey : {collegeId}
  // URL : /api/college/colleges/{collegeId}/channels
  getChannelInfo(collegeId: string) {
    return axios
      .get<ChannelModel[]>(this.URL + `/colleges/${collegeId}/channels`)
      .then((response) => (response && response.data) || null);
  }

  // 채널 수정
  // Method : PUT
  // URL(공통) : api/college/channels/{channelId}
  // param : channelId(URL), nameValues(BODY)
  modifyChannel(channelId: string, nameValues: NameValueList) {
    return axios.put<void>(this.URL + `/channels/${channelId}`, nameValues);
  }

  // 채널 저장
  // Method : POST
  // URL : api/college/channels
  // param(BODY) : name, description, collegeId
  // RES : channelId(String)
  registerChannel(newChannel: any) {
    return axios
      .post<string>(this.URL + '/channels', newChannel)
      .then((response) => (response && response.data) || null);
  }

  // 컬리지 채널 순서저장
  // Method : PUT
  // URL : api/college/colleges/{collegeId}/channels
  // param : channelJson(BODY), collegeId(URL)
  orderSaveChannel(collegeId: string, idNames: IdName[]) {
    return axios.put<void>(this.URL + `/colleges/${collegeId}/channels`, idNames);
  }

  findChannelByChannelId(channelId: string) {
    //
    return axios.get<ChannelModel>(this.URL + `/${channelId}`).then((response) => (response && response.data) || null);
  }

  removeChannel(channelId: string, nameValues: NameValueList) {
    //
    return axios.put<void>(this.URL + `/${channelId}`, nameValues);
  }
}

Object.defineProperty(ChannelApi, 'instance', {
  value: new ChannelApi(),
  writable: false,
  configurable: false,
});
