import { decorate, observable } from 'mobx';

import { NameValueList } from '@nara.platform/accent';

import {
  SearchFilter,
  CardStudentSendEmailOrSmsCdo,
  CubeStudentSendEmailOrSmsCdo,
  SendEmailCdoModel,
} from 'shared/model';

import StudentByCubeRdo from 'student/model/StudentByCubeRdo';
import { StudentCardRdoModel } from 'student/model/StudentCardRdoModel';
import { LearningState } from 'student/model/vo/LearningState';

export class SendEmailModel {
  //
  emails: string[] = [];
  names: string[] = [];
  studentIds?: string[] = [];
  title: string = '';
  cubeName: string = '';
  type: string = '';
  mailContents: string = '';
  searchFilter: SearchFilter = SearchFilter.SearchOn;
  sendType: string = '1';
  senderName: string = '';
  senderEmail: string = '';
  cubeTitles: string[] = [];
  dispatcherName: string = '';
  dispatcherEmail: string = '';

  constructor(emails?: SendEmailModel) {
    //
    if (emails) {
      Object.assign(this, { ...emails });
    }
  }

  static asCdo(emails: SendEmailModel): SendEmailCdoModel {
    let sendName = '';
    let sendEmail = '';
    if (emails.searchFilter === SearchFilter.SearchOn) {
      sendName = 'mySUNI';
      sendEmail = 'mysuni_admin@sk.com';
    } else {
      sendName = emails.dispatcherName;
      sendEmail = emails.dispatcherEmail;
      // sendName = emails.senderName;
      // sendEmail = emails.senderEmail;
    }
    if (emails.sendType === '2') {
      sendName = '';
      sendEmail = '';
    }

    return {
      emails: emails.emails,
      names: emails.names,
      dispatcherName: sendName,
      dispatcherEmail: sendEmail,
      sendTemplate: {
        mailTitle: emails.title,
        cubeName: emails.cubeName, // 과정명
        type: emails.type, // Cube_learning, Course_learning, Cube_approve, Course_approve 조회 시 필요
        body: emails.mailContents, // 메일내용
        infoJson: '', // html 보내면 body 에 html로 표현
        sendDate: '',
        createDate: '',
      },
      sendType: emails.sendType,
      senderEmail: emails.senderEmail,
    };
  }

  static asRjCdo(emails: SendEmailModel): SendEmailCdoModel[] {
    let sendName = '';
    let sendEmail = '';
    if (emails.searchFilter === SearchFilter.SearchOn) {
      sendName = 'mySUNI';
      sendEmail = 'mysuni@mysuni.sk.com';
    } else {
      sendName = emails.dispatcherName;
      sendEmail = emails.dispatcherEmail;
      // sendName = emails.senderName;
      // sendEmail = emails.senderEmail;
    }

    const rjList: SendEmailCdoModel[] = [];

    emails.cubeTitles?.forEach((item, idx) => {
      rjList.push({
        emails: [emails.emails[idx]],
        names: [emails.names[idx]],
        dispatcherName: sendName,
        dispatcherEmail: sendEmail,
        sendTemplate: {
          mailTitle: emails.title,
          cubeName: item, // 과정명
          type: emails.type, // Cube_learning, Course_learning, Cube_approve, Course_approve 조회 시 필요
          body: emails.mailContents, // 메일내용
          infoJson: '', // html 보내면 body 에 html로 표현
          sendDate: '',
          createDate: '',
        },
        sendType: emails.sendType,
        senderEmail: emails.senderEmail,
      });
    });

    return rjList;
  }

  static asNameValueList(emails: any): NameValueList {
    //
    const asNameValues = {
      nameValues: [
        {
          name: 'emails',
          value: emails.emails,
        },
        {
          name: 'names',
          value: emails.names,
        },
      ],
    };
    return asNameValues;
  }

  static asCubeStudentSendEmailOrSmsCdo(
    emails: SendEmailModel,
    studentByCubeRdo?: StudentByCubeRdo
  ): CubeStudentSendEmailOrSmsCdo {
    let sendName = '';
    let sendEmail = '';
    if (emails.searchFilter === SearchFilter.SearchOn) {
      sendName = 'mySUNI';
      sendEmail = 'mysuni@mysuni.sk.com';
    } else {
      sendName = emails.senderName;
      sendEmail = emails.senderEmail;
    }
    if (emails.sendType === '2') {
      sendName = '';
      sendEmail = '';
    }

    return {
      deliveryType: 'Email',
      studentIds: emails.studentIds,
      studentEmailFormat: {
        mailContents: emails.mailContents, // 메일내용
        operatorEmail: sendEmail,
        operatorName: sendName,
        subject: '',
        templateExists: emails.sendType === '1',
        usingTemplate: emails.sendType === '1',
        title: emails.title,
      },
      cubeStudentRdo: studentByCubeRdo,
    };
  }

  static asCardStudentSendEmailOrSmsCdo(
    emails: SendEmailModel,
    studentCardRdoModel?: StudentCardRdoModel
  ): CardStudentSendEmailOrSmsCdo {
    let sendName = '';
    let sendEmail = '';
    if (emails.searchFilter === SearchFilter.SearchOn) {
      sendName = 'mySUNI';
      sendEmail = 'mysuni@mysuni.sk.com';
    } else {
      sendName = emails.senderName;
      sendEmail = emails.senderEmail;
    }
    if (emails.sendType === '2') {
      sendName = '';
      sendEmail = '';
    }
    if (studentCardRdoModel !== undefined && studentCardRdoModel.learningState === LearningState.Progress) {
      studentCardRdoModel.learningState = [LearningState.Progress];
    }

    return {
      deliveryType: 'Email',
      studentIds: emails.studentIds,
      studentEmailFormat: {
        mailContents: emails.mailContents, // 메일내용
        operatorEmail: sendEmail,
        operatorName: sendName,
        subject: '',
        templateExists: emails.sendType === '1',
        usingTemplate: emails.sendType === '1',
        title: emails.title,
      },
      cardStudentRdo: studentCardRdoModel,
    };
  }
}

decorate(SendEmailModel, {
  emails: observable,
  names: observable,
  studentIds: observable,
  title: observable,
  cubeName: observable,
  type: observable,
  mailContents: observable,
  searchFilter: observable,
  senderName: observable,
  senderEmail: observable,
  cubeTitles: observable,
  sendType: observable,
  dispatcherName: observable,
  dispatcherEmail: observable,
});

export default SendEmailModel;
