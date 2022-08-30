export class UserWorkspaceMemberXlsxModel {
  //
  // No: string = '';
  '성명 (Ko)': string = '';
  '성명 (En)': string = '';
  '성명 (Zh)': string = '';
  '사번': string = '';
  연락처: string = '';
  사용자ID: string = '';
  이메일: string = '';
  // 김민준 - 다국어 적용시 변경 필요
  '소속부서명': string = '';
  // '소속부서명 (Ko)': string = '';
  // '소속부서명 (En)': string = '';
  // '소속부서명 (Zh)': string = '';
  // '등록일자': string = '';
  작업구분: string = '';

  constructor(xlsxModel: UserWorkspaceMemberXlsxModel) {
    //
    if (xlsxModel) {
      Object.assign(this, { ...xlsxModel });
    }
  }
}
