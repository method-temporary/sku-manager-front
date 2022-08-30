import { axiosApi as axios } from '@nara.platform/accent';

import { AxiosReturn } from 'shared/present';
import { AudienceIdentity } from 'shared/model';

import { SenderRdo } from 'sms/model/SenderRdo';
import { Sender, UserWithSmsSender } from 'sms/model/Sender';
import { UserIdentityModel } from 'cube/user/model/UserIdentityModel';
import { UserModel } from 'user/model/UserModel';

const STATION_URL = '/api/station';
const USER_URL = '/api/user';

//User 본인 상세보기
export function findUser() {
  return axios.get<UserModel>(`${USER_URL}/users`).then(AxiosReturn);
}

export function findAllDistinctManagerIdentities(senderRdo: SenderRdo) {
  const url = `${STATION_URL}/audiences/allDistinctManagerIdentities`;
  return axios
    .get<AudienceIdentity[]>(url, {
      params: {
        name: senderRdo.name,
        email: senderRdo.email,
      },
    })
    .then(AxiosReturn);
}

export function qualifySmsSender(id: string) {
  const url = `${USER_URL}/users/admin/qualifySmsSender/${id}`;
  return axios.put(url).then(AxiosReturn);
}

export function disqualifySmsSender(id: string) {
  const url = `${USER_URL}/users/admin/disqualifySmsSender/${id}`;
  return axios.put(url).then(AxiosReturn);
}

export function findSmsSendersAllowed(ids: string[]) {
  const url = `${USER_URL}/users/admin/smsSender`;
  return axios
    .post<Sender[]>(url, {
      ids,
    })
    .then(AxiosReturn);
}

export function findAllSmsSendersAllowed(senderRdo: SenderRdo) {
  const url = `${USER_URL}/users/admin/userWithSmsSender`;
  return axios
    .post<UserWithSmsSender[]>(url, {
      name: senderRdo.name,
      email: senderRdo.email,
      qualified: senderRdo.qualified ? true : undefined,
    })
    .then(AxiosReturn);
}

export function findUsersByDenizenIds(ids: string[]) {
  return axios.post<UserIdentityModel[]>(`${USER_URL}/users/byDenizenIds`, ids).then(AxiosReturn);
}
