import { axiosApi as axios } from 'shared/axios/Axios';
import { AxiosReturn } from '../../../shared/present/apiclient/AxiosReturn';
import { CpContent } from './model/CpContent';
import * as querystring from 'querystring';
import qs from 'qs';

const CP_CONTENT_URL = '/api/contentprovider/cpcontents/admin';

export function modifyLinkedInCpContents(): Promise<void> {
  //
  const url = `${CP_CONTENT_URL}/linkedin`;
  return axios.get(url).then(AxiosReturn);
}

export function modifyCourseraCpContents(): Promise<void> {
  //
  const url = `${CP_CONTENT_URL}/coursera`;
  return axios.get(url).then(AxiosReturn);
}

export function findLinkedInContentByUrn(urn: string): Promise<CpContent> {
  //
  const url = `${CP_CONTENT_URL}/linkedin/byUrn`;
  return axios.post(url, { urn }).then(AxiosReturn);
}

export function registerLinkedInContentByUrn(urn: string): Promise<void> {
  //
  const url = `${CP_CONTENT_URL}/linkedin/save/byUrn`;
  return axios.post(url, { urn }).then(AxiosReturn);
}

// export function modifyCourseraCpContents(auth2AuthorizedClient: OAuth2AuthorizedClient): Promise<void> {
//   //
//   const url = `${CP_CONTENT_URL}/coursera`;
//   return axios.get(url, )
// }
