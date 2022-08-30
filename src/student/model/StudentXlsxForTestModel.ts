export class StudentXlsxForTestModel {
  //
  '소속사(Ko)': string = '';
  '소속사(En)': string = '';
  '소속사(Zh)': string = '';
  '소속 조직(팀) (Ko)': string = '';
  '소속 조직(팀) (En)': string = '';
  '소속 조직(팀) (Zh)': string = '';
  '성명': string = '';
  'E-mail': string = '';
  시험성적: string = '';
  응시횟수: string = '';
  과제점수?: string = '';
  '완료 Phase': string = '';
  이수상태: string = '';
  '설문결과': string = '';
  '상태 변경일': string = '';
  '재직여부': string = '';

  constructor(studentXlsx: StudentXlsxForTestModel) {
    //
    if (studentXlsx) {
      studentXlsx['상태 변경일'] && Object.assign(this, { ...studentXlsx });
    }
  }
}
