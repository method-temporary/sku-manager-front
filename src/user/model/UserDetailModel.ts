import { UserModel } from './UserModel';
import { AdditionalUserInfo } from './AdditionalUserInfo';
import { PisAgreementModel } from './PisAgreementModel';

export class UserDetailModel {
  //
  user: UserModel = new UserModel();
  additionalUserInfo: AdditionalUserInfo = new AdditionalUserInfo();
  pisAgreement: PisAgreementModel = new PisAgreementModel();

  constructor(userDetailModel?: UserDetailModel) {
    if (userDetailModel) {
      const user = new UserModel(userDetailModel.user);
      const additionalUserInfo = new AdditionalUserInfo(userDetailModel.additionalUserInfo);
      const pisAgreement = new PisAgreementModel(userDetailModel.pisAgreement);

      Object.assign(this, { user, additionalUserInfo, pisAgreement });
    }
  }
}
