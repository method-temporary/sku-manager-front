import { action, observable } from 'mobx';
import { PermittedCineroomWithParentId } from '../../model';

class PermittedCineroomModalStore {
  //
  static instance: PermittedCineroomModalStore;

  @observable
  isAll: boolean = false;

  @observable
  isRequireAll: boolean = false;

  @observable
  selectPermittedCinerooms: PermittedCineroomWithParentId[] = [];

  @action.bound
  setIsAll(isAll: boolean) {
    this.isAll = isAll;
  }

  @action.bound
  setIsRequireAll(isRequireAll: boolean) {
    this.isRequireAll = isRequireAll;
  }

  @action.bound
  setSelectPermittedCinerooms(selectPermittedCinerooms: PermittedCineroomWithParentId[]) {
    this.selectPermittedCinerooms = selectPermittedCinerooms;
  }

  @action.bound
  reset() {
    this.isAll = false;
    this.isRequireAll = false;
    this.selectPermittedCinerooms = [];
  }
}

PermittedCineroomModalStore.instance = new PermittedCineroomModalStore();
export default PermittedCineroomModalStore;
