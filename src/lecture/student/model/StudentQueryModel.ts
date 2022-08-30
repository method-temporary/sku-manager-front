import { decorate, observable } from 'mobx';
import { NewDatePeriod, PageModel } from 'shared/model';

import StudentCountRdo from '../../../card/student/model/vo/StudentCountRdo';
import { StudentCountType } from '../../../card/student/model/vo/StudentCountType';
import { ProposalState } from './ProposalState';
import { StudentRdoModel } from './StudentRdoModel';
import { StudentRdoForTestModel } from './StudentRdoForTestModel';
import { ServiceType } from './ServiceType';
import { ScoringState } from './ScoringState';
import StudentByCubeRdo from './StudentByCubeRdo';
import { LearningState } from './LearningState';

export class StudentQueryModel {
  //
  period: NewDatePeriod = new NewDatePeriod();
  proposalState: ProposalState = ProposalState.DEFAULT;
  learningState: LearningState = LearningState.Empty; // 이수상태
  applyNotLearningState: string = '';
  scoringState: ScoringState | null = null; // 채점상태
  numberOfTrials: number | null = null; // 응시횟수
  phaseCompleteState: string = ''; // 완료여부
  rollBookId: string = '';
  round: number = 1;
  stamped: string = '';
  lectureUsid: string = '';
  serviceType: ServiceType | null = null;
  childLecture: string = '';
  surveyCaseId: string = '';
  cubeId: string = '';

  searchPart: any = '전체';
  searchWord: any;
  surveyAnswered: string = '';

  studentCountType: StudentCountType = StudentCountType.APPROVAL;

  offset: number = 0;
  limit: number = 20;

  static asStudentRdo(studentQuery: StudentQueryModel): StudentRdoModel {
    let company = false;
    let department = false;
    let name = false;
    let email = false;
    if (studentQuery.searchPart === '소속사') company = true;
    if (studentQuery.searchPart === '소속조직') department = true;
    if (studentQuery.searchPart === '성명') name = true;
    if (studentQuery.searchPart === 'Email') email = true;

    return {
      startTime: studentQuery && studentQuery.period && studentQuery.period.startDateLong,
      endTime: studentQuery && studentQuery.period && studentQuery.period.endDateLong,
      proposalState: (studentQuery && studentQuery.proposalState) || '',
      learningState: (studentQuery && studentQuery.learningState) || null,
      applyNotLearningState: (studentQuery && studentQuery.applyNotLearningState) || '',
      rollBookId: (studentQuery && studentQuery.rollBookId) || '',
      round: studentQuery && studentQuery.round,
      company: (company && studentQuery && studentQuery.searchWord) || '',
      department: (department && studentQuery && studentQuery.searchWord) || '',
      name: (name && studentQuery && studentQuery.searchWord) || '',
      email: (email && studentQuery && studentQuery.searchWord) || '',
      offset: studentQuery && studentQuery.offset,
      limit: studentQuery && studentQuery.limit,
      stamped: (studentQuery && studentQuery.stamped) || '',
      lectureUsid: (studentQuery && studentQuery.lectureUsid) || '',
      serviceType: (studentQuery && studentQuery.serviceType) || null,
      phaseCompleteState: (studentQuery && studentQuery.phaseCompleteState) || '',
      surveyAnswered: studentQuery && studentQuery.surveyAnswered,
      surveyCaseId: (studentQuery && studentQuery.surveyCaseId) || '',
    };
  }

  static asStudentRdoForTest(studentQuery: StudentQueryModel): StudentRdoForTestModel {
    let company = false;
    let department = false;
    let name = false;
    let email = false;
    if (studentQuery.searchPart === '소속사') company = true;
    if (studentQuery.searchPart === '소속조직') department = true;
    if (studentQuery.searchPart === '성명') name = true;
    if (studentQuery.searchPart === 'Email') email = true;

    return {
      startTime: studentQuery && studentQuery.period && studentQuery.period.startDateLong,
      endTime: studentQuery && studentQuery.period && studentQuery.period.endDateLong,
      proposalState: (studentQuery && studentQuery.proposalState) || '',
      learningState: (studentQuery && studentQuery.learningState) || null,
      rollBookId: (studentQuery && studentQuery.rollBookId) || '',
      lectureUsid: (studentQuery && studentQuery.lectureUsid) || '',
      scoringState: (studentQuery && studentQuery.scoringState) || null,
      company: (company && studentQuery && studentQuery.searchWord) || '',
      department: (department && studentQuery && studentQuery.searchWord) || '',
      name: (name && studentQuery && studentQuery.searchWord) || '',
      email: (email && studentQuery && studentQuery.searchWord) || '',
      offset: studentQuery && studentQuery.offset,
      limit: studentQuery && studentQuery.limit,
      numberOfTrials: (studentQuery && studentQuery.numberOfTrials) || null,
      phaseCompleteState: (studentQuery && studentQuery.phaseCompleteState) || '',
      stamped: (studentQuery && studentQuery.stamped) || '',
      serviceType: (studentQuery && studentQuery.serviceType) || null,
    };
  }

  static asStudentByCubeRdo(studentQuery: StudentQueryModel, cubeId: string, pageModel: PageModel): StudentByCubeRdo {
    //
    let leaningStates: LearningState[];

    if (studentQuery.scoringState === ScoringState.Missing) {
      leaningStates = [
        LearningState.Progress,
        // LearningState.HomeworkWaiting,
        // LearningState.TestPassed,
        // LearningState.Failed,
      ];
    } else if (studentQuery.scoringState === ScoringState.Scoring) {
      leaningStates = [LearningState.Missed, LearningState.Passed];
    } else if (studentQuery.scoringState === ScoringState.Waiting) {
      // leaningStates = [LearningState.TestWaiting, LearningState.Waiting];
      leaningStates = [LearningState.Progress];
    } else {
      leaningStates = [studentQuery.learningState];
    }
    const proposalState = studentQuery.proposalState === ProposalState.DEFAULT ? '' : studentQuery.proposalState;

    return <StudentByCubeRdo>{
      cubeId,
      offset: pageModel.offset,
      limit: pageModel.limit,
      // leaningState: [studentQuery.learningState],
      leaningState: leaningStates,
      proposalState,
      name: studentQuery.searchPart === '성명' ? studentQuery.searchWord : '',
      company: studentQuery.searchPart === '소속사' ? studentQuery.searchWord : '',
      department: studentQuery.searchPart === '소속소직' ? studentQuery.searchWord : '',
      email: studentQuery.searchPart === 'Email' ? studentQuery.searchWord : '',
      startTime: studentQuery.period.startDateLong,
      endTime: studentQuery.period.endDateLong,
      round: studentQuery.round,
      type: 'LEARNING_STATE',
    };
  }

  static asStudentTestCountRdo(
    studentQuery: StudentQueryModel,
    cubeId: string,
    studentCountType: StudentCountType
  ): StudentCountRdo {
    //
    const proposalState = studentQuery.proposalState === ProposalState.DEFAULT ? '' : studentQuery.proposalState;

    return <StudentCountRdo>{
      cardId: cubeId,
      round: studentQuery.round,
      learningState: [studentQuery.learningState],
      proposalState,
      name: studentQuery.searchWord,
      company: '',
      department: '',
      email: '',
      startTime: studentQuery.period.startDateLong,
      endTime: studentQuery.period.endDateLong,

      type: studentCountType,
    };
  }

  static isBlank(studentQuery: StudentQueryModel): string {
    //
    if (studentQuery && studentQuery.searchPart !== '' && studentQuery && !studentQuery.searchWord) {
      return '검색어';
    }
    return 'success';
  }
}

decorate(StudentQueryModel, {
  period: observable,
  proposalState: observable,
  learningState: observable,
  applyNotLearningState: observable,
  numberOfTrials: observable,
  phaseCompleteState: observable,
  rollBookId: observable,
  round: observable,
  searchPart: observable,
  searchWord: observable,
  stamped: observable,
  lectureUsid: observable,
  serviceType: observable,
  childLecture: observable,
  surveyCaseId: observable,
  offset: observable,
  limit: observable,
  surveyAnswered: observable,
  cubeId: observable,
  studentCountType: observable,
});
