import useSWR from 'swr';
import { axiosApi as axios } from 'shared/axios/Axios';
import { OffsetElementList } from 'shared/model';
import { AxiosReturn } from 'shared/present';
import {
  AutoEncourageExcludedStudentCdos,
  AutoEncourageExcludedStudentParams,
  AutoEncourageExcludedStudentQdo,
} from 'card/card/model/encourage/AutoEncourageExcludedStudentQdo';
import { encourageApi } from './AutoEncourageApi';

const BASE_URL = '/api/lecture/autoEncourageExcludedStudents/admin';

export function findAutoEncourageExcludedStudent(
  url: string,
  params: AutoEncourageExcludedStudentParams
): Promise<OffsetElementList<AutoEncourageExcludedStudentQdo> | undefined> {
  return axios.get(url, { params }).then(AxiosReturn);
}

export function useFindAutoEncourageExcludedStudent(params: AutoEncourageExcludedStudentParams) {
  const {
    data: autoEncourageExcludedStudents,
    error,
    mutate: autoEncourageExcludedStudentMutate,
  } = useSWR([encourageApi.autoEncourageExcludeQdo, params], findAutoEncourageExcludedStudent);

  return {
    autoEncourageExcludedStudents,
    isLoading: !autoEncourageExcludedStudentMutate && !error,
    autoEncourageExcludedStudentMutate,
  };
}

export function registerAutoEncourageExcludeStudent(cardId: string, emailFormat: string) {
  const url = `${BASE_URL}?cardId=${cardId}&email=${emailFormat}`;

  return axios.post(url).then(AxiosReturn);
}

export function removeAutoEncourageExcludeStudent(ids: string[]) {
  const url = `${BASE_URL}/removeByIds`;
  return axios.post(url, ids).then(AxiosReturn);
}

export function uploadByExcel(autoEncourageExcludedStudentCdos: AutoEncourageExcludedStudentCdos[]) {
  const url = `${BASE_URL}/excel/upload`;
  return axios.post(url, autoEncourageExcludedStudentCdos).then(AxiosReturn);
}
