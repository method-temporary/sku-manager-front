import { axiosApi as axios } from 'shared/axios/Axios';
import { NaOffsetElementList, NameValueList } from 'shared/model';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';
import SearchTag from '../model/SearchTag';
import SearchTagCdo from '../model/SearchTagCdo';
import SearchTagRdo from '../model/SearchTagRdo';

const BASE_URL = '/api/cube/searchtags';

export function registerSearchTag(searchTagCdo: SearchTagCdo): Promise<string> {
  return axios.post<string>(`${BASE_URL}`, searchTagCdo).then((response) => response && response.data && response.data);
}
export function findAllSearchTag(searchTagRdo: SearchTagRdo): Promise<NaOffsetElementList<SearchTag>> {
  const params = `startDate=${searchTagRdo.startDate}&endDate=${searchTagRdo.endDate}&text=${searchTagRdo.text}&limit=${searchTagRdo.limit}&offset=${searchTagRdo.offset}`;

  return axios
    .getLoader<NaOffsetElementList<SearchTag>>(`${BASE_URL}?${params}`)
    .then((response) => response && response.data && response.data);
}
export function findAllSearchTagByTag(searchTagRdo: SearchTagRdo): Promise<NaOffsetElementList<SearchTag>> {
  const params = `startDate=${searchTagRdo.startDate}&endDate=${searchTagRdo.endDate}&tag=${searchTagRdo.tag}&limit=${searchTagRdo.limit}&offset=${searchTagRdo.offset}`;

  return axios
    .getLoader<NaOffsetElementList<SearchTag>>(`${BASE_URL}/tag?${params}`)
    .then((response) => response && response.data && response.data);
}
export function findAllSearchTagByKeywords(searchTagRdo: SearchTagRdo): Promise<NaOffsetElementList<SearchTag>> {
  const params = `startDate=${searchTagRdo.startDate}&endDate=${searchTagRdo.endDate}&keywords=${searchTagRdo.keywords}&limit=${searchTagRdo.limit}&offset=${searchTagRdo.offset}`;

  return axios
    .getLoader<NaOffsetElementList<SearchTag>>(`${BASE_URL}/keywords?${params}`)
    .then((response) => response && response.data && response.data);
}
export function findAllSearchTagByCreator(searchTagRdo: SearchTagRdo): Promise<NaOffsetElementList<SearchTag>> {
  const params = `startDate=${searchTagRdo.startDate}&endDate=${searchTagRdo.endDate}&creator=${searchTagRdo.creator}&limit=${searchTagRdo.limit}&offset=${searchTagRdo.offset}`;

  return axios
    .getLoader<NaOffsetElementList<SearchTag>>(`${BASE_URL}/creator?${params}`)
    .then((response) => response && response.data && response.data);
}
export function findAllSearchTagByUpdater(searchTagRdo: SearchTagRdo): Promise<NaOffsetElementList<SearchTag>> {
  const params = `startDate=${searchTagRdo.startDate}&endDate=${searchTagRdo.endDate}&modifier=${searchTagRdo.modifier}&limit=${searchTagRdo.limit}&offset=${searchTagRdo.offset}`;

  return axios
    .getLoader<NaOffsetElementList<SearchTag>>(`${BASE_URL}/updater?${params}`)
    .then((response) => response && response.data && response.data);
}
export function excelSearchTag(searchTagRdo: SearchTagRdo): Promise<NaOffsetElementList<SearchTag>> {
  const params = `startDate=${searchTagRdo.startDate}&endDate=${searchTagRdo.endDate}&text=${searchTagRdo.text}&limit=${searchTagRdo.limit}&offset=${searchTagRdo.offset}`;
  const apiUrl = `${BASE_URL}/excel?${params}`;

  setExcelHistoryParams({
    searchUrl: apiUrl,
    searchParam: params,
    workType: 'Excel Download',
  });

  return axios
    .getLoader<NaOffsetElementList<SearchTag>>(apiUrl)
    .then((response) => response && response.data && response.data);
}
export function excelSearchTagByTag(searchTagRdo: SearchTagRdo): Promise<NaOffsetElementList<SearchTag>> {
  const params = `startDate=${searchTagRdo.startDate}&endDate=${searchTagRdo.endDate}&tag=${searchTagRdo.tag}&limit=${searchTagRdo.limit}&offset=${searchTagRdo.offset}`;
  const apiUrl = `${BASE_URL}/excel/tag?${params}`;

  setExcelHistoryParams({
    searchUrl: apiUrl,
    searchParam: params,
    workType: 'Excel Download',
  });

  return axios
    .getLoader<NaOffsetElementList<SearchTag>>(apiUrl)
    .then((response) => response && response.data && response.data);
}
export function excelSearchTagByKeywords(searchTagRdo: SearchTagRdo): Promise<NaOffsetElementList<SearchTag>> {
  const params = `startDate=${searchTagRdo.startDate}&endDate=${searchTagRdo.endDate}&keywords=${searchTagRdo.keywords}&limit=${searchTagRdo.limit}&offset=${searchTagRdo.offset}`;
  const apiUrl = `${BASE_URL}/excel/keywords?${params}`;

  setExcelHistoryParams({
    searchUrl: apiUrl,
    searchParam: params,
    workType: 'Excel Download',
  });

  return axios
    .getLoader<NaOffsetElementList<SearchTag>>(apiUrl)
    .then((response) => response && response.data && response.data);
}
export function excelSearchTagByCreator(searchTagRdo: SearchTagRdo): Promise<NaOffsetElementList<SearchTag>> {
  const params = `startDate=${searchTagRdo.startDate}&endDate=${searchTagRdo.endDate}&creator=${searchTagRdo.creator}&limit=${searchTagRdo.limit}&offset=${searchTagRdo.offset}`;
  const apiUrl = `${BASE_URL}/excel/creator?${params}`;

  setExcelHistoryParams({
    searchUrl: apiUrl,
    searchParam: params,
    workType: 'Excel Download',
  });

  return axios
    .getLoader<NaOffsetElementList<SearchTag>>(apiUrl)
    .then((response) => response && response.data && response.data);
}
export function excelSearchTagByUpdater(searchTagRdo: SearchTagRdo): Promise<NaOffsetElementList<SearchTag>> {
  const params = `startDate=${searchTagRdo.startDate}&endDate=${searchTagRdo.endDate}&updater=${searchTagRdo.modifier}&limit=${searchTagRdo.limit}&offset=${searchTagRdo.offset}`;
  const apiUrl = `${BASE_URL}/excel/updater?${params}`;

  setExcelHistoryParams({
    searchUrl: apiUrl,
    searchParam: params,
    workType: 'Excel Download',
  });

  return axios
    .getLoader<NaOffsetElementList<SearchTag>>(apiUrl)
    .then((response) => response && response.data && response.data);
}
export function findSearchTag(searchTagId: string): Promise<SearchTag> {
  return axios
    .getLoader<SearchTag>(`${BASE_URL}/${searchTagId}`)
    .then((response) => response && response.data && response.data);
}
export function findbyTag(tag: string): Promise<SearchTag> {
  const params = `tag=${tag}`;
  return axios
    .getLoader<SearchTag>(`${BASE_URL}/findByTag?${params}`)
    .then((response) => response && response.data && response.data);
}

export function modifySearchTag(searchTagId: string, nameValueList: NameValueList): Promise<any> {
  return axios
    .putLoader(`${BASE_URL}/${searchTagId}`, nameValueList)
    .then((response) => response && response.data && response.data);
}
export function removeSearchTag(searchTagId: string): Promise<any> {
  return axios.delete(`${BASE_URL}/${searchTagId}`).then((response) => response && response.data && response.data);
}
