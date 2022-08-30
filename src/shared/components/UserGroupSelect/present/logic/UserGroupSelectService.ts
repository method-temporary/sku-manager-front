import { action, observable } from 'mobx';
import { autobind } from '@nara.platform/accent';

@autobind
class UserGroupSelectService {
  //
  static instance: UserGroupSelectService;

  @observable
  selectedCategoryId: string = '';

  @observable
  selectedCategoryName: string = '';

  @action
  setSelectCategoryId(id: string) {
    //
    this.selectedCategoryId = id;
  }

  @action
  setSelectCategoryName(name: string) {
    //
    this.selectedCategoryName = name;
  }

  @action
  clearSelectedCategoryId() {
    //
    this.selectedCategoryId = '';
  }

  @action
  clearSelectedCategoryName() {
    //
    this.selectedCategoryName = '';
  }
}

UserGroupSelectService.instance = new UserGroupSelectService();
export default UserGroupSelectService;
