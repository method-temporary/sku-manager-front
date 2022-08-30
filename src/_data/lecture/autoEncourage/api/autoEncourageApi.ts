import { axiosApi as axios } from 'shared/axios/Axios';
import { AxiosReturn } from 'shared/present/apiclient/AxiosReturn';
import { OffsetElementList } from 'shared/model';
import { AutoEncourageSdo } from '../model/AutoEncourageSdo';
import { AutoEncourage } from '../model/AutoEncourage';
import { AutoEncourageParams, AutoEncourageQdo } from '../model/AutoEncourageQdo';
import { CopyAutoEncourageCdo } from '../model/CopyAutoEncourageCdo';

const BASE_URL = '/api/lecture/autoEncourages/admin';

export function registerAutoEncourage(autoEncourageSdo: AutoEncourageSdo) {
  const url = `${BASE_URL}`;

  return axios.post(url, autoEncourageSdo).then(AxiosReturn);
}

export function findAutoEncourageById(id: string): Promise<AutoEncourage | undefined> {
  const url = `${BASE_URL}/${id}`;

  return axios.get<AutoEncourage>(url).then(AxiosReturn);
}

export function modifyAutoEncourage(id: string, autoEncourageSdo: AutoEncourageSdo) {
  const url = `${BASE_URL}/${id}`;

  return axios.put(url, autoEncourageSdo).then(AxiosReturn);
}

export function deleteAutoEncourageId(id: string) {
  const url = `${BASE_URL}/${id}`;

  return axios.delete(url).then(AxiosReturn);
}

export function deleteAutoEncourageIds(ids: string[]) {
  const url = `${BASE_URL}/removeByIds`;

  return axios.post(url, ids).then(AxiosReturn);
}

export function findAutoEncourageQdo(
  autoEncourageParams: AutoEncourageParams
): Promise<OffsetElementList<AutoEncourageQdo> | undefined> {
  const url = '/api/lecture/autoEncourages/admin/findByQdo';
  const { cardId, deliveryType, endTime, limit, offset, startTime, title, target, round } = autoEncourageParams;

  const params = {
    cardId,
    title,
    limit,
    offset,
    startTime,
    endTime,
    deliveryType,
    round,
    'target.learningState': target.learningState,
    'target.reportNotPassed': target.reportNotPassed,
    'target.surveyNotPassed': target.surveyNotPassed,
    'target.testNotPassed': target.testNotPassed,
  };
  return axios.get<OffsetElementList<AutoEncourageQdo>>(url, { params }).then(AxiosReturn);
}

export function copyAutoEncouragesByCardIds(copyAutoEncourageCdo: CopyAutoEncourageCdo) {
  const url = `${BASE_URL}/copy`;

  return axios.post(url, copyAutoEncourageCdo).then(AxiosReturn);
}
