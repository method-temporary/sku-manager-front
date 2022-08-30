import { observable, action, computed } from 'mobx';
import { DeliveryType } from 'card/card/model/encourage/AutoEncourageQdo';
import { AutoEncourageParams } from '_data/lecture/autoEncourage/model/AutoEncourageQdo';
import AutoEncourageStore from '../autoEncourage.store';

interface HistoryTabState {
  autoEncourageId: string;
  encourageTitle: string;
  offset: number;
  limit: number;
  deliveryType: DeliveryType;
  selectedAutoEncourageIds: string[];
  round?: number;
}

class HistoryTabStore {
  static instance: HistoryTabStore;

  @observable
  historyTabState: HistoryTabState = {
    autoEncourageId: '',
    encourageTitle: '',
    offset: 1,
    limit: 20,
    deliveryType: '',
    selectedAutoEncourageIds: [],
    round: 1,
  };

  @computed
  get autoEncourageParams(): AutoEncourageParams {
    const { encourageTitle, limit, offset, deliveryType, round } = this.historyTabState;

    return {
      cardId: AutoEncourageStore.instance.cardId,
      title: encourageTitle,
      offset: (offset - 1) * limit,
      limit,
      startTime: undefined,
      endTime: undefined,
      deliveryType,
      target: {},
      round,
    };
  }

  @action.bound
  setAutoEncourageId(id: string) {
    this.historyTabState.autoEncourageId = id;
  }

  @action.bound
  setEncourageTitle(searchWord: string) {
    this.historyTabState.encourageTitle = searchWord;
  }

  @action.bound
  setOffset(offset: number) {
    this.historyTabState.offset = offset;
  }

  @action.bound
  setLimit(limit: number) {
    this.historyTabState.limit = limit;
  }

  @action.bound
  setSelectedAutoEncourageIds(ids: string[]) {
    this.historyTabState.selectedAutoEncourageIds = ids;
  }

  @action.bound
  setRound(round?: number) {
    this.historyTabState.round = round;
  }

  @action.bound
  initHistoryTabState() {
    this.historyTabState.encourageTitle = '';
    this.historyTabState.offset = 1;
    this.historyTabState.limit = 20;
    this.historyTabState.deliveryType = '';
    this.historyTabState.selectedAutoEncourageIds = [];
    this.historyTabState.round = undefined;
  }
}

HistoryTabStore.instance = new HistoryTabStore();
export default HistoryTabStore;
