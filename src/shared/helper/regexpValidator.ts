export function isPhoneNumber(phoneNumber: string) {
  const withDash = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
  const withoutDash = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;
  return withDash.test(phoneNumber) || withoutDash.test(phoneNumber);
}