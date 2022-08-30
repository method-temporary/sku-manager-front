import { action, observable } from 'mobx';
import { autobind } from '@nara.platform/accent';

import { SortFilterState } from 'shared/model';
import { blankYesNoToOptionalBoolean } from 'shared/helper/valueConvertHelper';

import CardRdo, { getEmptyCardRdo } from '_data/lecture/cards/model/CardRdo';
import { CardStates } from '_data/lecture/cards/model/vo/CardStates';
import { CardPolyglotUdo } from '_data/lecture/cards/model/CardPolyglotUdo';

import { CardSearchPartType } from '../card/model/vo/CardSearchPartType';
import { StudentEnrollmentType } from '_data/lecture/cards/model/vo/StudentEnrollmentType';

@autobind
class CardListStore {
  //
  static instance: CardListStore;

  @observable
  cardRdo: CardRdo = getEmptyCardRdo();

  @observable
  cardRdoForExcel: CardRdo = getEmptyCardRdo();

  @observable
  startDate: number = 0;

  @observable
  endDate: number = 0;

  @observable
  collegeId: string = '';

  @observable
  channelId: string = '';

  @observable
  mainCategoryOnly: boolean = true;

  @observable
  studentEnrollmentType: StudentEnrollmentType = '';

  @observable
  cardType: string = '';

  @observable
  hasStamp: string = '';

  @observable
  cardState: string = '';

  @observable
  searchable: string = '';

  @observable
  sharedOnly: boolean = false;

  @observable
  searchPart: CardSearchPartType = '과정명';

  @observable
  searchWord: string = '';

  @observable
  userGroupSequences: number[] = [];

  @observable
  offset: number = 1;

  @observable
  limit: number = 20;

  @observable
  cardOrderBy: SortFilterState = SortFilterState.TimeDesc;

  @observable
  cardPolyglotUdos: CardPolyglotUdo[] = [];

  @observable
  isLoading: boolean = false;

  @observable
  excelReadModalWin: boolean = false;

  @observable
  invalidModalWin: boolean = false;

  @observable
  fileName: string = '';

  @observable
  loadingText: string = 'Loading...';

  @observable
  failedIds: string[] = [];

  @observable
  mutateCount: number = 0;

  @action.bound
  setStartDate(startDate: number) {
    //
    this.startDate = startDate;
  }

  @action.bound
  setEndDate(endDate: number) {
    //
    this.endDate = endDate;
  }

  @action.bound
  setCollegeId(collegeId: string) {
    //
    this.collegeId = collegeId;
  }

  @action.bound
  setChannelId(channelId: string) {
    //
    this.channelId = channelId;
  }

  @action.bound
  setMainCategoryOnly(mainCategoryOnly: boolean) {
    //
    this.mainCategoryOnly = mainCategoryOnly;
  }

  @action.bound
  setStudentEnrollmentType(studentEnrollmentType: StudentEnrollmentType) {
    //
    this.studentEnrollmentType = studentEnrollmentType;
  }

  @action.bound
  setCardType(cardType: string) {
    //
    this.cardType = cardType;
  }

  @action.bound
  setHasStamp(hasStamp: string) {
    //
    this.hasStamp = hasStamp;
  }

  @action.bound
  setCardState(cardState: string) {
    //
    this.cardState = cardState;
  }

  @action.bound
  setSearchable(searchable: string) {
    //
    this.searchable = searchable;
  }

  @action.bound
  setSharedOnly(sharedOnly: boolean) {
    //
    this.sharedOnly = sharedOnly;
  }

  @action.bound
  setSearchPart(searchPart: CardSearchPartType) {
    //
    this.searchPart = searchPart;
  }

  @action.bound
  setSearchWord(searchWord: string) {
    //
    this.searchWord = searchWord;
  }

  @action.bound
  setUserGroupSequences(userGroupSequence: number[]) {
    //
    this.userGroupSequences = userGroupSequence;
  }

  @action.bound
  setOffset(offset: number) {
    //
    this.offset = offset;
  }

  @action.bound
  setLimit(limit: number) {
    //
    this.limit = limit;
  }

  @action.bound
  setCardOrderBy(cardOrderBy: SortFilterState) {
    //
    this.cardOrderBy = cardOrderBy;
  }

  @action.bound
  setIsLoading(isLoading: boolean) {
    //
    this.isLoading = isLoading;
  }

  @action.bound
  setExcelReadModalWin(excelReadModalWin: boolean) {
    //
    this.excelReadModalWin = excelReadModalWin;
  }

  @action.bound
  setInvalidModalWin(invalidModalWin: boolean) {
    //
    this.invalidModalWin = invalidModalWin;
  }

  @action.bound
  setFileName(fileName: string) {
    //
    this.fileName = fileName;
  }

  @action.bound
  setLoadingText(loadingText: string) {
    //
    this.loadingText = loadingText;
  }

  @action.bound
  addFailedIds(failedId: string) {
    //
    this.failedIds.push(failedId);
  }

  @action.bound
  addMutateCount() {
    //
    this.mutateCount++;
  }

  @action.bound
  setCardRdo() {
    //
    this.cardRdo = {
      startDate: this.startDate,
      endDate: this.endDate,
      collegeId: this.collegeId,
      channelId: this.channelId,
      mainCategoryOnly: this.mainCategoryOnly,
      cardType: this.cardType,
      hasStamp: blankYesNoToOptionalBoolean(this.hasStamp),
      cardState: this.cardState === '' ? '' : this.cardState,
      studentEnrollmentType: this.studentEnrollmentType,
      searchable: this.searchable === '' ? undefined : this.searchable === 'Yes',
      sharedOnly: this.sharedOnly,
      name: this.searchPart === '과정명' ? this.searchWord.replaceAll('"', '\\"') : '',
      registrantName: this.searchPart === '생성자' ? this.searchWord : '',
      userGroupSequences: this.userGroupSequences.slice(),
      offset: (this.offset - 1) * this.limit,
      limit: this.limit,
      cardOrderBy: this.cardOrderBy,
    };
  }

  @action.bound
  setCardRdoForExcel() {
    //
    this.cardRdoForExcel = {
      startDate: this.startDate,
      endDate: this.endDate,
      collegeId: this.collegeId,
      channelId: this.channelId,
      mainCategoryOnly: this.mainCategoryOnly,
      cardType: this.cardType,
      hasStamp: blankYesNoToOptionalBoolean(this.hasStamp),
      cardState: this.cardState === '' ? '' : this.cardState,
      studentEnrollmentType: this.studentEnrollmentType,
      searchable: this.searchable === '' ? undefined : this.searchable === 'Yes',
      sharedOnly: this.sharedOnly,
      name: this.searchPart === '과정명' ? this.searchWord.replaceAll('"', '\\"') : '',
      registrantName: this.searchPart === '생성자' ? this.searchWord : '',
      userGroupSequences: this.userGroupSequences.slice(),
      offset: 0,
      limit: 99999999,
      cardOrderBy: this.cardOrderBy,
    };

    return this.cardRdoForExcel;
  }

  @action.bound
  setCardRdoForPage(isSearch: boolean) {
    //
    if (isSearch) {
      this.setCardRdo();
    } else {
      this.cardRdo = {
        ...this.cardRdo,
        offset: (this.offset - 1) * this.limit,
      };
    }
  }

  @action.bound
  setCardPolyglotUdos(cardPolyglotUdos: CardPolyglotUdo[]) {
    //
    this.cardPolyglotUdos = cardPolyglotUdos;
  }

  @action.bound
  reset() {
    this.startDate = 0;
    this.endDate = 0;
    this.collegeId = '';
    this.channelId = '';
    this.mainCategoryOnly = false;
    this.studentEnrollmentType = '';
    this.cardType = '';
    this.hasStamp = '';
    this.cardState = CardStates.Empty;
    this.searchable = '';
    this.sharedOnly = false;
    this.searchPart = '과정명';
    this.searchWord = '';
    this.userGroupSequences = [];
    this.offset = 1;
    this.limit = 20;
    this.cardOrderBy = SortFilterState.TimeDesc;
  }
}

CardListStore.instance = new CardListStore();
export default CardListStore;
