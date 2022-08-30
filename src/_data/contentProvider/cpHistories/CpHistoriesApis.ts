import { CpHistoryQdo } from './model/CpHistoryQdo';
import { CpHistory } from './model/CpHistory';
import { axiosApi as axios } from 'shared/axios/Axios';
import { AxiosReturn } from '../../../shared/present/apiclient/AxiosReturn';

const CP_HISTORY_URL = '/api/contentprovider/admin/cpsynchistories';

export function findAllCpHistories(cpHistoryQdo: CpHistoryQdo): Promise<CpHistory[]> {
  //
  const url = CP_HISTORY_URL + '/all';
  return axios.get(url, { params: cpHistoryQdo }).then(AxiosReturn);
}

export function findCoursera(cpHistoryQdo: CpHistoryQdo): Promise<CpHistory> {
  //
  const url = CP_HISTORY_URL + `/coursera`;
  return axios.get(url, { params: cpHistoryQdo }).then(AxiosReturn);
}

export function findCpHistoryById(id: string): Promise<CpHistory> {
  //
  const url = CP_HISTORY_URL + `/${id}`;
  return axios.get(url).then(AxiosReturn);
}
