import StudentByCubeRdo from 'student/model/StudentByCubeRdo';
import { StudentCardRdoModel } from 'student/model/StudentCardRdoModel';

export class SendSmsCdoModel {
  studentIds: string[] = [];
  smsContents: string = ''; // 문자 내용
  cubeStudentRdo?: StudentByCubeRdo = undefined;
  cardStudentRdo?: StudentCardRdoModel = undefined;

  names: string[] = [];
  dispatcherName: string = '';
  dispatcherEmail: string = '';
  sendType: string = '';
}
