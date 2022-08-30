import { NameValueList, PatronKey } from '@nara.platform/accent';
import { decorate, observable } from 'mobx';
import moment from 'moment';
import { ProposalState } from './ProposalState';
import { LearningState } from './LearningState';
import { JoinRequest } from './JoinRequest';
import { StudentCdoModel } from './StudentCdoModel';
import { StudentXlsxModel } from './StudentXlsxModel';
import { StudentScoreModel } from './StudentScoreModel';
import { StudentXlsxForTestModel } from './StudentXlsxForTestModel';
import { ServiceType } from './ServiceType';
import { DramaEntityObservableModel } from 'shared/model';

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
  creationTime: number = 0;
  updateTime: number = 0;
  programLectureUsid: string = '';
  courseLectureUsid: string = '';
  joinRequests: JoinRequest[] = [];
  markComplete: boolean = false;
  rollBookId: string = '';
  examAttendance: boolean = false;
  updateTimeForTest: number = 0;
  homeworkFileBoxId: string = '';

  homeworkContent: string = '';
  homeworkOperatorComment: string = '';
  homeworkOperatorFileBoxId: string = '';

  stamped: boolean = false;
  lectureUsid: string = '';
  serviceType: ServiceType = ServiceType.Lecture;
  leaderEmails: string[] = [];
  url: string = '';

  phaseCount: number = 0;
  completePhaseCount: number = 0;
  surveyAnswerCount: number = 0;

  constructor(student?: StudentModel) {
    //
    if (student) {
      const proposalState = (student.proposalState && student.proposalState) || ProposalState.Approved;
      const learningState = (student.learningState && student.learningState) || LearningState.Progress;
      const studentScore = (student.studentScore && new StudentScoreModel(student.studentScore)) || this.studentScore;
      const serviceType = (student.serviceType && student.serviceType) || ServiceType.Lecture;
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
      lectureUsid: student.lectureUsid,
      learningState: student.learningState,
      serviceType: student.serviceType,
      leaderEmails: student.leaderEmails,
      url: student.url,
    };
  }

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

  public static getLearningStateName(learningState: LearningState) {
    //
    if (learningState && learningState === 'Progress') {
      return '결과처리 대기';
    }
    if (learningState && learningState === 'Waiting') {
      return '결과처리 대기';
    }
    if (learningState && learningState === 'Passed') {
      return '이수';
    }
    if (learningState && learningState === 'Missed') {
      return '미이수';
    }
    if (learningState && learningState === 'NoShow') {
      return '불참';
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

  static asXLSX(student: StudentModel): StudentXlsxModel {
    //
    return {
      소속사: student.company,
      '소속 조직(팀)': student.department,
      성명: student.name,
      'E-mail': student.email,
      신청시간: moment(student.creationTime).format('YYYY.MM.DD HH:mm:ss') || '-',
      상태: this.getStateName(student.proposalState, student.learningState),
      '상태 변경일': moment(student.updateTime).format('YYYY.MM.DD HH:mm:ss') || '-',
    };
  }

  static asXLSXForCourse(student: StudentModel): StudentXlsxModel {
    //
    return {
      소속사: student.company,
      '소속 조직(팀)': student.department,
      성명: student.name,
      'E-mail': student.email,
      신청일: moment(student.creationTime).format('YYYY.MM.DD HH:mm:ss') || '-',
      '완료 Phase': student.completePhaseCount + '/' + student.phaseCount,
      'Stamp 획득 여부': this.getStampedName(student.stamped),
      'Course 이수 여부': this.getLearningStateName(student.learningState),
      'Course 이수일': moment(student.updateTimeForTest).format('YYYY.MM.DD HH:mm:ss') || '-',
    };
  }

  static asXLSXForTest(student: StudentModel, examId: string, fileBoxId: string): StudentXlsxForTestModel {
    //
    return {
      소속사: student.company,
      '소속 조직(팀)': student.department,
      성명: student.name,
      'E-mail': student.email,
      시험성적: examId
        ? (student.studentScore &&
            student.studentScore.testScoreList.length > 0 &&
            String(student.studentScore.latestScore)) ||
          '미응시'
        : '-',
      응시횟수: examId
        ? (student.studentScore &&
            student.studentScore.numberOfTrials &&
            String(student.studentScore.numberOfTrials)) ||
          '0'
        : '-',
      과제점수: fileBoxId
        ? (student.studentScore && student.studentScore.homeworkScore && String(student.studentScore.homeworkScore)) ||
          '없음'
        : '-',
      '완료 Phase': `${student.completePhaseCount} / ${student.phaseCount}`,
      이수상태: this.getLearningStateName(student.learningState),
      '상태 변경일': moment(student.updateTime).format('YYYY.MM.DD HH:mm:ss') || '-',
    };
  }

  static asNameValuesList(student: StudentModel): NameValueList {
    const asNameValues = {
      nameValues: [
        {
          name: 'name',
          value: student.name,
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
          name: 'updateTime',
          value: String(student.updateTime),
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
          name: 'updateTimeForTest',
          value: String(student.updateTimeForTest),
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
  creationTime: observable,
  updateTime: observable,
  programLectureUsid: observable,
  courseLectureUsid: observable,
  joinRequests: observable,
  markComplete: observable,
  rollBookId: observable,
  examAttendance: observable,
  updateTimeForTest: observable,
  homeworkFileBoxId: observable,
  stamped: observable,
  lectureUsid: observable,
  serviceType: observable,
  phaseCount: observable,
  completePhaseCount: observable,
  homeworkContent: observable,
  homeworkOperatorComment: observable,
  homeworkOperatorFileBoxId: observable,
  surveyAnswerCount: observable,
});
