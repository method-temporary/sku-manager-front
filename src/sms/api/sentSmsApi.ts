import useSwr from 'swr';

import { axiosApi as axios } from '@nara.platform/accent';

import { OffsetElementList } from 'shared/model';
import { AxiosReturn } from 'shared/present';

import { FindFailedSmsRslt } from 'sms/model/FindFailedSmsRslt';
import { SentSms } from 'sms/model/SentSms';
import { SentSmsAndFailedCount } from 'sms/model/SentSmsAndFaildCount';
import { SentSmsCdo } from 'sms/model/SentSmsCdo';
import { SentSmsRdo } from 'sms/model/SentSmsRdo';

const BASE_URL = '/api/pigeon';

const pigeonApi = {
  sentSms: {
    findSentSmsAndFailedCount: '/api/pigeon/sentSms/detail',
  },
};

export function registSentSms(sentSmsCdo: SentSmsCdo) {
  const url = `${BASE_URL}/sentSms`;
  return axios.post<string>(url, sentSmsCdo).then(AxiosReturn);
}

export function findAllSentSms(sentSmsRdo: SentSmsRdo) {
  const url = `${BASE_URL}/sentSms`;
  return axios
    .get<OffsetElementList<SentSms>>(url, {
      params: sentSmsRdo,
    })
    .then(AxiosReturn);
}

export function findFailedSmsRsltRdoByEventIds(eventIds: string[]): Promise<FindFailedSmsRslt[] | undefined> {
  const url = `${BASE_URL}/sentSms/findFailedSmsRsltRdo`;

  return axios.post<FindFailedSmsRslt[]>(url, eventIds).then(AxiosReturn);
}

export function findSentSms(sentSmsId: string) {
  const url = `${BASE_URL}/sentSms/${sentSmsId}`;
  return axios.get<SentSms>(url).then(AxiosReturn);
}

export function findSentSmsAndFailedCount(url: string, sentSmsId: string): Promise<SentSmsAndFailedCount | undefined> {
  return axios.get<SentSmsAndFailedCount>(`${url}/${sentSmsId}`).then(AxiosReturn);
}

export function useFindSentSmsAndFailedcount(sentSmsId: string) {
  const { data, error, mutate } = useSwr(
    [pigeonApi.sentSms.findSentSmsAndFailedCount, sentSmsId],
    findSentSmsAndFailedCount
  );

  return {
    data,
    isLoading: !data && !error,
    mutate,
  };
}

export function findSentSmsAndFailedCountByEventIds(eventIds: string[]): Promise<SentSmsAndFailedCount | undefined> {
  const url = `/api/pigeon/sentSms/detail`;
  return axios.post<SentSmsAndFailedCount>(url, eventIds).then(AxiosReturn);
}
