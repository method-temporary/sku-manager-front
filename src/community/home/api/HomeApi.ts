import { axiosApi as axios, NameValueList } from '@nara.platform/accent';
import Home from '../model/Home';
import HomeCdo from '../model/HomeCdo';

const BASE_URL = '/api/community';

export function findHome(communityId: string): Promise<Home | undefined> {
  return axios
    .get<Home>(`${BASE_URL}/${communityId}/home`)
    .then((response) => response && response.data && response.data);
}
export function registerHome(communityId: string, homeCdo: HomeCdo): Promise<string> {
  return axios
    .post<string>(`${BASE_URL}/${communityId}/home`, homeCdo)
    .then((response) => response && response.data && response.data);
}
export function modifyHome(
  communityId: string,
  homeId: string,
  nameValueList: NameValueList
): Promise<any> {
  return axios
    .put(`${BASE_URL}/${communityId}/home/${homeId}`, nameValueList)
}
export function registerPreviewHome(communityId: string, homeCdo: HomeCdo): Promise<string> {
  return axios
    .post<string>(`${BASE_URL}/${communityId}/home/preview`, homeCdo)
    .then((response) => response && response.data && response.data);
}
export function findPreview(communityId: string, draft: number): Promise<Home | undefined> {
  return axios
    .get<Home>(`${BASE_URL}/${communityId}/home/${draft}`)
    .then((response) => response && response.data && response.data);
}

