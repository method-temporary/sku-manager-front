import { CardStudentQdo, initializeCardStudentQdo } from '../../../_data/lecture/students/model/CardStudentQdo';
import { action, observable, runInAction } from 'mobx';
import StudentDeleteResultModel from '../../../student/model/StudentDeleteResultModel';
import { LearningState } from '_data/shared/LearningState';
import { ProposalState } from '_data/shared/ProposalState';
import { modifyCardStudentRound, registerRelatedStudents } from '../../../_data/lecture/students/api/studentApi';
import CardWithContentsAndRelatedCount from '../../../_data/lecture/cards/model/CardWithContentsAndRelatedCount';
import { initializeStudentCountQdo, StudentCountQdo } from '../../../_data/lecture/students/model/sdo/StudentCountQdo';
import { initializeStudentModifyRoundUdo, StudentModifyRoundUdo } from '../model/StudentModifyRoundUdo';
import { ChangeStudentRoundResultModel } from '../model/ChangeStudentRoundResultModel';

export interface CardStudentQuery extends CardStudentQdo {
  //
  learningStateParam?: LearningState;
  proposalStateParam?: ProposalState;
  employed: boolean | '';
  searchOption?: string;
  searchValue?: string;
}

class CardStudentStore {
  //
  static instance: CardStudentStore;

  @observable
  cardStudentParams: CardStudentQdo = initializeCardStudentQdo();

  // @observable
  // cardStudentExcelParams: CardStudentQdo = initializeCardStudentQdo();

  @observable
  cardStudentQuery: CardStudentQuery = initializeCardStudentQdo();

  @observable
  cardStudentCountParams: StudentCountQdo = initializeStudentCountQdo();

  @observable
  selectedCardStudentIds: string[] = [];

  @observable
  responseCardStudents: StudentDeleteResultModel[] = [];

  @observable
  cardStudentChangeRoundParams: StudentModifyRoundUdo = initializeStudentModifyRoundUdo();

  @observable
  changeStudentRoundResults: ChangeStudentRoundResultModel[] = [];

  @observable
  toRound: number = 1;

  @observable
  toRounds: any = [{ key: `전체`, text: `전체`, value: null }];

  @observable
  isUpdatable: boolean = true;

  @action.bound
  setIsUpdatable(isUpdatable: boolean) {
    //
    this.isUpdatable = isUpdatable;
  }

  @action.bound
  setChangeStudentRoundResults(changeStudentRoundList: ChangeStudentRoundResultModel[]) {
    //
    this.changeStudentRoundResults = changeStudentRoundList;
  }

  @action.bound
  setToRound(round: number) {
    //
    this.toRound = round;
  }

  @action.bound
  setToRounds(rounds: any[]) {
    //
    this.toRounds = rounds;
  }

  @action.bound
  setParams(): void {
    const name = (this.cardStudentQuery.searchOption === '성명' && this.cardStudentQuery.searchValue) || '';
    const company = (this.cardStudentQuery.searchOption === '소속사' && this.cardStudentQuery.searchValue) || '';
    const department = (this.cardStudentQuery.searchOption === '소속조직' && this.cardStudentQuery.searchValue) || '';
    const email = (this.cardStudentQuery.searchOption === 'Email' && this.cardStudentQuery.searchValue) || '';
    console.log(this.cardStudentQuery.employed, 'this.cardStudentQuery.employed');
    this.cardStudentParams = {
      ...this.cardStudentQuery,
      offset: (this.cardStudentQuery.offset - 1) * this.cardStudentQuery.limit,
      extraTaskTypes: [...this.cardStudentQuery.extraTaskTypes],
      learningState: (this.cardStudentQuery.learningStateParam && [this.cardStudentQuery.learningStateParam]) || [],
      proposalState: (this.cardStudentQuery.proposalStateParam && this.cardStudentQuery.proposalStateParam) || '',
      employed: this.cardStudentQuery.employed,
      round: this.cardStudentQuery.round || undefined,
      name,
      company,
      department,
      email,
    };
    this.setStudentCountParams();
    this.selectedCardStudentIds = [];
  }

  @action.bound
  setStudentCountParams(): void {
    const name = (this.cardStudentQuery.searchOption === '성명' && this.cardStudentQuery.searchValue) || '';
    const company = (this.cardStudentQuery.searchOption === '소속사' && this.cardStudentQuery.searchValue) || '';
    const department = (this.cardStudentQuery.searchOption === '소속조직' && this.cardStudentQuery.searchValue) || '';
    const email = (this.cardStudentQuery.searchOption === 'Email' && this.cardStudentQuery.searchValue) || '';

    this.cardStudentCountParams = {
      ...this.cardStudentQuery,
      learningState: (this.cardStudentQuery.learningStateParam && [this.cardStudentQuery.learningStateParam]) || [],
      round: this.cardStudentQuery.round || undefined,
      name,
      company,
      department,
      email,
      studentType: 'Card',
      type: 'PROPOSAL_AND_LEARNING_STATE',
      userDenizenId: '',
    };
  }

  // @action.bound
  // setExcelParams(): void {
  //   const name = (this.cardStudentQuery.searchOption === '성명' && this.cardStudentQuery.searchValue) || '';
  //   const company = (this.cardStudentQuery.searchOption === '소속사' && this.cardStudentQuery.searchValue) || '';
  //   const department = (this.cardStudentQuery.searchOption === '소속조직' && this.cardStudentQuery.searchValue) || '';
  //   const email = (this.cardStudentQuery.searchOption === 'Email' && this.cardStudentQuery.searchValue) || '';
  //
  //   this.cardStudentExcelParams = {
  //     ...this.cardStudentQuery,
  //     offset: 0,
  //     limit: 9999999,
  //     extraTaskTypes: [...this.cardStudentQuery.extraTaskTypes],
  //     learningState: (this.cardStudentQuery.learningStateParam && [this.cardStudentQuery.learningStateParam]) || [],
  //     name,
  //     company,
  //     department,
  //     email,
  //   };
  //   this.setStudentCountParams();
  //   this.selectedCardStudentIds = [];
  // }

  @action.bound
  clearExcelParams(): void {
    //
    // this.cardStudentExcelParams = initializeCardStudentQdo();
    this.cardStudentCountParams = initializeStudentCountQdo();
  }

  @action.bound
  setCardStudentSelected(ids: string[]): void {
    this.selectedCardStudentIds = ids;
  }

  @action.bound
  setDeletedCardStudentIds(deletedStudents: StudentDeleteResultModel[]): void {
    this.responseCardStudents = deletedStudents;
  }

  // setter
  @action.bound
  initializeCardStudentQuery(sdo?: CardWithContentsAndRelatedCount): void {
    if (sdo) {
      const cardId = sdo.card.id;
      const enrolled = sdo.card.studentEnrollmentType !== 'Anyone';

      this.cardStudentQuery = {
        ...initializeCardStudentQdo(),
        cardId,
        round: undefined,
        learningStateParam: '',
        proposalStateParam: '',
        employed: '',
        searchOption: '',
        searchValue: '',
      };
    }
  }

  @action.bound
  setStartTime(startTime: Date): void {
    this.cardStudentQuery = { ...this.cardStudentQuery, startTime: startTime.getTime() };
  }

  @action.bound
  setEndTime(endTime: Date): void {
    this.cardStudentQuery = { ...this.cardStudentQuery, endTime: endTime.getTime() };
  }

  @action.bound
  setLearningState(learningState: LearningState): void {
    this.cardStudentQuery = { ...this.cardStudentQuery, learningStateParam: learningState };
  }

  @action.bound
  setProposalState(proposalState: ProposalState): void {
    this.cardStudentQuery = { ...this.cardStudentQuery, proposalStateParam: proposalState };
  }

  @action.bound
  setSearchOption(searchOption: string): void {
    this.cardStudentQuery = { ...this.cardStudentQuery, searchOption };
  }

  @action.bound
  setEmployedState(employed: boolean): void {
    this.cardStudentQuery = { ...this.cardStudentQuery, employed };
  }

  @action.bound
  setSearchValue(searchValue: string): void {
    this.cardStudentQuery = { ...this.cardStudentQuery, searchValue };
  }

  @action.bound
  setLimit(limit: number): void {
    this.cardStudentQuery = { ...this.cardStudentQuery, limit };
  }

  @action.bound
  setOffset(offset: number): void {
    this.cardStudentQuery = { ...this.cardStudentQuery, offset };
  }

  @action.bound
  setChildLecture(childLecture: string): void {
    this.cardStudentQuery = { ...this.cardStudentQuery, childLecture };
  }

  @action.bound
  setRound(round: number): void {
    this.cardStudentQuery = { ...this.cardStudentQuery, round };
  }

  @observable
  uploadFailedList: string[] = [];

  @action.bound
  setUploadFailedList(uploadFailedList: string[]): void {
    this.uploadFailedList = uploadFailedList;
  }

  @action.bound
  async registerCardStudents(cardId: string, email: string, round?: number): Promise<void> {
    //
    const result = await registerRelatedStudents({ cardId, email, round });
    runInAction(() => {
      if (!result) {
        this.setUploadFailedList([...this.uploadFailedList, email]);
      }
    });
  }

  @action.bound
  clearStudentRoundChangeModal(): void {
    //
    this.setToRound(this.toRounds[0] || 1);
    this.setChangeStudentRoundResults([]);
    this.setIsUpdatable(true);
  }
}

CardStudentStore.instance = new CardStudentStore();
export default CardStudentStore;
