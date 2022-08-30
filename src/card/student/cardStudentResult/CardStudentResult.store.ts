import { CardStudentQdo, initializeCardStudentQdo } from '../../../_data/lecture/students/model/CardStudentQdo';
import { LearningState } from '../../../_data/shared/LearningState';
import { action, observable } from 'mobx';
import StudentDeleteResultModel from '../../../student/model/StudentDeleteResultModel';
import { initializeStudentCountQdo, StudentCountQdo } from '../../../_data/lecture/students/model/sdo/StudentCountQdo';
import CardWithContentsAndRelatedCount from '../../../_data/lecture/cards/model/CardWithContentsAndRelatedCount';
import { ExtraTaskStatus } from '../../../student/model/vo/ExtraTaskStatus';
import { ScoringState } from '../../../student/model/vo/ScoringState';

export interface CardStudentResultQuery extends CardStudentQdo {
  //
  learningStateParam?: LearningState;
  employed: boolean | '';
  scoringState?: string;
  searchOption?: string;
  searchValue?: string;
}

class CardStudentResultStore {
  //
  static instance: CardStudentResultStore;

  @observable
  cardStudentResultParams: CardStudentQdo = initializeCardStudentQdo();

  @observable
  cardStudentResultExcelParams: CardStudentQdo = initializeCardStudentQdo();

  @observable
  cardStudentResultQuery: CardStudentResultQuery = initializeCardStudentQdo();

  @observable
  cardStudentCountParams: StudentCountQdo = initializeStudentCountQdo();

  @observable
  selectedCardStudentIds: string[] = [];

  @action.bound
  setParams(): void {
    const name = (this.cardStudentResultQuery.searchOption === '성명' && this.cardStudentResultQuery.searchValue) || '';
    const company =
      (this.cardStudentResultQuery.searchOption === '소속사' && this.cardStudentResultQuery.searchValue) || '';
    const department =
      (this.cardStudentResultQuery.searchOption === '소속조직' && this.cardStudentResultQuery.searchValue) || '';
    const email =
      (this.cardStudentResultQuery.searchOption === 'Email' && this.cardStudentResultQuery.searchValue) || '';

    let extraTaskStatuses: ExtraTaskStatus[] = [];

    if (this.cardStudentResultQuery.scoringState === ScoringState.Missing) {
      extraTaskStatuses = [ExtraTaskStatus.SAVE];
    } else if (this.cardStudentResultQuery.scoringState === ScoringState.Scoring) {
      extraTaskStatuses = [ExtraTaskStatus.PASS, ExtraTaskStatus.FAIL];
    } else if (this.cardStudentResultQuery.scoringState === ScoringState.Waiting) {
      extraTaskStatuses = [ExtraTaskStatus.SUBMIT];
    }

    this.cardStudentResultParams = {
      ...this.cardStudentResultQuery,
      offset: (this.cardStudentResultQuery.offset - 1) * this.cardStudentResultQuery.limit,
      extraTaskTypes: [...this.cardStudentResultQuery.extraTaskTypes],
      learningState:
        (this.cardStudentResultQuery.learningStateParam && [this.cardStudentResultQuery.learningStateParam]) || [],
      round: this.cardStudentResultQuery.round || undefined,
      name,
      company,
      employed: this.cardStudentResultQuery.employed,
      department,
      email,
      extraTaskStatuses,
    };
    this.setStudentCountParams();
    this.selectedCardStudentIds = [];
  }

  @action.bound
  setExcelParams(): void {
    const name = (this.cardStudentResultQuery.searchOption === '성명' && this.cardStudentResultQuery.searchValue) || '';
    const company =
      (this.cardStudentResultQuery.searchOption === '소속사' && this.cardStudentResultQuery.searchValue) || '';
    const department =
      (this.cardStudentResultQuery.searchOption === '소속조직' && this.cardStudentResultQuery.searchValue) || '';
    const email =
      (this.cardStudentResultQuery.searchOption === 'Email' && this.cardStudentResultQuery.searchValue) || '';

    let extraTaskStatuses: ExtraTaskStatus[] = [];

    if (this.cardStudentResultQuery.scoringState === ScoringState.Missing) {
      extraTaskStatuses = [ExtraTaskStatus.SAVE];
    } else if (this.cardStudentResultQuery.scoringState === ScoringState.Scoring) {
      extraTaskStatuses = [ExtraTaskStatus.PASS, ExtraTaskStatus.FAIL];
    } else if (this.cardStudentResultQuery.scoringState === ScoringState.Waiting) {
      extraTaskStatuses = [ExtraTaskStatus.SUBMIT];
    }

    this.cardStudentResultExcelParams = {
      ...this.cardStudentResultQuery,
      offset: 0,
      limit: 9999999,
      extraTaskTypes: [...this.cardStudentResultQuery.extraTaskTypes],
      learningState:
        (this.cardStudentResultQuery.learningStateParam && [this.cardStudentResultQuery.learningStateParam]) || [],
      round: this.cardStudentResultQuery.round || undefined,
      name,
      company,
      department,
      email,
      extraTaskStatuses,
    };
    this.setStudentCountParams();
    this.selectedCardStudentIds = [];
  }

  @action.bound
  setStudentCountParams(): void {
    const name = (this.cardStudentResultQuery.searchOption === '성명' && this.cardStudentResultQuery.searchValue) || '';
    const company =
      (this.cardStudentResultQuery.searchOption === '소속사' && this.cardStudentResultQuery.searchValue) || '';
    const department =
      (this.cardStudentResultQuery.searchOption === '소속조직' && this.cardStudentResultQuery.searchValue) || '';
    const email =
      (this.cardStudentResultQuery.searchOption === 'Email' && this.cardStudentResultQuery.searchValue) || '';

    this.cardStudentCountParams = {
      ...this.cardStudentResultQuery,
      learningState:
        (this.cardStudentResultQuery.learningStateParam && [this.cardStudentResultQuery.learningStateParam]) || [],
      round: this.cardStudentResultQuery.round || undefined,
      name,
      company,
      department,
      email,
      studentType: 'Card',
      type: 'LEARNING_STATE',
      userDenizenId: '',
    };
  }

  @action.bound
  setCardStudentSelected(ids: string[]): void {
    this.selectedCardStudentIds = ids;
  }

  // setter
  @action.bound
  initializeCardStudentResultQuery(sdo?: CardWithContentsAndRelatedCount): void {
    if (sdo) {
      const cardId = sdo.card.id;
      // const enrolled = sdo.card.studentEnrollmentType !== 'Anyone';

      this.cardStudentResultQuery = {
        ...initializeCardStudentQdo(),
        cardId,
        round: undefined,
        scoringState: '',
        learningStateParam: '',
        searchOption: '',
        searchValue: '',
      };
    }
  }

  @action.bound
  setStartTime(startTime: Date): void {
    this.cardStudentResultQuery = { ...this.cardStudentResultQuery, startTime: startTime.getTime() };
  }

  @action.bound
  setEndTime(endTime: Date): void {
    this.cardStudentResultQuery = { ...this.cardStudentResultQuery, endTime: endTime.getTime() };
  }

  @action.bound
  setLearningState(learningState: LearningState): void {
    this.cardStudentResultQuery = { ...this.cardStudentResultQuery, learningStateParam: learningState };
  }

  @action.bound
  setScoringState(scoringState: string): void {
    this.cardStudentResultQuery = { ...this.cardStudentResultQuery, scoringState };
  }

  @action.bound
  setSearchOption(searchOption: string): void {
    this.cardStudentResultQuery = { ...this.cardStudentResultQuery, searchOption };
  }

  @action.bound
  setSearchValue(searchValue: string): void {
    this.cardStudentResultQuery = { ...this.cardStudentResultQuery, searchValue };
  }

  @action.bound
  setLimit(limit: number): void {
    this.cardStudentResultQuery = { ...this.cardStudentResultQuery, limit };
  }

  @action.bound
  setOffset(offset: number): void {
    this.cardStudentResultQuery = { ...this.cardStudentResultQuery, offset };
  }

  @action.bound
  setExamAttendance(examAttendance: boolean): void {
    this.cardStudentResultQuery = { ...this.cardStudentResultQuery, examAttendance };
  }

  @action.bound
  setPhaseCompleteState(phaseCompleteState: boolean): void {
    this.cardStudentResultQuery = { ...this.cardStudentResultQuery, phaseCompleteState };
  }

  @action.bound
  setEmployedState(employed: boolean): void {
    this.cardStudentResultQuery = { ...this.cardStudentResultQuery, employed };
  }

  @action.bound
  setSurveyCompleted(surveyCompleted: boolean): void {
    this.cardStudentResultQuery = { ...this.cardStudentResultQuery, surveyCompleted };
  }

  @action.bound
  setRound(round: number): void {
    this.cardStudentResultQuery = { ...this.cardStudentResultQuery, round };
  }
}

CardStudentResultStore.instance = new CardStudentResultStore();
export default CardStudentResultStore;
