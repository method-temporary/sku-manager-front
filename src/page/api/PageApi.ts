import { axiosApi as axios } from 'shared/axios/Axios';
import { NameValueList } from '@nara.platform/accent';
import PageCdo from '../model/PageCdo';
import Page from '../model/Page';
import PageUdo from '../model/PageUdo';

const baseUrl = 'api/commuintiy/pages';

export function findAllPages(
  limit: number,
  offset: number,
  communityId: number,
  ownerId?: number
): Promise<Page[] | undefined> {
  return axios
    .get<Page[]>(`${baseUrl}`, {
      params: { limit, offset, communityId, ownerId },
    })
    .then((response) => response && response.data && response.data);
}
export function findPage(pageId: number): Promise<Page | undefined> {
  return axios.get<Page>(`${baseUrl}/${pageId}`).then((response) => response && response.data && response.data);
}
export function registerPage(pageCdo: PageCdo): Promise<Page | undefined> {
  return axios.post<Page>(`${baseUrl}`, pageCdo).then((response) => response && response.data && response.data);
}
export function updatePage(pageId: number, pageUdo: PageUdo): Promise<Page | undefined> {
  return axios
    .put<Page>(`${baseUrl}/${pageId}`, pageUdo)
    .then((response) => response && response.data && response.data);
}
export function modifyPage(pageId: number, nameValueList: NameValueList): Promise<Page | undefined> {
  return axios
    .put<Page>(`${baseUrl}/${pageId}`, nameValueList)
    .then((response) => response && response.data && response.data);
}
export function removePage(pageId: number): Promise<any> {
  return axios.delete(`${baseUrl}/${pageId}`);
}
