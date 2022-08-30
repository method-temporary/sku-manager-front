import { decorate, observable } from 'mobx';

import { NewDatePeriod, PageModel, SortFilterState } from 'shared/model';
import { yesNoToBooleanIgnoreCase } from 'shared/helper';

import StudentByCubeRdo from './StudentByCubeRdo';
import StudentCountRdo from './vo/StudentCountRdo';
import { ServiceType } from './vo/ServiceType';
import { ScoringState } from './vo/ScoringState';
import { ProposalState } from './vo/ProposalState';
import { StudentCountType } from './vo/StudentCountType';
import { StudentCardRdoModel } from './StudentCardRdoModel';
import { ExtraTaskType } from './vo/ExtraTaskType';
import { ExtraTaskStatus } from './vo/ExtraTaskStatus';
import { CardStudentQuery } from '../../card/student/cardStudent/CardStudent.store';
import { LearningState } from './vo/LearningState';
import { parseLearningState } from '../../_data/shared/LearningState';
import { parseProposalState } from '../../_data/shared/ProposalState';
import { CardStudentResultQuery } from '../../card/student/cardStudentResult/CardStudentResult.store';

export class StudentQueryModel {
  //
  cardId: string = '';
  period: NewDatePeriod = new NewDatePeriod();
  proposalState: ProposalState = ProposalState.DEFAULT;
  learningState: LearningState = LearningState.Empty; // 이수상태
  applyNotLearningState: string = '';
  scoringState: ScoringState | null = null; // 채점상태
  numberOfTrials: number | null = null; // 응시횟수
  phaseCompleteState: boolean = false; // 완료여부
  surveyCompleted: boolean | null = null; // 설문조사 완료여부
  rollBookId: string = '';
  round?: number;
  stamped: string = '';
  lectureUsid: string = '';
  serviceType: ServiceType | null = null;
  childLecture: string = '';
  surveyCaseId: string = '';
  cubeId: string = '';
  employed: string | '' = '';
  searchPart: any = '전체';
  searchWord: any;
  surveyAnswered: string = '';
  studentCountType: StudentCountType = StudentCountType.APPROVAL;

  extraTaskType: ExtraTaskType | null = null;
  extraTaskStatuses: ExtraTaskStatus[] = [];

  offset: number = 0;
  limit: number = 20;

  studentOrderBy: SortFilterState = SortFilterState.RegisteredTimeDesc;

  examAttendance: string | undefined = undefined;

  static asStudentCardRdo(
    studentQuery: StudentQueryModel,
    pageModel: PageModel,
    configs?: { cardId?: string; type?: string }
  ): StudentCardRdoModel {
    //
    let extraTaskStatuses: ExtraTaskStatus[] = [];
    let extraTaskTypes: ExtraTaskType[] = [];
    let learningState: LearningState[] | LearningState = [];

    if (studentQuery.extraTaskType && ExtraTaskType.Survey) {
      extraTaskTypes = [ExtraTaskType.Survey];

      if (studentQuery.surveyAnswered === 'YES') {
        extraTaskStatuses = [ExtraTaskStatus.PASS, ExtraTaskStatus.FAIL, ExtraTaskStatus.SUBMIT];
      } else if (studentQuery.surveyAnswered === 'NO') {
        extraTaskStatuses = [ExtraTaskStatus.SAVE];
      } else {
        extraTaskStatuses = [];
      }
    } else {
      extraTaskTypes = [ExtraTaskType.Test, ExtraTaskType.Report];

      if (studentQuery.scoringState === ScoringState.Missing) {
        extraTaskStatuses = [ExtraTaskStatus.SAVE];
      } else if (studentQuery.scoringState === ScoringState.Scoring) {
        extraTaskStatuses = [ExtraTaskStatus.PASS, ExtraTaskStatus.FAIL];
      } else if (studentQuery.scoringState === ScoringState.Waiting) {
        extraTaskStatuses = [ExtraTaskStatus.SUBMIT];
      }
    }

    if (studentQuery.learningState === '') {
      learningState = [];
    } else if (configs?.type === 'studentInfo' && studentQuery.learningState === LearningState.Missed) {
      // learningState = [LearningState.Progress, LearningState.Missed];
      learningState = [LearningState.Missed];
    } else if (studentQuery.learningState === LearningState.Progress) {
      // learningState = [
      learningState =
        // LearningState.Failed,
        // LearningState.HomeworkWaiting,
        LearningState.Progress;
      // LearningState.TestPassed,
      // LearningState.TestWaiting,
      // LearningState.Waiting,
    } else {
      learningState = [studentQuery.learningState] || [];
    }

    const proposalState = studentQuery.proposalState === ProposalState.DEFAULT ? null : studentQuery.proposalState;

    return {
      // 공통
      cardId: configs?.cardId ? configs?.cardId : studentQuery.cardId,
      startTime: studentQuery.period.startDateLong,
      endTime: studentQuery.period.endDateLong,
      company: studentQuery.searchPart === '소속사' ? studentQuery.searchWord : '',
      department: studentQuery.searchPart === '소속조직' ? studentQuery.searchWord : '',
      name: studentQuery.searchPart === '성명' ? studentQuery.searchWord : '',
      email: studentQuery.searchPart === 'Email' ? studentQuery.searchWord : '',
      learningState,
      offset: pageModel.offset,
      limit: pageModel.limit,
      employed: studentQuery.employed,
      // 학습자
      childLecture: studentQuery.childLecture,
      // 결과관리
      numberOfTrials: studentQuery.numberOfTrials,
      scoringState: studentQuery.scoringState,
      phaseCompleteState: studentQuery.phaseCompleteState,
      surveyCompleted: studentQuery.surveyCompleted,
      type: 'LEARNING_STATE',
      round: studentQuery.round || undefined,
      studentOrderBy: studentQuery.studentOrderBy,
      proposalState,
      extraTaskTypes,
      extraTaskStatuses,
      examAttendance:
        !studentQuery.examAttendance || studentQuery.examAttendance === '전체'
          ? undefined
          : yesNoToBooleanIgnoreCase(studentQuery.examAttendance || ''),
    } as StudentCardRdoModel;
  }

  static asStudentByCubeRdo(studentQuery: StudentQueryModel, cubeId: string, pageModel: PageModel): StudentByCubeRdo {
    //
    let extraTaskStatuses: ExtraTaskStatus[] = [];

    if (studentQuery.scoringState === ScoringState.Missing) {
      extraTaskStatuses = [];
    } else if (studentQuery.scoringState === ScoringState.Scoring) {
      extraTaskStatuses = [ExtraTaskStatus.PASS, ExtraTaskStatus.FAIL];
    } else if (studentQuery.scoringState === ScoringState.Waiting) {
      extraTaskStatuses = [ExtraTaskStatus.SUBMIT];
    }

    const proposalState = studentQuery.proposalState === ProposalState.DEFAULT ? '' : studentQuery.proposalState;

    return <StudentByCubeRdo>{
      cubeId,
      offset: pageModel.offset,
      limit: pageModel.limit,
      learningState: [],
      proposalState,
      name: studentQuery.searchPart === '성명' ? studentQuery.searchWord : '',
      company: studentQuery.searchPart === '소속사' ? studentQuery.searchWord : '',
      department: studentQuery.searchPart === '소속조직' ? studentQuery.searchWord : '',
      email: studentQuery.searchPart === 'Email' ? studentQuery.searchWord : '',
      startTime: studentQuery.period.startDateLong,
      endTime: studentQuery.period.endDateLong,
      round: studentQuery.round,
      employed: studentQuery.employed,
      extraTaskTypes: [ExtraTaskType.Test, ExtraTaskType.Report],
      extraTaskStatuses,
      studentOrderBy: studentQuery.studentOrderBy,
      examAttendance: undefined,
    };
  }

  static asStudentSurveyByCubeRdo(
    studentQuery: StudentQueryModel,
    cubeId: string,
    pageModel: PageModel
  ): StudentByCubeRdo {
    //
    let extraTaskStatuses: ExtraTaskStatus[] = [];

    if (studentQuery.surveyAnswered === '전체') {
      extraTaskStatuses = [];
    } else if (studentQuery.surveyAnswered === 'YES') {
      extraTaskStatuses = [ExtraTaskStatus.PASS, ExtraTaskStatus.FAIL, ExtraTaskStatus.SUBMIT];
    } else if (studentQuery.surveyAnswered === 'NO') {
      extraTaskStatuses = [ExtraTaskStatus.SAVE];
    }

    const proposalState = studentQuery.proposalState === ProposalState.DEFAULT ? '' : studentQuery.proposalState;

    return <StudentByCubeRdo>{
      cubeId,
      offset: pageModel.offset,
      limit: pageModel.limit,
      learningState: [],
      proposalState,
      name: studentQuery.searchPart === '성명' ? studentQuery.searchWord : '',
      company: studentQuery.searchPart === '소속사' ? studentQuery.searchWord : '',
      department: studentQuery.searchPart === '소속소직' ? studentQuery.searchWord : '',
      email: studentQuery.searchPart === 'Email' ? studentQuery.searchWord : '',
      startTime: studentQuery.period.startDateLong,
      endTime: studentQuery.period.endDateLong,
      round: studentQuery.round,

      extraTaskTypes: [ExtraTaskType.Survey],
      extraTaskStatuses,
      studentOrderBy: studentQuery.studentOrderBy,
      examAttendance: undefined,
    };
  }

  static asResultByCubeRdo(studentQuery: StudentQueryModel, cubeId: string, pageModel: PageModel): StudentByCubeRdo {
    //
    const learningStates =
      studentQuery.learningState === ''
        ? []
        : studentQuery.learningState === LearningState.Progress
        ? [LearningState.Progress]
        : // LearningState.Failed,
          // LearningState.HomeworkWaiting,
          // LearningState.TestPassed,
          // LearningState.TestWaiting,
          // LearningState.Waiting,

          [studentQuery.learningState] || [];

    let extraTaskStatuses: ExtraTaskStatus[] = [];

    if (studentQuery.scoringState === ScoringState.Missing) {
      extraTaskStatuses = [ExtraTaskStatus.SAVE];
    } else if (studentQuery.scoringState === ScoringState.Scoring) {
      extraTaskStatuses = [ExtraTaskStatus.PASS, ExtraTaskStatus.FAIL];
    } else if (studentQuery.scoringState === ScoringState.Waiting) {
      extraTaskStatuses = [ExtraTaskStatus.SUBMIT];
    }

    const proposalState = studentQuery.proposalState === ProposalState.DEFAULT ? null : studentQuery.proposalState;

    return <StudentByCubeRdo>{
      cubeId,
      offset: pageModel.offset,
      limit: pageModel.limit,
      learningState: learningStates,
      proposalState: ProposalState.Approved,
      name: studentQuery.searchPart === '성명' ? studentQuery.searchWord : '',
      company: studentQuery.searchPart === '소속사' ? studentQuery.searchWord : '',
      department: studentQuery.searchPart === '소속소직' ? studentQuery.searchWord : '',
      email: studentQuery.searchPart === 'Email' ? studentQuery.searchWord : '',
      startTime: studentQuery.period.startDateLong,
      endTime: studentQuery.period.endDateLong,
      round: studentQuery.round,
      employed: studentQuery.employed,
      extraTaskTypes: [ExtraTaskType.Test, ExtraTaskType.Report],
      extraTaskStatuses,
      studentOrderBy: studentQuery.studentOrderBy,
      examAttendance:
        !studentQuery.examAttendance || studentQuery.examAttendance === '전체'
          ? undefined
          : yesNoToBooleanIgnoreCase(studentQuery.examAttendance || ''),
      surveyCompleted: studentQuery.surveyCompleted,
    };
  }

  static asStudentTestCountRdo(
    studentQuery: StudentQueryModel,
    cubeId: string,
    type: StudentCountType
  ): StudentCountRdo {
    //
    return {
      cardId: cubeId,
      employed: studentQuery.employed,
      round: studentQuery.round,
      learningState: studentQuery.learningState,
      type,
    };
  }

  static asStudent(params: CardStudentQuery): StudentQueryModel {
    //
    const period: NewDatePeriod = new NewDatePeriod({
      startDate: params.startTime.toString(),
      endDate: params.endTime.toString(),
    } as NewDatePeriod);
    const learningState: LearningState = parseLearningState(params.learningStateParam);
    const proposalState: ProposalState = parseProposalState(params.proposalState);
    const scoringState = null;

    return {
      cardId: params.cardId,
      offset: params.offset,
      limit: params.limit,
      learningState, // 이수상태
      proposalState,
      searchPart: params.searchOption,
      searchWord: params.searchValue,
      period,
      applyNotLearningState: proposalState === ProposalState.Approved ? 'Y' : '',
      scoringState, // 채점상태
      numberOfTrials: null, // 응시횟수
      phaseCompleteState: params.phaseCompleteState, // 완료여부
      surveyCompleted: (params.surveyCompleted === '' && params.surveyCompleted) || null, // 설문조사 완료여부
      ////////////////////////////
      rollBookId: '',
      round: params.round,
      ///////////////////////
      stamped: '',
      lectureUsid: '',
      serviceType: null,
      childLecture: '',
      surveyCaseId: '',
      cubeId: '',
      extraTaskType: null,
      examAttendance: undefined,
      studentCountType: StudentCountType.APPROVAL,
      surveyAnswered: '',
      extraTaskStatuses: [],
      employed: '',

      studentOrderBy: SortFilterState.RegisteredTimeDesc,
    };
  }

  static asStudentResult(params: CardStudentResultQuery): StudentQueryModel {
    //
    const period: NewDatePeriod = new NewDatePeriod({
      startDate: params.startTime.toString(),
      endDate: params.endTime.toString(),
    } as NewDatePeriod);
    const learningState: LearningState = parseLearningState(params.learningStateParam);
    const proposalState: ProposalState = parseProposalState(params.proposalState);
    const scoringState = null;
    if ('scoringState' in params) {
      params.scoringState || null;
    }

    return {
      cardId: params.cardId,
      period,
      proposalState,
      learningState, // 이수상태
      applyNotLearningState: proposalState === ProposalState.Approved ? 'Y' : '',
      scoringState, // 채점상태
      numberOfTrials: null, // 응시횟수
      phaseCompleteState: params.phaseCompleteState, // 완료여부
      surveyCompleted: (params.surveyCompleted === '' && params.surveyCompleted) || null, // 설문조사 완료여부
      ////////////////////////////
      rollBookId: '',
      round: params.round,
      ///////////////////////
      stamped: '',
      lectureUsid: '',
      serviceType: null,
      childLecture: '',
      surveyCaseId: '',
      cubeId: '',
      employed: '',
      extraTaskType: null,
      examAttendance: undefined,
      searchPart: undefined,
      searchWord: undefined,
      studentCountType: StudentCountType.APPROVAL,
      surveyAnswered: '',
      extraTaskStatuses: [],
      offset: params.offset,
      limit: params.limit,
      studentOrderBy: SortFilterState.RegisteredTimeDesc,
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
  cardId: observable,
  period: observable,
  proposalState: observable,
  learningState: observable,
  applyNotLearningState: observable,
  numberOfTrials: observable,
  phaseCompleteState: observable,
  surveyCompleted: observable,
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
  extraTaskType: observable,
  extraTaskStatuses: observable,
});
