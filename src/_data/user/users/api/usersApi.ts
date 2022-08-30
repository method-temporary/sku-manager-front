import { axiosApi as axios } from 'shared/axios/Axios';
import { AxiosReturn } from 'shared/present/apiclient/AxiosReturn';
import { User } from '../model/User';

const BASE_URL = '/api/user';

export function findUser() {
  return axios.get<User>(`${BASE_URL}/users`).then(AxiosReturn);
}

export function findUsersByDenizenIds(ids: string[]): Promise<User[] | undefined> {
  return axios.post<User[]>(`${BASE_URL}/users/byDenizenIds`, ids).then(AxiosReturn);
}
