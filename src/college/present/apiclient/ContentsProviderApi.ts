import { axiosApi as axios } from 'shared/axios/Axios';
import { NameValueList } from 'shared/model';
import { ContentsProviderModel } from '../../model/ContentsProviderModel';

export default class ContentsProviderApi {
  //
  URL = '/api/cube/contentsProviders';

  static instance: ContentsProviderApi;

  registerContentsProvider(contentsProvider: ContentsProviderModel) {
    return axios.post<string>(this.URL, contentsProvider).then((response) => (response && response.data) || null);
  }

  findContentsProvider(providerId: string) {
    //
    return axios
      .get<ContentsProviderModel>(this.URL + `/${providerId}`)
      .then((response) => (response && response.data) || null);
  }

  findAllContentsProviders() {
    //
    return axios.get<ContentsProviderModel[]>(this.URL).then((response) => (response && response.data) || null);
  }

  modifyContentsProvider(contentsProviderId: string, nameValues: NameValueList) {
    //
    return axios.put<void>(this.URL + `${contentsProviderId}`, nameValues);
  }

  removeContentsProvider(contentsProviderId: string) {
    //
    return axios.delete(this.URL + `${contentsProviderId}`);
  }
}

Object.defineProperty(ContentsProviderApi, 'instance', {
  value: new ContentsProviderApi(),
  writable: false,
  configurable: false,
});
