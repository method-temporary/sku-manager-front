import { axiosApi as axios } from 'shared/axios/Axios';
import { AxiosReturn } from 'shared/present';

import { NameValues } from 'labelManagement/model/NameValues';

import { ResourcePath, ResourcePathCdo } from '../model';

const URL = '/api/arrange/i18nResourcePaths';

export function findAllResourcePaths(): Promise<ResourcePath[] | undefined> {
  const url = `${URL}/admin`;
  return axios.get<ResourcePath[]>(url).then(AxiosReturn);
}

export function registerResourcePaths(params: ResourcePathCdo): Promise<string | undefined> {
  const url = `${URL}/admin/`;
  return axios.post<string>(url, params).then(AxiosReturn);
}

export function modifyResourcePaths(i18nResourcePathId: string, params: NameValues[]) {
  const url = `${URL}/admin/${i18nResourcePathId}`;
  return axios.put(url, { nameValues: params }).then(AxiosReturn);
}
