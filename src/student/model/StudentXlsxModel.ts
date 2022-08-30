export class StudentXlsxModel {
  //
  '소속사(Ko)': string = '';
  '소속사(En)': string = '';
  '소속사(Zh)': string = '';
  '소속 조직(팀) (Ko)': string = '';
  '소속 조직(팀) (En)': string = '';
  '소속 조직(팀) (Zh)': string = '';
  '성명': string = '';
  'E-mail': string = '';
  신청시간?: string = '';
  신청일?: string = '';
  '완료 Phase'?: string = '';
  // 'Stamp 획득 여부'?: string = '';
  'Card 이수 여부'?: string = '';
  '차수'?: string = '';
  'Card 이수일'?: string = '';
  상태?: string = '';
  '상태 변경일'?: string = '';
  '재직여부': string = '';

  constructor(studentXlsx: StudentXlsxModel) {
    //
    if (studentXlsx) {
      const 신청시간 = studentXlsx['상태 변경일'] && Object.assign(this, { ...studentXlsx });
    }
  }
}
