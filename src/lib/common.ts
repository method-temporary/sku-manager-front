import jwtDecode from 'jwt-decode';

import { patronInfo } from '@nara.platform/dock';
import { axiosApi, setCookie, StorageModel, deleteCookie } from '@nara.platform/accent';

import { SelectTypeModel } from 'shared/model';
import { isSuperManager } from 'shared/ui';

export interface Token {
  exp: number;
}

export const validateAccessTokenExp = () => {
  const accessToken = localStorage.getItem('nara.token');
  if (accessToken) {
    try {
      const decodedToken = jwtDecode<Token>(accessToken);
      if (decodedToken.exp) {
        if (new Date().getTime() <= decodedToken.exp * 1000) {
          return true;
        }
      }
    } catch (e) {
      return false;
    }
  }
  return false;
};

export function onLogin(id: string) {
  //
  const postData = new FormData();
  postData.append('grant_type', 'password');
  postData.append('scope', 'client');
  postData.append('username', 'ss.park@sk.com');
  postData.append('password', '1');

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa('nara:narasecret'),
    },
    noAuth: true,
  };
  return axiosApi.post('/api/checkpoint/oauth/token', postData, config).then(({ data }: any) => {
    if (data.access_token) {
      const accessToken = data.access_token;
      new StorageModel('cookie', 'isLogin').saveAsString('true');
      patronInfo.setCineroomId('ne1-m2-c2');
      new StorageModel('localStorage', 'token').saveAsString(accessToken);
      new StorageModel('localStorage', 'workspaces').save(data.workspaces);
      new StorageModel('localStorage', 'displayName').saveAsString(JSON.stringify(data.displayName));
      new StorageModel('localStorage', 'email').saveAsString(id);
      setCookie('code', data.code);
      if (data.additionalInformation && data.additionalInformation.companyCode) {
        new StorageModel('localStorage', 'companyCode').saveAsString(data.additionalInformation.companyCode);
      }
      window.location.href = '/';
    }
  });
}

export const logoutClick = () => {
  patronInfo.logout();
  localStorage.clear();
  sessionStorage.clear();
  deleteCookie('nara.isLogin');
  window.location.href = '/api/checkpoint/sso/logout';
};

export const isLogined = () => {
  if (patronInfo.getCineroomId() && patronInfo.isLogin()) {
    return true;
  }
  return false;
};

// Translator 권한만 있을경우
export const isTranslator = () => {
  let isTranslator = false;
  const requestedUrlSplit = window.location.pathname.split('/');
  const requestedCineroomRoles =
    `${process.env.NODE_ENV}` === 'development'
      ? patronInfo.getPatronRoles(requestedUrlSplit[2])
      : patronInfo.getPatronRoles(requestedUrlSplit[3]);

  if (requestedCineroomRoles && requestedCineroomRoles.includes('Translator') && requestedCineroomRoles.length <= 2) {
    isTranslator = true;
  }
  return isTranslator;
};

// url path의 cineroomId를 workspaces에서 가지고 있는지 확인
export const hasCineroomWorkspaces = (cineroomId: string) => {
  if (isSuperManager()) {
    return true;
  }

  const requestedCineroomRoles = patronInfo.getPatronRoles(cineroomId);
  if (cineroomId && requestedCineroomRoles && requestedCineroomRoles.length > 0) {
    return true;
  }
  return false;
};

export function getYearsOption(startYear: number) {
  startYear = typeof startYear == 'undefined' ? 2018 : startYear;
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = startYear; i <= currentYear; i++) {
    const value = i.toString();
    years.push(new SelectTypeModel(value, value + '년도', value));
  }
  return years;
}

export function getYYYYMMDDHHDate(timeStamp: number) {
  const date = new Date(timeStamp);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

export function currentAudienceId() {
  const currentCineroomId = patronInfo.getCineroomId();
  const cineroom = patronInfo.getCinerooms()[0];
  if (currentCineroomId === undefined || cineroom === undefined) {
    return undefined;
  }
  const splited = cineroom.patronId.split('@');
  return splited[0].concat('@', currentCineroomId);
}

export function cineroomIdFromUrl() {
  const splitedUrl = window.location.pathname.split('/');
  return process.env.NODE_ENV === 'development' ? splitedUrl[2] : splitedUrl[3];
}

export function getDisplayName() {
  const getName = localStorage.getItem('nara.displayName') || '';
  const parseName: { en: string; ko: string; zh: string } = JSON.parse(getName);

  return parseName.ko;
}
