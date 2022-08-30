import { computed, decorate, observable } from 'mobx';
import moment from 'moment';

import { MemberViewModel } from '@nara.drama/approval';

import { PolyglotModel } from 'shared/model';

import { UserModel } from '../../../user/model/UserModel';

export default class UserGroupMemberModel {
  //
  memberView: MemberViewModel = new MemberViewModel();
  registeredTime: number = 0;

  checked: boolean = false;

  constructor(user: UserModel) {
    //
    if (user) {
      const newMember = new MemberViewModel();
      newMember.id = user.id;
      newMember.employeeId = user.employeeId;
      newMember.name = new PolyglotModel(user.name);
      newMember.companyCode = user.companyCode;
      newMember.companyName = new PolyglotModel(user.companyName);
      newMember.departmentCode = user.departmentCode;
      newMember.departmentName = new PolyglotModel(user.departmentName);
      newMember.email = user.email;

      Object.assign(this, {
        memberView: newMember,
        registeredTime: user.registeredTime,
      });
    }
  }

  @computed
  get getRegisteredTime() {
    //
    let creationTime = '미가입';

    if (this.registeredTime !== 0) {
      creationTime = moment(this.registeredTime).format('yyyy-MM-DD');
    }
    return creationTime;
  }
}

decorate(UserGroupMemberModel, {
  memberView: observable,
  registeredTime: observable,
  checked: observable,
});
