import { decorate, observable } from 'mobx';
import moment from 'moment';
import { NameValueList, PatronKey } from '@nara.platform/accent';

import { DramaEntityObservableModel, PolyglotModel } from 'shared/model';
import { Language, getPolyglotToAnyString } from 'shared/components/Polyglot';

import { ExtraWorkState } from 'student/model/vo/ExtraWorkState';

import { StudentProfileModel } from '../../card/student/model/vo/StudentProfileModel';
import { displayResultLearningState } from '../../card/student/ui/logic/CardStudentHepler';
import { CubeStudentXlsxModel, StudentResultXlsxModel } from '../../card/student/model/vo/StudentXlsxModel';

import { ProposalState } from './vo/ProposalState';
import { LearningState } from './vo/LearningState';
import { JoinRequest } from './vo/JoinRequest';
import { ServiceType } from './vo/ServiceType';
import ExtraWork from './vo/ExtraWork';

import { StudentCdoModel } from './StudentCdoModel';
import { StudentXlsxModel } from './StudentXlsxModel';
import { StudentScoreModel } from './StudentScoreModel';
import { StudentXlsxForTestModel } from './StudentXlsxForTestModel';
import { StudentWithUserIdentity } from './StudentWithUserIdentity';

export class StudentModel implements DramaEntityObservableModel {
  //
  id: string = '';
  entityVersion: number = 0;
  patronKey: PatronKey = {} as PatronKey;

  name: string = '';
  email: string = '';
  company: string = '';
  department: string = '';
  proposalState: ProposalState = ProposalState.Approved;
  learningState: LearningState = LearningState.Progress;
  sessionId: string = '';
  isFinishMedia: boolean = false;
  studentScore: StudentScoreModel = new StudentScoreModel();
  registeredTime: number = 0;
  modifiedTime: number = 0;
  passedTime: number = 0;
  programLectureUsid: string = '';
  courseLectureUsid: string = '';
  joinRequests: JoinRequest[] = [];
  markComplete: boolean = false;
  rollBookId: string = '';
  examAttendance: boolean = false;
  modifiedTimeForTest: number = 0;
  homeworkFileBoxId: string = '';

  homeworkContent: string = '';
  homeworkOperatorComment: string = '';
  homeworkOperatorFileBoxId: string = '';

  stamped: boolean = false;
  lectureId: string = '';
  serviceType: ServiceType = ServiceType.Empty;
  leaderEmails: string[] = [];
  url: string = '';

  phaseCount: number = 0;
  completePhaseCount: number = 0;
  surveyAnswerCount: number = 0;

  // 2021-03-29 ????????? ?????? ( ??????, ??????, ?????? ?????? )
  extraWork: ExtraWork = new ExtraWork();
  round: number = 0;

  constructor(student?: StudentModel) {
    //
    if (student) {
      const proposalState = (student.proposalState && student.proposalState) || ProposalState.Approved;
      const learningState = (student.learningState && student.learningState) || LearningState.Progress;
      const studentScore = (student.studentScore && new StudentScoreModel(student.studentScore)) || this.studentScore;
      const serviceType = (student.serviceType && student.serviceType) || ServiceType.Empty;
      Object.assign(this, {
        ...student,
        proposalState,
        learningState,
        studentScore,
        serviceType,
      });
    }
  }

  static asCdo(student: StudentModel): StudentCdoModel {
    //
    return {
      rollBookId: student.rollBookId,
      name: student.name,
      email: student.email,
      company: student.company,
      department: student.department,
      proposalState: student.proposalState,
      programLectureUsid: student.programLectureUsid,
      courseLectureUsid: student.courseLectureUsid,
      lectureUsid: student.lectureId,
      learningState: student.learningState,
      serviceType: student.serviceType,
      leaderEmails: student.leaderEmails,
      url: student.url,
    };
  }

  public static getStateName(proposalState: ProposalState, learningState?: LearningState) {
    //
    if (proposalState && proposalState === 'Approved') {
      return '??????' + (learningState === LearningState.Progress ? '(?????????)' : '');
    }
    if (proposalState && proposalState === 'Submitted') {
      return '????????????';
    }
    if (proposalState && proposalState === 'Canceled') {
      return '??????';
    }
    if (proposalState && proposalState === 'Rejected') {
      return '??????';
    }
    return '';
  }

  public static getLearningStateName(learningState: LearningState) {
    //
    if (learningState && learningState === 'Progress') {
      return '???????????? ??????';
    }
    // if (learningState && learningState === 'Waiting') {
    //   return '???????????? ??????';
    // }
    if (learningState && learningState === 'Passed') {
      return '??????';
    }
    if (learningState && learningState === 'Missed') {
      return '?????????';
    }
    if (learningState && learningState === 'NoShow') {
      return '??????';
    }
    return '';
  }

  public static getStampedName(stamped: boolean): string {
    //
    if (stamped) {
      return 'Y';
    }
    return 'N';
  }

  static asXLSXForCard(studentWiths: StudentWithUserIdentity): StudentXlsxModel {
    //
    const { student, userIdentity } = studentWiths;

    return {
      '?????????(Ko)': userIdentity.companyName.ko || '-',
      '?????????(En)': userIdentity.companyName.en || '-',
      '?????????(Zh)': userIdentity.companyName.zh || '-',
      '?????? ??????(???) (Ko)': userIdentity.departmentName.ko || '-',
      '?????? ??????(???) (En)': userIdentity.departmentName.en || '-',
      '?????? ??????(???) (Zh)': userIdentity.departmentName.zh || '-',
      ??????: student.name || '-',
      'E-mail': userIdentity.email,
      /*?????????: new Date(student.creationTime).toISOString().substr(0, 10) + ' ' + new Date(student.creationTime).toLocaleTimeString('en-GB'),*/
      ?????????: moment(student.registeredTime).format('YYYY.MM.DD HH:mm:ss') || '-',
      '?????? Phase': student.completePhaseCount + '/' + student.phaseCount,
      // 'Stamp ?????? ??????': this.getStampedName(student.stamped),
      'Card ?????? ??????': this.getLearningStateName(student.learningState),
      'Card ?????????':
        student.modifiedTime === 0 || !student.modifiedTime
          ? '-'
          : this.getLearningStateName(student.learningState) === '??????'
          ? moment(student.modifiedTime).format('YYYY.MM.DD HH:mm:ss')
          : '-',
      ????????????: userIdentity && userIdentity.id && userIdentity.id !== '' ? 'Y' : 'N',
    };
  }

  static asXLSXForTest(
    studentWiths: StudentWithUserIdentity,
    paperId: string,
    reportName: PolyglotModel,
    fileBoxId: string,
    surveyId: string
  ): StudentXlsxForTestModel {
    //
    const { student, userIdentity } = studentWiths;

    let reportScore = '-';
    let surveyState = '-';

    if (studentWiths.student.extraWork.reportStatus) {
      if (
        studentWiths.student.extraWork.reportStatus === ExtraWorkState.Pass ||
        studentWiths.student.extraWork.reportStatus === ExtraWorkState.Fail
      ) {
        reportScore = String(studentWiths.student.studentScore.homeworkScore);
      } else if (studentWiths.student.extraWork.reportStatus === ExtraWorkState.Submit) {
        reportScore = '?????????';
      }
    } else if (reportName || fileBoxId) {
      reportScore = '?????????';
    }

    if (surveyId) {
      if (
        student.extraWork.surveyStatus !== null &&
        (student.extraWork.surveyStatus === ExtraWorkState.Submit ||
          student.extraWork.surveyStatus === ExtraWorkState.Pass)
      ) {
        surveyState = 'Y';
      } else {
        surveyState = 'N';
      }
    }

    return {
      '?????????(Ko)': userIdentity.companyName.ko || '-',
      '?????????(En)': userIdentity.companyName.en || '-',
      '?????????(Zh)': userIdentity.companyName.zh || '-',
      '?????? ??????(???) (Ko)': userIdentity.departmentName.ko || '-',
      '?????? ??????(???) (En)': userIdentity.departmentName.en || '-',
      '?????? ??????(???) (Zh)': userIdentity.departmentName.zh || '-',
      ??????: student.name || '-',
      'E-mail': userIdentity.email,
      ????????????: paperId
        ? (student.studentScore &&
            student.studentScore.testScoreList &&
            student.studentScore.testScoreList.length > 0 &&
            String(student.studentScore.latestScore)) ||
          '?????????'
        : '-',
      ????????????: paperId
        ? (student.studentScore &&
            student.studentScore.numberOfTrials &&
            String(student.studentScore.numberOfTrials)) ||
          '0'
        : '-',
      ????????????: reportScore,
      '?????? Phase': `${student.completePhaseCount} / ${student.phaseCount}`,
      ????????????: this.getLearningStateName(student.learningState),
      ????????????: surveyState,
      /*"Status Change Date": new Date(student.updateTime).toISOString().substr(0, 10) + ' ' + new Date(student.updateTime).toLocaleTimeString('en-GB'),*/
      '?????? ?????????': moment(student.modifiedTime).format('YYYY.MM.DD HH:mm:ss') || '-',
      ????????????: userIdentity && userIdentity.id && userIdentity.id !== '' ? 'Y' : 'N',
    };
  }

  static asCubeStudentXLSX(
    studentWithUserIdentity: StudentWithUserIdentity,
    studentProfile: Map<string, StudentProfileModel>
  ): CubeStudentXlsxModel {
    //
    return {
      ?????????: getPolyglotToAnyString(studentWithUserIdentity.userIdentity.companyName) || '',
      '?????? ??????(???)': getPolyglotToAnyString(studentWithUserIdentity.userIdentity.departmentName) || '',
      ??????: studentWithUserIdentity.student.name,
      'E-mail': studentWithUserIdentity.userIdentity.email,
      /*Time of Application: new Date(student.creationTime).toISOString().substr(0, 10) + ' ' + new Date(student.creationTime).toLocaleTimeString('en-GB'),*/
      ????????????: moment(studentWithUserIdentity.student.registeredTime).format('YYYY.MM.DD HH:mm:ss') || '-',
      ??????: this.getStateName(
        studentWithUserIdentity.student.proposalState,
        studentWithUserIdentity.student.learningState
      ),
      ??????: studentWithUserIdentity.student.round.toString(),
      /*Status Change Date: new Date(student.updateTime).toISOString().substr(0, 10) + ' ' + new Date(student.updateTime).toLocaleTimeString('en-GB'),*/
      '?????? ?????????': moment(studentWithUserIdentity.student.modifiedTime).format('YYYY.MM.DD HH:mm:ss') || '-',
      ????????????:
        studentWithUserIdentity.userIdentity &&
        studentWithUserIdentity.userIdentity.id &&
        studentWithUserIdentity.userIdentity.id !== ''
          ? 'Y'
          : 'N',
    };
  }

  static asCubeStudentsResultXLSX(
    studentWithUserIdentity: StudentWithUserIdentity,
    { reportName = '', fileBoxId = '', surveyId = '' }
  ): StudentResultXlsxModel {
    //

    const testScore =
      studentWithUserIdentity.student.extraWork &&
      studentWithUserIdentity.student.extraWork.testStatus &&
      studentWithUserIdentity.student.extraWork.testStatus !== ExtraWorkState.Save
        ? (studentWithUserIdentity.student.studentScore &&
            studentWithUserIdentity.student.studentScore.testScoreList.length > 0 &&
            String(
              studentWithUserIdentity.student.studentScore.testScoreList[
                studentWithUserIdentity.student.studentScore.testScoreList.length - 1
              ]
            )) ||
          '?????????'
        : '-';
    const numberOfTrials =
      studentWithUserIdentity.student.extraWork &&
      studentWithUserIdentity.student.extraWork.testStatus &&
      studentWithUserIdentity.student.extraWork.testStatus !== ExtraWorkState.Save
        ? (studentWithUserIdentity.student.studentScore &&
            studentWithUserIdentity.student.studentScore.numberOfTrials &&
            String(studentWithUserIdentity.student.studentScore.numberOfTrials)) ||
          '0'
        : '-';

    let reportScore = '-';

    if (studentWithUserIdentity.student.extraWork.reportStatus) {
      if (
        studentWithUserIdentity.student.extraWork.reportStatus === ExtraWorkState.Pass ||
        studentWithUserIdentity.student.extraWork.reportStatus === ExtraWorkState.Fail
      ) {
        reportScore = String(studentWithUserIdentity.student.studentScore.homeworkScore);
      } else if (studentWithUserIdentity.student.extraWork.reportStatus === ExtraWorkState.Submit) {
        reportScore = '?????????';
      }
    } else if (reportName || fileBoxId) {
      reportScore = '?????????';
    }

    let surveyState = '-';

    if (surveyId) {
      if (
        studentWithUserIdentity.student.extraWork.surveyStatus !== null &&
        (studentWithUserIdentity.student.extraWork.surveyStatus === ExtraWorkState.Submit ||
          studentWithUserIdentity.student.extraWork.surveyStatus === ExtraWorkState.Pass)
      ) {
        surveyState = 'Y';
      } else {
        surveyState = 'N';
      }
    }

    return {
      // Company: getPolyglotToString(studentWithUserIdentity.userIdentity.companyName) || '',
      '????????? (Ko)': studentWithUserIdentity.userIdentity.companyName.getValue(Language.Ko),
      '????????? (En)': studentWithUserIdentity.userIdentity.companyName.getValue(Language.En),
      '????????? (Zh)': studentWithUserIdentity.userIdentity.companyName.getValue(Language.Zh),
      // 'Department (Team)': getPolyglotToString(studentWithUserIdentity.userIdentity.departmentName) || '',
      '?????? ??????(???) (Ko)': studentWithUserIdentity.userIdentity.departmentName.getValue(Language.Ko),
      '?????? ??????(???) (En)': studentWithUserIdentity.userIdentity.departmentName.getValue(Language.En),
      '?????? ??????(???) (Zh)': studentWithUserIdentity.userIdentity.departmentName.getValue(Language.Zh),
      // Name: getPolyglotToString(studentWithUserIdentity.student.name),
      ??????: studentWithUserIdentity.student.name,
      'E-mail': studentWithUserIdentity.userIdentity.email,
      ????????????: testScore,
      ????????????: numberOfTrials,
      ????????????: reportScore,
      ????????????: displayResultLearningState(studentWithUserIdentity.student.learningState),
      ????????????: surveyState,
      ??????: studentWithUserIdentity.student.round ? studentWithUserIdentity.student.round.toString() : undefined,
      ???????????????:
        studentWithUserIdentity.student.modifiedTime === 0
          ? ''
          : moment(studentWithUserIdentity.student.modifiedTime).format('YYYY.MM.DD HH:mm:ss'),
      ????????????:
        studentWithUserIdentity.userIdentity &&
        studentWithUserIdentity.userIdentity.id &&
        studentWithUserIdentity.userIdentity.id !== ''
          ? 'Y'
          : 'N',
    };
  }

  static asNameValuesList(student: StudentModel): NameValueList {
    const asNameValues = {
      nameValues: [
        {
          name: 'name',
          value: JSON.stringify(student.name),
        },
        {
          name: 'email',
          value: student.email,
        },
        {
          name: 'company',
          value: student.company,
        },
        {
          name: 'department',
          value: student.department,
        },
        {
          name: 'proposalState',
          value: student.proposalState,
        },
        {
          name: 'learningState',
          value: student.learningState,
        },
        {
          name: 'score',
          value: String(student.studentScore),
        },
        {
          name: 'modifiedTime',
          value: String(student.modifiedTime),
        },
        {
          name: 'programLectureUsid',
          value: String(student.programLectureUsid),
        },
        {
          name: 'courseLectureUsid',
          value: String(student.courseLectureUsid),
        },
        {
          name: 'joinRequests',
          value: JSON.stringify(student.joinRequests),
        },
        {
          name: 'rollBookId',
          value: String(student.rollBookId),
        },
        {
          name: 'examAttendance',
          value: String(student.examAttendance),
        },
        {
          name: 'modifiedTimeForTest',
          value: String(student.modifiedTimeForTest),
        },
        {
          name: 'homeworkFileBoxId',
          value: student.homeworkFileBoxId,
        },
      ],
    };
    return asNameValues;
  }
}

decorate(StudentModel, {
  id: observable,
  entityVersion: observable,
  patronKey: observable,

  name: observable,
  email: observable,
  company: observable,
  department: observable,
  proposalState: observable,
  learningState: observable,
  sessionId: observable,
  isFinishMedia: observable,
  studentScore: observable,
  registeredTime: observable,
  modifiedTime: observable,
  programLectureUsid: observable,
  courseLectureUsid: observable,
  joinRequests: observable,
  markComplete: observable,
  rollBookId: observable,
  examAttendance: observable,
  modifiedTimeForTest: observable,
  homeworkFileBoxId: observable,
  stamped: observable,
  lectureId: observable,
  serviceType: observable,
  phaseCount: observable,
  completePhaseCount: observable,
  homeworkContent: observable,
  homeworkOperatorComment: observable,
  homeworkOperatorFileBoxId: observable,
  surveyAnswerCount: observable,

  extraWork: observable,
});
