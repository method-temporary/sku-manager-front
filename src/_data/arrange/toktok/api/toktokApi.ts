import { axiosApi as axios, OffsetElementList } from '@nara.platform/accent';
import { AxiosReturn } from 'shared/present';

import { ToktokPortlet, ToktokPortletCdo, ToktokPortletRdo, ToktokPortletUdo } from '../model';

const BASE_URL = '/api/arrange/toktok';

export function registerToktokPortlet(toktokPortletCdo: ToktokPortletCdo) {
  const url = `${BASE_URL}/portlets`;
  return axios.post<string>(url, toktokPortletCdo).then(AxiosReturn);
}

export function modifyToktokPortlet(portletId: string, toktokPortletUdo: ToktokPortletUdo) {
  const url = `${BASE_URL}/portlets/${portletId}`;
  return axios
    .put<void>(url, toktokPortletUdo)
    .then(() => 'success')
    .catch(() => 'error');
}

export function removeToktokPortlet(portletId: string) {
  const url = `${BASE_URL}/portlets/${portletId}`;
  return axios
    .delete(url)
    .then(() => 'success')
    .catch(() => 'error');
}

export function findAllToktokPortlet(toktokPortletRdo: ToktokPortletRdo) {
  const url = `${BASE_URL}/portlets`;
  return axios
    .get<OffsetElementList<ToktokPortlet>>(url, {
      params: toktokPortletRdo,
    })
    .then(AxiosReturn);
}

export function findToktokPortlet(portletId: string) {
  const url = `${BASE_URL}/portlets/${portletId}`;
  return axios.get<ToktokPortlet>(url).then(AxiosReturn);
}
