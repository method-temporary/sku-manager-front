export function getCourseraUrlParamsConverter(url: string): string {
  //
  if (url.indexOf('?') === -1) {
    return `${url}?authProvider=mysuni&attemptSSOLogin=true`;
  } else {
    return `${url}&authProvider=mysuni&attemptSSOLogin=true`;
  }
}
