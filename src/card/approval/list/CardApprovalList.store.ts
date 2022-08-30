import { action, observable } from 'mobx';
import { CardSearchPartType } from '../../card/model/vo/CardSearchPartType';
import CardRdo from '../../../_data/lecture/cards/model/CardRdo';
import { getInitCardApprovalRdo } from './CardApproval.util';

class CardApprovalListStore {
  //
  static instance: CardApprovalListStore;

  @observable
  cardApprovalRdo: CardRdo = getInitCardApprovalRdo();

  @observable
  startDate: number = 0;

  @observable
  endDate: number = 0;

  @observable
  collegeId: string = '';

  @observable
  channelId: string = '';

  @observable
  cardState: string = '전체';

  @observable
  searchPart: CardSearchPartType = '과정명';

  @observable
  searchWord: string = '';

  @observable
  offset: number = 1;

  @observable
  limit: number = 20;

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
  setCardState(cardState: string) {
    //
    this.cardState = cardState;
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
  setCardApprovalRdo() {
    //
    this.cardApprovalRdo = {
      startDate: this.startDate,
      endDate: this.endDate,
      collegeId: this.collegeId,
      channelId: this.channelId,
      cardState: this.cardState === '전체' ? ['Opened', 'OpenApproval', 'Rejected'] : this.cardState,
      name: this.searchPart === '과정명' ? this.searchWord.replaceAll('"', '\\"') : '',
      registrantName: this.searchPart === '생성자' ? this.searchWord : '',
      offset: (this.offset - 1) * this.limit,
      limit: this.limit,
    };
  }

  @action.bound
  setCardApprovalRdoForPage(isSearch: boolean) {
    //
    if (isSearch) {
      this.setCardApprovalRdo();
    } else {
      this.cardApprovalRdo = {
        ...this.cardApprovalRdo,
        offset: (this.offset - 1) * this.limit,
      };
    }
  }
}

CardApprovalListStore.instance = new CardApprovalListStore();
export default CardApprovalListStore;
