export class StudentXlsxModel {
  //
  소속사: string = '';
  '소속 조직(팀)': string = '';
  성명: string = '';
  'E-mail': string = '';
  신청시간?: string = '';
  신청일?: string = '';
  '완료 Phase'?: string = '';
  'Stamp 획득 여부'?: string = '';
  'Course 이수 여부'?: string = '';
  'Course 이수일'?: string = '';
  상태?: string = '';
  '설문 결과'?: string = '';
  '상태 변경일'?: string = '';

  constructor(studentXlsx: StudentXlsxModel) {
    //
    if (studentXlsx) {
      // const Time of Application = studentXlsx['Time of Application'] && Object.assign(this, { ...studentXlsx });
    }
  }
}
