import { UserModel } from './UserModel';
import { PisAgreementModel } from './PisAgreementModel';

export class UserWithPisAgreement {
  //
  user: UserModel = new UserModel();
  pisAgreement: PisAgreementModel = new PisAgreementModel();

  constructor(userWithPisAgreement: UserWithPisAgreement) {
    if (userWithPisAgreement) {
      const user = new UserModel(userWithPisAgreement.user);
      const pisAgreement = new PisAgreementModel(userWithPisAgreement.pisAgreement);

      Object.assign(this, { user, pisAgreement });
    }
  }
}
