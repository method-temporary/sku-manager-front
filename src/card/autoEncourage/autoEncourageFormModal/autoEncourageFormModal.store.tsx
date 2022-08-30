import { action, observable } from 'mobx';

class AutoEncourageFormModalStore {
  static instance: AutoEncourageFormModalStore;

  @observable
  isOpen: boolean = false;

  @observable
  type: 'register' | 'modify' = 'register';

  @action.bound
  setIsOpenAutoEncourageFormModal(isOpen: boolean) {
    this.isOpen = isOpen;
  }

  @action.bound
  setAutoEncourageFormType(type: 'register' | 'modify') {
    this.type = type;
  }
}

AutoEncourageFormModalStore.instance = new AutoEncourageFormModalStore();
export default AutoEncourageFormModalStore;
