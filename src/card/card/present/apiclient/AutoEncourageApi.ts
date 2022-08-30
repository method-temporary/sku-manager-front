import useSwr from 'swr';
import { axiosApi as axios } from 'shared/axios/Axios';
import { OffsetElementList } from 'shared/model';
import { AxiosReturn } from 'shared/present';

import { AutoEncourageParams, AutoEncourageQdo } from 'card/card/model/encourage/AutoEncourageQdo';
import { AutoEncourage } from '_data/lecture/autoEncourage/model/AutoEncourage';
import { AutoEncourageSdo } from '_data/lecture/autoEncourage/model/AutoEncourageSdo';
import { CopyAutoEncourageCdo } from '_data/lecture/autoEncourage/model/CopyAutoEncourageCdo';

const BASE_URL = '/api/lecture/autoEncourages/admin';

export const encourageApi = {
  autoEncourages: {
    findAutoEncourage: '/api/lecture/autoEncourages/admin',
    findAutoEncourageQdo: '/api/lecture/autoEncourages/admin/findByQdo',
  },
  autoEncourageExcludeQdo: '/api/lecture/autoEncourageExcludedStudents/admin/findByQdo',
};

export function registerAutoEncourage(autoEncourageSdo: AutoEncourageSdo) {
  const url = `${BASE_URL}`;

  return axios.post(url, autoEncourageSdo).then(AxiosReturn);
}

export function findAutoEncourage(url: string, id: string): Promise<AutoEncourage | undefined> {
  // const url = `${BASE_URL}/admin/${id}`;

  return axios.get<AutoEncourage>(`${url}/${id}`).then(AxiosReturn);
}

export function useFindAutoEncourage(id?: string) {
  const {
    data: autoEncourageList,
    error,
    mutate: autoEncourageListMutate,
  } = useSwr(id ? [encourageApi.autoEncourages.findAutoEncourage, id] : null, findAutoEncourage);

  return {
    autoEncourageList,
    isLoading: !autoEncourageList && !error,
    autoEncourageListMutate,
  };
}

export function modifyAutoEncourage(id: string, autoEncourageSdo: AutoEncourageSdo) {
  const url = `${BASE_URL}/${id}`;

  return axios.put(url, autoEncourageSdo).then(AxiosReturn);
}

export function deleteAutoEncourage(id: string) {
  const url = `${BASE_URL}/${id}`;

  return axios.delete(url).then(AxiosReturn);
}

export function findAutoEncourageQdo(
  url: string,
  autoEncourageParams: AutoEncourageParams
): Promise<OffsetElementList<AutoEncourageQdo> | undefined> {
  const { cardId, deliveryType, endTime, limit, offset, startTime, title, target } = autoEncourageParams;

  const params = {
    cardId,
    title,
    limit,
    offset,
    startTime,
    endTime,
    deliveryType,
    'target.learningState': target.learningState,
    'target.reportNotPassed': target.reportNotPassed,
    'target.surveyNotPassed': target.surveyNotPassed,
    'target.testNotPassed': target.testNotPassed,
  };
  return axios.get<OffsetElementList<AutoEncourageQdo>>(url, { params }).then(AxiosReturn);
}

export function useFindAutoEncourageQdo(autoEncourageParams: AutoEncourageParams) {
  const {
    data: encourageList,
    error,
    mutate,
  } = useSwr([encourageApi.autoEncourages.findAutoEncourageQdo, autoEncourageParams], findAutoEncourageQdo, {
    fallbackData: {
      empty: true,
      results: [],
      totalCount: 0,
    },
  });

  return {
    encourageList,
    isLoading: !encourageList && !error,
    mutate,
  };
}

export function copyAutoEncouragesByCardIds(copyAutoEncourageCdo: CopyAutoEncourageCdo) {
  const url = `${BASE_URL}/copy`;

  return axios.post(url, copyAutoEncourageCdo).then(AxiosReturn);
}
