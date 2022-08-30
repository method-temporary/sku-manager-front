import { action, computed, observable } from 'mobx';
import { AutoEncourageCardParams } from '_data/lecture/cards/model/AutoEncourageCardParams';

class AutoEncourageCopyModalStore {
  static instance: AutoEncourageCopyModalStore;

  @observable
  cardName: string = '';

  @observable
  selectedCardIds: string[] = [];

  @observable
  selectedChannelId: string = '';

  @observable
  selectedCollegeId: string = '';

  @observable
  offset: number = 1;

  @computed
  get autoEncourageCardParams(): AutoEncourageCardParams {
    return {
      cardName: this.cardName,
      channelId: this.selectedChannelId,
      collegeId: this.selectedCollegeId,
      limit: 10,
      offset: (this.offset - 1) * 10,
    };
  }

  @action.bound
  setCollege(collegeId: string) {
    this.selectedCollegeId = collegeId;
  }

  @action.bound
  setChannel(channelId: string) {
    this.selectedChannelId = channelId;
  }

  @action.bound
  setSelectedCardIds(cardIds: string[]) {
    this.selectedCardIds = cardIds;
  }

  @action.bound
  setCardName(searchWord: string) {
    this.offset = 1;
    this.cardName = searchWord;
  }

  @action.bound
  setOffset(activePage: number) {
    this.offset = activePage;
  }

  @action.bound
  AutoEncourageCopyModalStoreReset() {
    this.cardName = '';
    this.selectedCardIds = [];
    this.selectedChannelId = '';
    this.selectedCollegeId = '';
    this.offset = 1;
  }
}

AutoEncourageCopyModalStore.instance = new AutoEncourageCopyModalStore();
export default AutoEncourageCopyModalStore;
