import { axiosApi as axios } from 'shared/axios/Axios';
import { OfficeWebModel } from '../../model/old/OfficeWebModel';

export default class OfficeWebApi {
  //
  URL = '/api/cube/officewebs';

  static instance: OfficeWebApi;

  registerOfficeWeb(officeWeb: OfficeWebModel) {
    //
    return axios.post<string>(this.URL, officeWeb).then((response) => (response && response.data) || null);
  }

  findOfficeWeb(OfficeWebId: string) {
    //
    return axios
      .get<OfficeWebModel>(this.URL + `/${OfficeWebId}`)
      .then((response) => (response && response.data && new OfficeWebModel(response.data)) || new OfficeWebModel());
  }
}

Object.defineProperty(OfficeWebApi, 'instance', {
  value: new OfficeWebApi(),
  writable: false,
  configurable: false,
});
