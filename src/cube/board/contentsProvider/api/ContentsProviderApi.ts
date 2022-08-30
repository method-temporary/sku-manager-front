import { axiosApi as axios } from 'shared/axios/Axios';
import ContentsProvider from '../model/ContentsProvider';
import ContentsProviderCdoModel from '../model/ContentsProviderCdoModel';
import ContentsProviderRdo from '../model/ContentsProviderRdo';

const BASE_URL = '/api/cube';

export function findCommunities(limit: number, offset: number): Promise<any> {
  return axios.get<ContentsProvider[]>(`${BASE_URL}`, {
    params: { limit, offset },
  });
}

// export function findByProviderName(providerName: string): Promise<boolean> {
//   return axios
//     .get<boolean>(`${BASE_URL}/contentsProviders/existsByproviderName?providerName=${providerName}`)
//     .then((response) => response && response.data);
// }

export function findByProviderName(providerName: string): Promise<string> {
  return axios
    .get<string>(`${BASE_URL}/contentsProviders/ByName?providerName=${providerName}`)
    .then((response) => response && response.data);
}

export function findAllContentsProviderByQuery(contentsProviderRdo: ContentsProviderRdo): Promise<any> {
  return axios.get<ContentsProvider[]>(`${BASE_URL}/contentsProviders/admin/byQuery`, {
    params: contentsProviderRdo,
  });
}

export function findContentsProvider(
  communityId: string,
  contentsProviderId: string
): Promise<ContentsProviderCdoModel | undefined> {
  return axios
    .get<ContentsProviderCdoModel>(`${BASE_URL}/contentsProviders/${contentsProviderId}`)
    .then((response) => response && response.data);
}
export function registerContentsProvider(contentsProviderCdoModel: ContentsProviderCdoModel): Promise<string> {
  return axios
    .post<string>(`${BASE_URL}/contentsProviders`, contentsProviderCdoModel)
    .then((response) => response && response.data);
}
export function modifyContentsProvider(
  contentsProviderId: string,
  contentsProviderCdoModel: ContentsProviderCdoModel
): Promise<string> {
  return axios
    .put<string>(`${BASE_URL}/contentsProviders/${contentsProviderId}`, contentsProviderCdoModel)
    .then((response) => response && response.data);
}

export function removeContentsProvider(contentsProviderId: string): Promise<any> {
  return axios.delete(`${BASE_URL}/contentsProviders/${contentsProviderId}`);
}
