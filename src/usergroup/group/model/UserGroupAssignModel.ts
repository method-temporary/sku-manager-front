import UserGroupSequenceModel from './UserGroupSequenceModel';
import { decorate, observable } from 'mobx';

export default class UserGroupAssignModel {
  //
  userIds: string[] = [];
  userGroupSequences: UserGroupSequenceModel = new UserGroupSequenceModel();

  constructor(userIds?: string[], userGroupSequenceMode?: UserGroupSequenceModel) {
    //
    if (userIds) {
      Object.assign(this.userIds, userIds);
    }

    if (userGroupSequenceMode) {
      this.userGroupSequences = userGroupSequenceMode;
    }
  }
}

decorate(UserGroupAssignModel, {
  userIds: observable,
});
