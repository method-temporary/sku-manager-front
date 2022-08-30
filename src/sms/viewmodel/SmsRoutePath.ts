import { getSmsRoutePath } from "sms/store/SmsRoutePathStore";

export interface SmsRoutePath {
  path: string;
}

export function getSmsSendPath(): string {
  const testRoutePath = getSmsRoutePath();
  if (testRoutePath === undefined) {
    return '';
  }
  return `${testRoutePath.path}/sms-send`;
}

export function getSmsListPath(): string {
  const testRoutePath = getSmsRoutePath();
  if (testRoutePath === undefined) {
    return '';
  }
  return `${testRoutePath.path}/sms-management`;
}