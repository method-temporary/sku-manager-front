import { decorate, observable } from 'mobx';

import { SearchFilter } from 'shared/model';

import StudentByCubeRdo from 'student/model/StudentByCubeRdo';
import { LearningState } from 'student/model/vo/LearningState';
import { StudentCardRdoModel } from 'student/model/StudentCardRdoModel';

import { CardStudentSendEmailOrSmsCdo, CubeStudentSendEmailOrSmsCdo } from './SendEmailCdoModel';

export class SendSmsModel {
  //
  studentIds: string[] = [];
  smsContents: string = '';
  names: string[] = [];
  senderName: string = '';
  senderPhone: string = '';

  title: string = '';
  cubeName: string = '';
  type: string = '';
  searchFilter: SearchFilter = SearchFilter.SearchOn;
  cubeTitles: string[] = [];

  constructor(emails?: SendSmsModel) {
    //
    if (emails) {
      Object.assign(this, { ...emails });
    }
  }

  static asCubeStudentSendEmailOrSmsCdo(
    emails: SendSmsModel,
    studentByCubeRdo?: StudentByCubeRdo
  ): CubeStudentSendEmailOrSmsCdo {
    return {
      deliveryType: 'Sms',
      studentIds: emails.studentIds,
      studentSmsFormat: {
        operatorName: emails.senderName,
        operatorPhone: emails.senderPhone,
        smsContents: emails.smsContents,
      },
      cubeStudentRdo: studentByCubeRdo,
    };
  }

  static asCardStudentSendEmailOrSmsCdo(
    emails: SendSmsModel,
    studentCardRdoModel?: StudentCardRdoModel
  ): CardStudentSendEmailOrSmsCdo {
    if (studentCardRdoModel !== undefined && studentCardRdoModel.learningState === LearningState.Progress) {
      studentCardRdoModel.learningState = [LearningState.Progress];
    }
    return {
      deliveryType: 'Sms',
      studentIds: emails.studentIds,
      studentSmsFormat: {
        operatorName: emails.senderName,
        operatorPhone: emails.senderPhone,
        smsContents: emails.smsContents,
      },
      cardStudentRdo: studentCardRdoModel,
    };
  }
}

decorate(SendSmsModel, {
  studentIds: observable,
  smsContents: observable,
  names: observable,
  senderName: observable,
  senderPhone: observable,

  title: observable,
  cubeName: observable,
  type: observable,
  searchFilter: observable,
  cubeTitles: observable,
});

export default SendSmsModel;
