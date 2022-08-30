import { axiosApi as axios } from 'shared/axios/Axios';
import { AxiosReturn } from 'shared/present/apiclient/AxiosReturn';
import { FindFailedSmsRslt } from '../model/FindFailedSmsRslt';
import { SentSmsAndFailedCount } from '../model/SentSmsAndFailCount';

const BASE_URL = '/api/pigeon/sentSms';

export function findSentSmsAndFailedCountByEventIds(eventIds: string[]): Promise<SentSmsAndFailedCount | undefined> {
  const url = `${BASE_URL}/detail`;
  return axios.post<SentSmsAndFailedCount>(url, eventIds).then(AxiosReturn);
}

export function findFailedSmsRsltRdoByEventIds(eventIds: string[]): Promise<FindFailedSmsRslt[] | undefined> {
  const url = `${BASE_URL}/sentSms/findFailedSmsRsltRdo`;

  return axios.post<FindFailedSmsRslt[]>(url, eventIds).then(AxiosReturn);
}
