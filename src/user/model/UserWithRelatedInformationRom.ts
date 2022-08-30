import { UserModel } from './UserModel';
import { UserIdentityModel } from '../../cube/user/model/UserIdentityModel';
import { PisAgreementModel } from './PisAgreementModel';
import InvitationModel from './InvitationModel';

export default class UserWithRelatedInformationRom {
  //
  user: UserModel = new UserModel();
  // userIdentity: UserIdentityModel = new UserIdentityModel();
  // pisAgreement: PisAgreementModel = new PisAgreementModel();
  invitation: InvitationModel = new InvitationModel();

  constructor(userWithRelatedInformationRom?: UserWithRelatedInformationRom) {
    if (userWithRelatedInformationRom) {
      //
      const skProfile = new UserModel(userWithRelatedInformationRom.user);
      // const userIdentity = new UserIdentityModel(userWithRelatedInformationRom.userIdentity);
      // const pisAgreement = new PisAgreementModel(userWithRelatedInformationRom.pisAgreement);
      const invitation = new InvitationModel(userWithRelatedInformationRom.invitation);
      Object.assign(this, {
        ...userWithRelatedInformationRom,
        skProfile,
        // userIdentity,
        // pisAgreement,
        invitation,
      });
    }
  }
}
