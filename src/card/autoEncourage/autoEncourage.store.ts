import { action, observable } from 'mobx';

class AutoEncourageStore {
  static instance: AutoEncourageStore;

  @observable
  cardId: string = '';

  @action.bound
  setCardId(id: string) {
    this.cardId = id;
  }
}

AutoEncourageStore.instance = new AutoEncourageStore();
export default AutoEncourageStore;
