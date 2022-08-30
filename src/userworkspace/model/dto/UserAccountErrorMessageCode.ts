export enum UserAccountErrorMessageCode {
  CitizenEmailAlreadyExists = 'CitizenEmailAlreadyExists',
}

export function parsingUserAccountErrorMessage(msg: string) {
  switch (msg) {
    case UserAccountErrorMessageCode.CitizenEmailAlreadyExists:
      return '이미 추가된 중복 이메일';
    default:
      return '알 수 없는 오류';
  }
}
