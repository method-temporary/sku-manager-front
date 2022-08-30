import { observable, action, computed } from 'mobx';
import Field from '../model/Field';

class FieldStore {
  static instance: FieldStore;

  @observable
  innerFieldList: Field[] = [];

  @action
  setFieldList(next: Field[]) {
    this.innerFieldList = next;
  }

  @computed
  get fieldList() {
    return this.innerFieldList;
  }

  @action
  changeTitle(id: string, next: string) {
    const field = this.innerFieldList.find(c => c.id === id);
    if (field === undefined) {
      return;
    }
    field.title = next;
  }
}

FieldStore.instance = new FieldStore();

export default FieldStore;