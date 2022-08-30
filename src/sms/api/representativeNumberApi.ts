import { axiosApi as axios } from '@nara.platform/accent';
import { OffsetElementList } from 'shared/model';
import { AxiosReturn } from 'shared/present';
import { RepresentativeNumberRdo } from 'sms/model/RepresentativeNumberRdo';
import { RepresentativeNumber, RepresentativeNumberWithUserIdentity } from 'sms/model/RepresentativeNumber';
import { RepresentativeNumberSdo } from 'sms/model/RepresentativeNumberSdo';

const SUPPORT_URL = '/api/support';

export function findByRepresentativeNumberRdo(representativeNumberRdo: RepresentativeNumberRdo) {
  const url = `${SUPPORT_URL}/admin/representativeNumbers/findByRepresentativeNumberRdo`;
  return axios
    .get<OffsetElementList<RepresentativeNumberWithUserIdentity>>(url, {
      params: representativeNumberRdo,
    })
    .then(AxiosReturn);
}

export function register(representativeNumberSdo: RepresentativeNumberSdo) {
  const url = `${SUPPORT_URL}/admin/representativeNumbers`;
  return axios.post(url, representativeNumberSdo).then(AxiosReturn);
}

export function modify(representativeNumberSdo: RepresentativeNumberSdo) {
  const url = `${SUPPORT_URL}/admin/representativeNumbers/${representativeNumberSdo.id}`;
  return axios.put(url, representativeNumberSdo).then(AxiosReturn);
}

export function find(id: string) {
  const url = `${SUPPORT_URL}/admin/representativeNumbers/${id}`;
  return axios.get<RepresentativeNumber>(url).then(AxiosReturn);
}

export function remove(id: string) {
  const url = `${SUPPORT_URL}/admin/representativeNumbers/${id}`;
  return axios.delete(url).then(AxiosReturn);
}
