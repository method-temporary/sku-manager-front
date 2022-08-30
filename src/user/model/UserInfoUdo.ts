import moment from 'moment';
import { UserInfoUdoQueryModel } from './UserInfoUdoQueryModel';
import { UserGroupSequenceModel } from '../../usergroup/group/model';

export class UserInfoUdo {
  //
  gender?: string = '';
  birthDate?: string = '';
  email: string = '';
  userGroupSequences: UserGroupSequenceModel = new UserGroupSequenceModel();

  constructor(skProfileInfoUdoQuery?: UserInfoUdoQueryModel) {
    //
    if (skProfileInfoUdoQuery) {
      this.gender = skProfileInfoUdoQuery.gender || undefined;
      this.birthDate = skProfileInfoUdoQuery.birthDate
        ? moment(new Date(skProfileInfoUdoQuery.birthDate)).format('yyyy-MM-DD')
        : undefined;
      this.email = skProfileInfoUdoQuery.email;
      this.userGroupSequences = skProfileInfoUdoQuery.userGroupSequences;
    }
  }
}
