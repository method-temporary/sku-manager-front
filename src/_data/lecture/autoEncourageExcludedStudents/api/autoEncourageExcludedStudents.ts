import { axiosApi as axios } from 'shared/axios/Axios';
import { OffsetElementList } from 'shared/model';
import { AxiosReturn } from 'shared/present/apiclient/AxiosReturn';
import { AutoEncourageExcludedStudentCdo } from '../model/AutoEncourageExcludedStudentCdo';
import { AutoEncourageExcludedStudentParams } from '../model/AutoEncourageExcludedStudentParams';
import { AutoEncourageExcludedStudentQdo } from '../model/AutoEncourageExcludedStudentQdo';

const BASE_URL = '/api/lecture/autoEncourageExcludedStudents/admin';

export function findAutoEncourageExcludedStudent(
  params: AutoEncourageExcludedStudentParams
): Promise<OffsetElementList<AutoEncourageExcludedStudentQdo> | undefined> {
  const url = `${BASE_URL}/findByQdo`;
  return axios.get(url, { params }).then(AxiosReturn);
}

export function registerAutoEncourageExcludeStudent(cardId: string, emailFormat: string) {
  const url = `${BASE_URL}?cardId=${cardId}&email=${emailFormat}`;

  return axios.post(url).then(AxiosReturn);
}

export function removeAutoEncourageExcludeStudent(ids: string[]) {
  const url = `${BASE_URL}/removeByIds`;
  return axios.post(url, ids).then(AxiosReturn);
}

export function uploadByExcel(autoEncourageExcludedStudentCdo: AutoEncourageExcludedStudentCdo[]) {
  const url = `${BASE_URL}/excel/upload`;
  return axios.post(url, autoEncourageExcludedStudentCdo).then(AxiosReturn);
}
