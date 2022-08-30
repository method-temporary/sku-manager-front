import { axiosApi as axios } from '@nara.platform/accent';
import { OffsetElementList } from 'shared/model';
import { UserIdentityModel } from 'cube/user/model/UserIdentityModel';
import { ResultMailModel } from '../../model/ResultMailModel';
import { ResultMailDetailModel } from '../../model/ResultMailDetailModel';
import { ResultMailRdoModel } from '../../model/ResultMailRdoModel';

export default class MailApi {
  //
  URL = '/api/pigeon/mailSend';
  USER_URL = '/api/user';
  static instance: MailApi;

  findAllResultMail(resultMailRdo: ResultMailRdoModel) {
    //
    return axios
      .get<OffsetElementList<ResultMailModel>>(this.URL, {
        params: resultMailRdo,
      })
      .then(
        (response: any) =>
          (response && response.data && new OffsetElementList<ResultMailModel>(response.data)) ||
          new OffsetElementList()
      );
  }

  // paging
  findResultMailPage(sendId: string) {
    //
    return axios
      .get<OffsetElementList<ResultMailDetailModel>>(this.URL + `/${sendId}`)
      .then(
        (response: any) =>
          (response && response.data && new OffsetElementList<ResultMailDetailModel>(response.data)) ||
          new OffsetElementList()
      );
  }

  findResultMail(sendId: string) {
    //
    return axios.get(this.URL + `/detail/${sendId}`).then((response: any) => response && response.data);
  }

  findUsersByEmails(emails: string[]) {
    //
    return axios
      .post(this.USER_URL + `/users/admin/userByEmail`, { emails })
      .then((response: any) => response && response.data);
  }

  findUsersByDenizenIds(ids: string[]) {
    return axios
      .post<UserIdentityModel[]>(this.USER_URL + `/users/byDenizenIds`, ids)
      .then((response: any) => (response && response.data) || []);
  }
}

Object.defineProperty(MailApi, 'instance', {
  value: new MailApi(),
  writable: false,
  configurable: false,
});
