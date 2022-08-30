import { UserModel } from './UserModel';
import { UserIdentityModel } from '../../cube/user/model/UserIdentityModel';
import { PisAgreementModel } from './PisAgreementModel';

export class UserWithContents {
  //
  user: UserModel = new UserModel();
  userIdentity: UserIdentityModel = new UserIdentityModel();
  pisAgreement: PisAgreementModel = new PisAgreementModel();

  constructor(skProfileWithContents?: UserWithContents) {
    //
    if (skProfileWithContents) {
      const skProfile = new UserModel(skProfileWithContents.user);
      const userIdentity = new UserIdentityModel(skProfileWithContents.userIdentity);
      const pisAgreement = new PisAgreementModel(skProfileWithContents.pisAgreement);

      Object.assign(this, { skProfile, userIdentity, pisAgreement });
    }
  }
}
