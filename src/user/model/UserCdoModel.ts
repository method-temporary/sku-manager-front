import { decorate, observable } from 'mobx';
import { MemberLocaleModel } from './MemberLocaleModel';
import { EmployeeModel } from './EmployeeModel';

export class UserCdoModel {
  member: EmployeeModel = new EmployeeModel();
  memberLocale: MemberLocaleModel = new MemberLocaleModel();

  constructor(skProfile?: UserCdoModel) {
    //
    if (skProfile) {
      const member = (skProfile.member && new EmployeeModel()) || this.member;
      const memberLocale = (skProfile.memberLocale && new MemberLocaleModel()) || this.memberLocale;
      Object.assign(this, { ...skProfile, member, memberLocale });
    }
  }
}

decorate(UserCdoModel, {
  member: observable,
  memberLocale: observable,
});
