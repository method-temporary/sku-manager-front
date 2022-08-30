export class StudentXlsxForTestModel {
  //
  소속사: string = '';
  '소속 조직(팀)': string = '';
  성명: string = '';
  'E-mail': string = '';
  시험성적: string = '';
  응시횟수: string = '';
  과제점수?: string = '';
  '완료 Phase': string = '';
  이수상태: string = '';
  '설문 결과'?: string = '';
  '상태 변경일': string = '';

  constructor(studentXlsx: StudentXlsxForTestModel) {
    //
    if (studentXlsx) {
      studentXlsx['상태 변경일'] && Object.assign(this, { ...studentXlsx });
    }
  }
}
