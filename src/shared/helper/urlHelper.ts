import { getUserHostName } from './hostName';

const MYSUNI_FRONT_CONTEXT_PATH = '/suni-main';

function getMySUNIFrontUrl() {
  let url = process.env.REACT_APP_MYSUNI_URL; // 설정기반

  if (!url) {
    // 접속 도메인 기반
    const { protocol, hostname, port } = window.location;

    url = protocol + '//' + hostname + (port && port !== '80' ? ':' + port : '') + MYSUNI_FRONT_CONTEXT_PATH;
  }

  return url;
}

export function getApiDomain() {
  return process.env.REACT_APP_API_DOMAIN || '';
}

export function getDepotFileBaseUrl() {
  // return process.env.REACT_APP_DEPOT_BASE_URL || '';
  return process.env.NODE_ENV !== 'development'
    ? window.location.protocol + '//' + window.location.host
    : 'http://10.178.66.114';
}

export function getBadgeDetailUrl(badgeId?: string) {
  const templateUrl = getMySUNIFrontUrl() + (process.env.REACT_APP_BADGE_DETAIL_PATH || '');

  const rep = !badgeId ? 'badgeId' : badgeId;
  return replaceTemplateVariable(templateUrl, 'badgeId', rep);
}

export function getBadgePreviewUrl(badgeId: string) {
  // const templateUrl = getMySUNIFrontUrl() + (process.env.REACT_APP_BADGE_PREVIEW_PATH || '');
  const templateUrl =
    process.env.NODE_ENV !== 'development'
      ? `https://${getUserHostName()}${MYSUNI_FRONT_CONTEXT_PATH}${process.env.REACT_APP_BADGE_PREVIEW_PATH || ''}`
      : `https://stg.mysuni.sk.com${MYSUNI_FRONT_CONTEXT_PATH}${process.env.REACT_APP_BADGE_PREVIEW_PATH || ''}`;

  return replaceTemplateVariable(templateUrl, 'badgeId', badgeId);
}

export function getBadgeCategoryPreviewUrl(badgeCategoryId: string) {
  const templateUrl =
    process.env.NODE_ENV !== 'development'
      ? `https://${getUserHostName()}${MYSUNI_FRONT_CONTEXT_PATH}${
          process.env.REACT_APP_BADGE_CATEGORY_PREVIEW_PATH || ''
        }`
      : `https://stg.mysuni.sk.com${MYSUNI_FRONT_CONTEXT_PATH}${
          process.env.REACT_APP_BADGE_CATEGORY_PREVIEW_PATH || ''
        }`;

  return replaceTemplateVariable(templateUrl, 'badgeCategoryId', badgeCategoryId);
}

export function getAuthorizedContentsUrl(redirectUrl: string) {
  const templateUrl = process.env.REACT_APP_AUTHORIZED_ACCESS_REDIRECT_URL || '';
  return replaceTemplateVariable(templateUrl, 'contentUrl', redirectUrl);
}

// template 문자열에서 지정된 문자열패턴({variable})을 replace
function replaceTemplateVariable(template: string, variable: string, replace: string) {
  if (!template && !variable && !replace) return '';
  const regx = new RegExp(':' + variable, 'g');
  return template.replace(regx, replace);
}

export function getDomainPath() {
  //
  return process.env.NODE_ENV !== 'development'
    ? window.location.protocol + '//' + window.location.host
    : // : 'http://10.178.66.114',
      'http://ma.university.sk.com';
}

export function getImagePath() {
  //
  // mySUNI Image Path 'https://image.mysuni.sk.com/suni-asset'
  return process.env.NODE_ENV !== 'development'
    ? window.location.host === 'mysuni.sk.com'
      ? window.location.protocol + '//image.' + window.location.host + '/suni-asset'
      : window.location.protocol + '//' + window.location.host + '/suni-asset'
    : 'https://ma.mysuni.sk.com/suni-asset';
}

export default {
  getDepotFileBaseUrl,
  getBadgeDetailUrl,
  getBadgePreviewUrl,
  getAuthorizedContentsUrl,
  getApiDomain,
  getDomainPath,
  getImagePath,
};
