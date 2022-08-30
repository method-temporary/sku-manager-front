import { decorate, observable } from 'mobx';

class UserGroupRuleModel {
  //
  categoryId: string = '';
  categoryName: string = '';
  userGroupId: string = '';
  userGroupName: string = '';

  // userGroup Seq 로 한다는 말이 있었음...
  seq: number = 0;

  constructor(categoryId?: string, categoryName?: string, userGroupId?: string, userGroupName?: string, seq?: number) {
    this.categoryId = categoryId || '';
    this.categoryName = categoryName || '';
    this.userGroupId = userGroupId || '';
    this.userGroupName = userGroupName || '';
    this.seq = seq || 0;
  }
}

decorate(UserGroupRuleModel, {
  categoryId: observable,
  categoryName: observable,
  userGroupId: observable,
  userGroupName: observable,
  seq: observable,
});

export default UserGroupRuleModel;
