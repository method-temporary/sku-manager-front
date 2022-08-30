import { axiosApi as axios } from 'shared/axios/Axios';
import { AxiosReturn } from 'shared/present';
import { CollegeChannel } from '../model/CollegeChannel';

const URL = '/api/college/colleges';

export const findCollegeForCineroomId = (): Promise<CollegeChannel[]> => {
  //
  return axios.get(`${URL}/forCurrentCineroom`).then(AxiosReturn);
};
