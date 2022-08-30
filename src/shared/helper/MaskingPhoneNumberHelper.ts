export function maskingPhoneNumber(phoneNumber: string) {
  const originStr = phoneNumber;
  let phoneStr = null;
  let maskingStr;

  if (checkNull(originStr)) {
    return originStr;
  }

  if (originStr.toString().split('-').length != 3) {
    // 1) -가 없는 경우
    phoneStr = originStr.length < 11 ? originStr.match(/\d{10}/gi) : originStr.match(/\d{11}/gi);
    if (checkNull(phoneStr) == true) {
      return originStr;
    }
    if (originStr.length < 11) {
      // 1.1) 0110000000
      maskingStr =
        (phoneStr &&
          originStr
            .toString()
            .replace(phoneStr.toString(), phoneStr.toString().replace(/(\d{3})(\d{3})(\d{4})/gi, '$1***$3'))) ||
        '';
    } else {
      // 1.2) 01000000000
      maskingStr =
        phoneStr &&
        originStr
          .toString()
          .replace(phoneStr.toString(), phoneStr.toString().replace(/(\d{3})(\d{4})(\d{4})/gi, '$1****$3'));
    }
  } else {
    // 2) -가 있는 경우
    phoneStr = originStr.match(/\d{2,3}-\d{3,4}-\d{4}/gi);
    if (checkNull(phoneStr) == true) {
      return originStr;
    }
    if (phoneStr && /-[0-9]{3}-/.test(phoneStr.toString())) {
      // 2.1) 00-000-0000
      maskingStr = originStr
        .toString()
        .replace(phoneStr.toString(), phoneStr.toString().replace(/-[0-9]{3}-/g, '-***-'));
    } else if (phoneStr && /-[0-9]{4}-/.test(phoneStr.toString())) {
      // 2.2) 00-0000-0000
      maskingStr = originStr
        .toString()
        .replace(phoneStr.toString(), phoneStr.toString().replace(/-[0-9]{4}-/g, '-****-'));
    }
  }
  return maskingStr;
}

function checkNull(data: string | RegExpMatchArray | null): boolean {
  return (typeof data === 'undefined' && null && '' && true) || false;
}
