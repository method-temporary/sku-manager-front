import { decorate, observable } from 'mobx';
import { UserModel } from './UserModel';
import moment from 'moment';
import { UserGroupSequenceModel } from '../../usergroup/group/model';

export class UserInfoUdoQueryModel {
  //
  gender: string = '';
  birthDate: string = '';
  email: string = '';
  userGroupSequences: UserGroupSequenceModel = new UserGroupSequenceModel();

  constructor(userModel?: UserModel) {
    //
    if (userModel) {
      this.gender = userModel.gender;
      this.birthDate = userModel.birthDate ? moment(new Date(userModel.birthDate)).format('yyyy-MM-DD') : '';
      this.email = userModel.email;
      this.userGroupSequences = userModel.userGroupSequences;
    }
  }
}

decorate(UserInfoUdoQueryModel, {
  gender: observable,
  birthDate: observable,
});
