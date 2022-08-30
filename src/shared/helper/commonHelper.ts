function getSkUniSuperRole() {
  // SK University 의 SuperManager 권한 가진 사람만 수정가능하게
  // SK University = id:ne1-m2-c2
  let skUniRole = [''];
  const workspaces = localStorage.getItem('nara.workspaces');
  if (workspaces !== null) {
    const cineroomWorkspaces = JSON.parse(workspaces!).cineroomWorkspaces!;
    cineroomWorkspaces?.forEach((item: any) => {
      if (item.id === 'ne1-m2-c2') {
        skUniRole = item.roles; // ["User","SuperManager"]
      }
    });
  }
  return skUniRole;
}

function chkEmailAddr(email: string) {
  // const pattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  const pattern = /^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\.[A-Za-z0-9-]+/;
  return pattern.test(email);
}

export function getEmailWithDash(phone: string) {
  //
  if (phone.length === 11) {
    return `${phone.substring(0, 3)}-${phone.substring(3, 7)}-${phone.substring(7)}`;
  } else if (phone.length === 10) {
    return `${phone.substring(0, 3)}-${phone.substring(3, 6)}-${phone.substring(6)}`;
  }

  return phone;
}

export function replaceAll(str: string, regex: string, replacement: string): string {
  let result = str;

  while (result.indexOf(regex) > -1) {
    result = result
      .substring(0, result.indexOf(regex))
      .concat(replacement)
      .concat(result.substring(result.indexOf(regex) + regex.length));
  }

  return result;
}

export function encodingUrlBrackets(str: string): string {
  let result = str;

  if (str === '') return str;

  result = replaceAll(result, '[', '%5B');
  result = replaceAll(result, ']', '%5D');

  return result;
}

export default {
  getSkUniSuperRole,
  chkEmailAddr,
};
