import { axiosApi as axios } from 'shared/axios/Axios';
import { NameValueList } from 'shared/model';
import { SubsidiaryModel } from '../../model/SubsidiaryModel';

class SubsidiaryApi {
  URL = '/api/college/subsidiaries';

  static instance: SubsidiaryApi;

  registerSubsidiary(subsidiary: SubsidiaryModel) {
    return axios.post<string>(this.URL, subsidiary).then((response) => (response && response.data) || null);
  }

  findSubsidiary(subsidiaryId: string) {
    //
    return axios
      .get<SubsidiaryModel>(this.URL + `/${subsidiaryId}`)
      .then((response) => (response && response.data) || null);
  }

  findAllSubsidiaries() {
    //
    return axios.get<SubsidiaryModel[]>(this.URL).then((response) => (response && response.data) || null);
  }

  findSubsidiariesByCineroomId() {
    //
    return axios
      .get<SubsidiaryModel[]>(this.URL + '/byCineroomId')
      .then((response) => (response && response.data) || null);
  }

  modifySubsidiary(subsidiaryId: string, nameValues: NameValueList) {
    //
    return axios.put<void>(this.URL + `${subsidiaryId}`, nameValues);
  }

  removeSubsidiary(subsidiaryId: string) {
    //
    return axios.delete(this.URL + `${subsidiaryId}`);
  }
}

SubsidiaryApi.instance = new SubsidiaryApi();
export default SubsidiaryApi;
