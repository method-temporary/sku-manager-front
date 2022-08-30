export const getManagerHostName = () => {
  const { hostname } = window.location;
  return hostname;
};

export const getUserHostName = () => {
  const { hostname } = window.location;
  const regExp = /star/;
  const regExp2 = /-/;
  let returnVal = hostname.replace(regExp, '');
  returnVal = returnVal.replace(regExp2, '');
  if (returnVal[0] === '.') {
    returnVal = returnVal.slice(1, returnVal.length);
  }
  return returnVal;
};
