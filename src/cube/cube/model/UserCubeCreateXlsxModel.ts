export class UserCubeCreateXlsxModel {
  //
  No: string = '';
  '소속사 (Ko)': string = '';
  '소속사 (En)': string = '';
  '소속사 (Zh)': string = '';
  '조직 (Ko)': string = '';
  '조직 (En)': string = '';
  '조직 (Zh)': string = '';
  신청자: string = '';
  '신청자 E-mail': string = '';
  '과정명 (Ko)': string = '';
  '과정명 (En)': string = '';
  '과정명 (Zh)': string = '';
  '교육시간': string = '';
  요청일자: string = '';
  상태: string = '';
  // 승인자: string = '';
  처리일자: string = '';

  constructor(cubeXlsx: UserCubeCreateXlsxModel) {
    //
    if (cubeXlsx) {
      Object.assign(this, { ...cubeXlsx });
    }
  }
}
