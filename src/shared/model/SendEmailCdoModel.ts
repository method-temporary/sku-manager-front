import StudentByCubeRdo from 'student/model/StudentByCubeRdo';
import { StudentCardRdoModel } from 'student/model/StudentCardRdoModel';

export class SendEmailCdoModel {
  emails: string[] = [];
  names: string[] = [];
  dispatcherName: string = '';
  dispatcherEmail: string = '';
  sendTemplate = {
    mailTitle: '', // 메일타이틀
    cubeName: '', // 과정명
    type: '', // Cube_learning, Course_learning, Cube_approve, Course_approve 조회 시 필요
    body: '', // 메일내용
    infoJson: '', // html 보내면 body 에 html로 표현
    sendDate: '',
    createDate: '',
  };

  sendType: string = '';
  senderEmail: string = '';
}

export class CubeStudentSendEmailOrSmsCdo {
  deliveryType: string = '';
  studentIds?: string[] = [];
  studentEmailFormat? = {
    mailContents: '',
    operatorEmail: '',
    operatorName: '',
    subject: '',
    templateExists: true,
    usingTemplate: true,
    title: '',
  };

  studentSmsFormat? = {
    operatorName: '',
    operatorPhone: '',
    smsContents: '',
  };

  cubeStudentRdo?: StudentByCubeRdo = undefined;
}

export class CardStudentSendEmailOrSmsCdo {
  deliveryType: string = '';
  studentIds?: string[] = [];
  studentEmailFormat? = {
    mailContents: '',
    operatorEmail: '',
    operatorName: '',
    subject: '',
    templateExists: true,
    usingTemplate: true,
    title: '',
  };

  studentSmsFormat? = {
    operatorName: '',
    operatorPhone: '',
    smsContents: '',
  };

  cardStudentRdo?: StudentCardRdoModel = undefined;
}
