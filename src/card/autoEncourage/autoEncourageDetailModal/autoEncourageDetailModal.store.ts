import { action, observable } from 'mobx';

class AutoEncourageDetailModalStore {
  static instance: AutoEncourageDetailModalStore;

  @observable
  isOpen: boolean = false;

  @observable
  activeIndex: number = 0;

  @action.bound
  setIsOpen(isOpen: boolean) {
    this.isOpen = isOpen;
  }

  @action.bound
  setActiveIndex(tabIndex: number) {
    this.activeIndex = tabIndex;
  }
}

AutoEncourageDetailModalStore.instance = new AutoEncourageDetailModalStore();
export default AutoEncourageDetailModalStore;
