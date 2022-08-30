import { axiosApi as axios } from 'shared/axios/Axios';
import { OffsetElementList } from 'shared/model';
import { AxiosReturn } from 'shared/present';

import { Resource } from '../model';
import { NameValues } from 'labelManagement/model/NameValues';

const URL = '/api/arrange/i18nResources';

export function findAllResources(i18nResourcePathId: string): Promise<OffsetElementList<Resource> | undefined> {
  const url = `${URL}/admin?i18nResourcePathId=${i18nResourcePathId}&&limit=9999&offset=0`;
  return axios.get<OffsetElementList<Resource>>(url).then(AxiosReturn);
}

export function registerResource(params: Resource) {
  const url = `${URL}/admin`;
  return axios.post(url, params).then(AxiosReturn);
}

export function modifyResource(i18nResourceId: string, params: NameValues[]) {
  const url = `${URL}/admin/${i18nResourceId}`;
  return axios.put(url, { nameValues: params }).then(AxiosReturn);
}
