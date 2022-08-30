import { axiosApi as axios } from 'shared/axios/Axios';
import { AxiosReturn } from 'shared/present/apiclient/AxiosReturn';
import { OffsetElementList } from 'shared/model';
import { CollegeModel } from './model/CollegeModel';

const BASE_URL = '/api/college/colleges/admin';

export function findColleges() {
  return axios.get<OffsetElementList<CollegeModel>>(BASE_URL).then(AxiosReturn);
}

export function findAllColleges() {
  const url = `${BASE_URL}/findAll`;
  return axios.get<CollegeModel[]>(url).then(AxiosReturn);
}
