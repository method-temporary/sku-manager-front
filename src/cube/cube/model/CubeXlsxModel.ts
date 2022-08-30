export class CubeXlsxModel {
  //
  No: string = '';
  'Cube명(Kor)': string = '';
  'Cube명(Eng)': string = '';
  'Cube명(China)': string = '';
  'Cube명(Frans)': string = '';
  'Cube명(Mgz)': string = '';
  'Cube명(Esp)': string = '';
  'Cube명(Poc)': string = '';
  'Cube명(Pol)': string = '';
  'Cube명(일본어)': string = '';
  '교육형태': string = '';
  Channel: string = '';
  '교육기관'?: string = '';
  학습인원?: number = 0;
  '이수인원'?: number = 0;
  //별점: string = '';
  '등록일자': string = '';
  사용카드수: string = '';
  '생성자 (Ko)': string = '';
  '생성자 (En)': string = '';
  '생성자 (Zh)': string = '';
  사용여부: string = '';

  constructor(cubeXlsx: CubeXlsxModel) {
    //
    if (cubeXlsx) {
      Object.assign(this, { ...cubeXlsx });
    }
  }
}
