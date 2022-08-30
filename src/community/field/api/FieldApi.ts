import { axiosApi as axios, NameValueList } from '@nara.platform/accent';
import Field from '../model/Field';
import FieldCdo from '../model/FieldCdo';
import FieldOrder from '../model/FieldOrder';

const BASE_URL = '/api/community/fields';

export function findFields(): Promise<Field[] | undefined> {
  return axios.get<Field[]>(`${BASE_URL}`).then((response) => response && response.data && response.data);
}
export function findFieldByTitle(fieldByTitle: string): Promise<boolean> {
  return axios
    .get<boolean>(`${BASE_URL}/existsByTitle?title=${fieldByTitle}`)
    .then((response) => response && response.data);
}
export function registerField(fieldCdo: FieldCdo): Promise<string> {
  return axios.post<string>(`${BASE_URL}`, fieldCdo).then((response) => response && response.data && response.data);
}
export function modifyField(fieldId: string, nameValueList: NameValueList): Promise<any> {
  return axios.put(`${BASE_URL}/${fieldId}`, nameValueList);
}
export function removeField(fieldId: string): Promise<any> {
  if (fieldId === '') {
    return new Promise((resolve, reject) => resolve(undefined));
  } else {
    return axios.delete(`${BASE_URL}/${fieldId}`);
  }
}
export function saveFieldOrder(fieldOrders: FieldOrder[]): Promise<any> {
  return axios.post<string>(`${BASE_URL}/orders`, fieldOrders);
}
