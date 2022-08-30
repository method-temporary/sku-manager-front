import { decorate, observable } from 'mobx';

export default class UserGroupEmailExcelResultModel {
  //
  failedEmails: string[] = [];
  requestCount: number = 0;
  successCount: number = 0;

  constructor(failedEmails?: string[]) {
    //
    if (failedEmails) {
      Object.assign(this.failedEmails, failedEmails);
    }
  }
}

decorate(UserGroupEmailExcelResultModel, {
  failedEmails: observable,
  requestCount: observable,
  successCount: observable,
});
