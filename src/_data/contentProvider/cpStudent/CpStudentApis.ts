import { axiosApi as axios } from 'shared/axios/Axios';
import { AxiosReturn } from '../../../shared/present/apiclient/AxiosReturn';
import { CpQdo } from './model/CpQdo';

const CP_STUDENT_URL = '/api/contentprovider/cpstudents/admin';

export function modifyLinkedInCpStudents(cpQdo: CpQdo): Promise<void> {
  //
  const url = `${CP_STUDENT_URL}/linkedIn`;
  return axios.get(url, { params: cpQdo }).then(AxiosReturn);
}

export function modifyCourseraCpStudents(cpQdo: CpQdo): Promise<void> {
  //
  const url = `${CP_STUDENT_URL}/coursera`;
  return axios.get(url, { params: cpQdo }).then(AxiosReturn);
}
