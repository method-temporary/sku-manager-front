import moment from 'moment';

export class StudentXlsxModel {
  //
  소속사: string = '';
  '소속 조직(팀)': string = '';
  성명: string = '';
  'E-mail': string = '';
  '신청일': string = '';
  '완료 Phase': string = '';
  'Stamp 획득 여부': string = '';
  'Course 이수 여부': string = '';
  'Course 이수일': string = '';
}

export class CubeStudentXlsxModel {
  소속사: string = '';
  '소속 조직(팀)': string = '';
  성명: string = '';
  'E-mail': string = '';
  신청시간: string = '';
  상태: string = '';
  차수?: string = '';
  '상태 변경일': string = '';
  '재직여부': string = '';
}

export class StudentResultXlsxModel {
  //
  '소속사 (Ko)': string = '';
  '소속사 (En)': string = '';
  '소속사 (Zh)': string = '';
  '소속 조직(팀) (Ko)': string = '';
  '소속 조직(팀) (En)': string = '';
  '소속 조직(팀) (Zh)': string = '';
  성명: string = '';
  'E-mail': string = '';
  시험성적: string = '';
  응시횟수: string = '';
  과제점수: string = '';
  이수상태: string = '';
  설문결과: string = '';
  '차수'?: string = '';
  상태변경일: string = '';
  재직여부: string = '';
}
