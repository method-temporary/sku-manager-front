import UserGroupSequenceModel from './UserGroupSequenceModel';
import { decorate, observable } from 'mobx';

export default class UserGroupEmailsModel {
  //
  emails: string[] = [];
  userGroupSequences: UserGroupSequenceModel = new UserGroupSequenceModel();

  constructor(emails?: string[], userGroupSequences?: UserGroupSequenceModel) {
    //
    if (emails) {
      Object.assign(this.emails, { ...emails });
    }

    if (userGroupSequences) {
      this.userGroupSequences = userGroupSequences;
    }
  }
}

decorate(UserGroupEmailsModel, {
  emails: observable,
});
