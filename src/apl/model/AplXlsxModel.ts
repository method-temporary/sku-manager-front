export class AplXlsxModel {
  //
  No: string = '';
  교육명: string = '';
  'Category / Channel': string = '';
  //교육기간: string = '';
  교육시간: string = '';
  등록일자: string = '';
  생성자: string = '';
  '생성자 E-mail': string = '';
  상태: string = '';
  '승인/반려일자': string = '';

  constructor(aplXlsx: AplXlsxModel) {
    //
    if (aplXlsx) {
      Object.assign(this, { ...aplXlsx });
    }
  }
}
