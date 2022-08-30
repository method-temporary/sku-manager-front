import { axiosApi as axios } from 'shared/axios/Axios';

export default class OfficeWebFlowApi {
  //
  URL = '/api/cube/officewebs/flow';

  static instance: OfficeWebFlowApi;

  // makeOfficeWeb(officeWeb: OfficeWebFlowCdoModel) {
  //   //
  //   return axios.post<string>(this.URL, officeWeb).then((response) => (response && response.data) || null);
  // }
  //
  // makeOfficeWebByUser(officeWebFlowUserCdo: OfficeWebFlowUserCdo) {
  //   //
  //   return axios.post<void>(this.URL + '/byUser', officeWebFlowUserCdo);
  // }
  //
  // modSuperOfficeWeb(cubeId: string, officeWebFlowUdoModel: OfficeWebFlowUdoModel) {
  //   return axios.put<void>(this.URL + `/approved/${cubeId}`, officeWebFlowUdoModel);
  // }
  //
  // modifyOfficeWeb(cubeId: string, officeWebFlowUdoModel: OfficeWebFlowUdoModel) {
  //   //
  //   return axios.put<void>(this.URL + `/${cubeId}`, officeWebFlowUdoModel);
  // }

  removeOfficeWeb(cubeId: string) {
    //
    return axios.delete(this.URL + `/${cubeId}`);
  }
}

Object.defineProperty(OfficeWebFlowApi, 'instance', {
  value: new OfficeWebFlowApi(),
  writable: false,
  configurable: false,
});
