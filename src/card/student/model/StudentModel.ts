import moment from 'moment';
import { decorate, observable } from 'mobx';

import { PatronKey } from '@nara.platform/accent';

import { ProposalState, DramaEntityObservableModel } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { LearningState } from '../../../lecture/student/model/LearningState';
import ExtraWork from './vo/ExtraWork';
import { JoinRequest } from './vo/JoinRequest';
import { StudentScoreModel } from './vo/StudentScoreModel';
import { StudentProfileModel } from './vo/StudentProfileModel';
import { displayLearningState } from '../../../lecture/student/ui/logic/StudentHelper';
import { StudentXlsxModel } from './vo/StudentXlsxModel';

export class StudentModel implements DramaEntityObservableModel {
  //
  entityVersion: number = 0;
  patronKey: PatronKey = {} as PatronKey;

  complete: boolean = false;
  completePhaseCount: number = 0;

  creationTime: number = 0;

  durationViewSeconds: string = '';

  enrolledState: string = '';

  examAttendance: boolean = false;
  extraWork: ExtraWork = new ExtraWork();
  finishMedia: boolean = false;
  hideYn: boolean = false;
  homeworkContent: string = '';
  homeworkFileBoxId: string = '';
  homeworkOperatorComment: string = '';
  homeworkOperatorFileBoxId: string = '';
  id: string = '';
  joinRequests: JoinRequest[] = [];

  learningState: LearningState = LearningState.Empty;
  lectureId: string = '';
  name: string = '';

  phaseCount: number = 0;

  proposalState: ProposalState = ProposalState.All;
  round: number = 0;

  sessionId: string = '';
  stamped: boolean = false;
  studentScore: StudentScoreModel = new StudentScoreModel();
  studentType: string = 'Card';
  sumViewSeconds: string = '';
  updateTime: number = 0;
  updateTimeForTest: number = 0;

  company: string = '';
  department: string = '';
  email: string = '';

  selected: boolean = false;

  constructor(student?: StudentModel) {
    //
    if (student) {
      const proposalState = (student.proposalState && student.proposalState) || ProposalState.Approved;
      const learningState = (student.learningState && student.learningState) || LearningState.Progress;
      const studentScore = (student.studentScore && new StudentScoreModel(student.studentScore)) || this.studentScore;
      Object.assign(this, {
        ...student,
        proposalState,
        learningState,
        studentScore,
      });
    }
  }

  static asXLSX(student: StudentModel, studentProfile: Map<string, StudentProfileModel>): StudentXlsxModel {
    //
    const profile = studentProfile.get(student.patronKey.keyString);

    return {
      소속사: profile ? getPolyglotToAnyString(profile.company) : '',
      '소속 조직(팀)': profile ? getPolyglotToAnyString(profile.department) : '',
      성명: student.name,
      'E-mail': profile ? profile.email : '',
      신청일: moment(student.creationTime).format('YYYY.MM.DD HH:mm:ss') || '-',
      '완료 Phase': student.completePhaseCount + '/' + student.phaseCount,
      'Stamp 획득 여부': student.stamped ? 'Y' : 'N',
      'Course 이수 여부': displayLearningState(student.learningState),
      'Course 이수일':
        student.updateTimeForTest === 0 ? '-' : moment(student.updateTimeForTest).format('YYYY.MM.DD HH:mm:ss'),
    };
  }

  // static asCubeStudentXLSX(
  //   student: StudentModel,
  //   studentProfile: Map<string, StudentProfileModel>
  // ): CubeStudentXlsxModel {
  //   //
  //   const profile = studentProfile.get(student.patronKey.keyString);
  //
  //   return {
  //     소속사: profile ? getPolyglotToAnyString(profile.company) : '',
  //     '소속 조직(팀)': profile ? getPolyglotToAnyString(profile.department) : '',
  //     성명: student.name,
  //     'E-mail': profile ? profile.email : '',
  //     /*신청시간: new Date(student.creationTime).toISOString().substr(0, 10) + ' ' + new Date(student.creationTime).toLocaleTimeString('en-GB'),*/
  //     신청시간: moment(student.creationTime).format('YYYY.MM.DD HH:mm:ss') || '-',
  //     상태: this.getStateName(student.proposalState, student.learningState),
  //     /*상태변경일: new Date(student.updateTime).toISOString().substr(0, 10) + ' ' + new Date(student.updateTime).toLocaleTimeString('en-GB'),*/
  //     '상태 변경일': moment(student.updateTime).format('YYYY.MM.DD HH:mm:ss') || '-',
  //   };
  // }

  // static asResultXLSX(
  //   cardContentsQuery: CardContentsQueryModel,
  //   student: StudentModel,
  //   studentProfile: Map<string, StudentProfileModel>
  // ): StudentResultXlsxModel {
  //   //
  //   const profile = studentProfile.get(student.patronKey.keyString);
  //
  //   const examId =
  //     cardContentsQuery.tests && cardContentsQuery.tests.length > 0 ? cardContentsQuery.tests[0].testId : '';
  //   const reportName = cardContentsQuery.reportFileBox ? cardContentsQuery.reportFileBox.reportName : '';
  //   const reportFileBoxId = cardContentsQuery.reportFileBox ? cardContentsQuery.reportFileBox.fileBoxId : '';
  //
  //   return {
  //     Company: profile ? getPolyglotToString(profile.company) : '',
  //     'Department (Team)': profile ? getPolyglotToString(profile.department) : '',
  //     Name: student.name,
  //     'E-mail': profile ? profile.email : '',
  //     'Test Results': examId
  //       ? (student.studentScore &&
  //           student.studentScore.testScoreList.length > 0 &&
  //           String(student.studentScore.latestScore)) ||
  //         '미응시'
  //       : '-',
  //     'Number of Tests Taken': examId
  //       ? (student.studentScore &&
  //           student.studentScore.numberOfTrials &&
  //           String(student.studentScore.numberOfTrials)) ||
  //         '0'
  //       : '-',
  //     'Assignment Scores':
  //       reportName || reportFileBoxId
  //         ? (student.studentScore &&
  //             student.studentScore.homeworkScore &&
  //             String(student.studentScore.homeworkScore)) ||
  //           '없음'
  //         : '-',
  //     'Completion Status': displayResultLearningState(student.learningState),
  //     'Survey Results': student.extraWork.surveyStatus === ExtraWorkState.Pass ? 'Y' : 'N',
  //     'Status Change Date': student.updateTime === 0 ? '' : moment(student.updateTime).format('YYYY.MM.DD HH:mm:ss'),
  //   };
  // }

  // static asCubeStudentsResultXLSX(
  //   student: StudentModel,
  //   studentProfile: Map<string, StudentProfileModel>,
  //   { examId = '', reportName = '', fileBoxId = '' }
  // ): StudentResultXlsxModel {
  //   //
  //   const profile = studentProfile.get(student.patronKey.keyString);
  //
  //   // const examId =
  //   //   cardContentsQuery.tests && cardContentsQuery.tests.length > 0 ? cardContentsQuery.tests[0].testId : '';
  //   // const reportName = cardContentsQuery.reportFileBox ? cardContentsQuery.reportFileBox.reportName : '';
  //   // const reportFileBoxId = cardContentsQuery.reportFileBox ? cardContentsQuery.reportFileBox.fileBoxId : '';
  //
  //   return {
  //     Company: profile ? getPolyglotToString(profile.company) : '',
  //     'Department (Team)': profile ? getPolyglotToString(profile.department) : '',
  //     Name: student.name,
  //     'E-mail': profile ? profile.email : '',
  //     'Test Results': examId
  //       ? (student.studentScore &&
  //           student.studentScore.testScoreList.length > 0 &&
  //           String(student.studentScore.latestScore)) ||
  //         '미응시'
  //       : '-',
  //     'Number of Tests Taken': examId
  //       ? (student.studentScore &&
  //           student.studentScore.numberOfTrials &&
  //           String(student.studentScore.numberOfTrials)) ||
  //         '0'
  //       : '-',
  //     'Assignment Scores':
  //       reportName || fileBoxId
  //         ? (student.studentScore &&
  //             student.studentScore.homeworkScore &&
  //             String(student.studentScore.homeworkScore)) ||
  //           '없음'
  //         : '-',
  //     'Completion Status': displayResultLearningState(student.learningState),
  //     'Survey Results': student.extraWork.surveyStatus === ExtraWorkState.Pass ? 'Y' : 'N',
  //     'Status Change Date': student.updateTime === 0 ? '' : moment(student.updateTime).format('YYYY.MM.DD HH:mm:ss'),
  //   };
  // }

  public static getStateName(proposalState: ProposalState, learningState?: LearningState) {
    //
    if (proposalState && proposalState === 'Approved') {
      return '승인' + (learningState === LearningState.Progress ? '(학습중)' : '');
    }
    if (proposalState && proposalState === 'Submitted') {
      return '승인대기';
    }
    if (proposalState && proposalState === 'Canceled') {
      return '취소';
    }
    if (proposalState && proposalState === 'Rejected') {
      return '반려';
    }
    return '';
  }
}

decorate(StudentModel, {
  complete: observable,
  completePhaseCount: observable,
  creationTime: observable,
  durationViewSeconds: observable,
  enrolledState: observable,
  examAttendance: observable,
  extraWork: observable,
  finishMedia: observable,
  hideYn: observable,
  homeworkContent: observable,
  homeworkFileBoxId: observable,
  homeworkOperatorComment: observable,
  homeworkOperatorFileBoxId: observable,
  id: observable,
  joinRequests: observable,
  learningState: observable,
  lectureId: observable,
  name: observable,
  phaseCount: observable,
  proposalState: observable,
  round: observable,
  sessionId: observable,
  stamped: observable,
  studentScore: observable,
  studentType: observable,
  sumViewSeconds: observable,
  updateTime: observable,
  updateTimeForTest: observable,
  selected: observable,
});
