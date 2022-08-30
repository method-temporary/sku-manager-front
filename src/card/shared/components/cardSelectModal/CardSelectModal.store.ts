import { action, observable } from 'mobx';
import CardRdo, { getEmptyCardRdo } from '_data/lecture/cards/model/CardRdo';
import { CardSearchPartType } from '../../../card/model/vo/CardSearchPartType';
import { CardWithAccessAndOptional } from './model/CardWithAccessAndOptional';

class CardSelectModalStore {
  //
  static instance = new CardSelectModalStore();

  @observable
  cardRdo: CardRdo = getEmptyCardRdo();

  @observable
  startDate: number = 0;

  @observable
  endDate: number = 0;

  @observable
  collegeId: string = '';

  @observable
  channelId: string = '';

  @observable
  searchPart: CardSearchPartType = '과정명';

  @observable
  searchWord: string = '';

  @observable
  offset: number = 1;

  @observable
  limit: number = 10;

  @observable
  selectedCards: CardWithAccessAndOptional[] = [];

  @action.bound
  setStartDate(startDate: number) {
    this.startDate = startDate;
  }

  @action.bound
  setEndDate(endDate: number) {
    this.endDate = endDate;
  }

  @action.bound
  setCollegeId(collegeId: string) {
    this.collegeId = collegeId;
  }

  @action.bound
  setChannelId(channelId: string) {
    this.channelId = channelId;
  }

  @action.bound
  setSearchPart(searchPart: CardSearchPartType) {
    this.searchPart = searchPart;
  }

  @action.bound
  setSearchWord(searchWord: string) {
    this.searchWord = searchWord;
  }

  @action.bound
  setOffset(offset: number) {
    this.offset = offset;
  }

  @action.bound
  setLimit(limit: number) {
    this.limit = limit;
  }

  @action.bound
  setSelectedCards(selectedCards: CardWithAccessAndOptional[]) {
    this.selectedCards = selectedCards;
  }

  @action.bound
  setCardRdo() {
    //
    this.cardRdo = {
      startDate: this.startDate,
      endDate: this.endDate,
      collegeId: this.collegeId,
      channelId: this.channelId,
      name: this.searchPart === '과정명' ? this.searchWord.replaceAll('"', '\\"') : '',
      registrantName: this.searchPart === '생성자' ? this.searchWord : '',
      offset: (this.offset - 1) * this.limit,
      limit: this.limit,
      sharedOnly: false,
    };
  }

  @action.bound
  setCardRdoForPage(isSearch: boolean) {
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
  reset() {
    this.startDate = 0;
    this.endDate = 0;
    this.collegeId = '';
    this.channelId = '';
    this.searchPart = '과정명';
    this.searchWord = '';
    this.offset = 1;
    this.limit = 10;
    this.selectedCards = [];
  }
}

CardSelectModalStore.instance = new CardSelectModalStore();
export default CardSelectModalStore;
