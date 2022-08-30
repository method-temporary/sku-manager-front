import { axiosApi as axios } from 'shared/axios/Axios';
import { OffsetElementList } from 'shared/model';
import { AxiosReturn } from 'shared/present/apiclient/AxiosReturn';
import { EnableRepresentativeNumber } from '../model/EnableRepresentativeNumber';
import { findByRepresentativeNumberRdo } from '../model/FindByRepresentativeNumberRdo';

const BASE_URL = '/api/support/admin';

export function findEnableRepresentativeNumber(params: findByRepresentativeNumberRdo) {
  const url = `${BASE_URL}/representativeNumbers/findByRepresentativeNumberRdo`;
  return axios.get<OffsetElementList<EnableRepresentativeNumber>>(url, { params }).then(AxiosReturn);
}
