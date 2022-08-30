import { DramaEntityObservableModel } from 'shared/model';
import { DeliveryMethod } from './DeliveryMethod';
import { decorate, observable } from 'mobx';

export default class InvitationModel extends DramaEntityObservableModel {
  //
  targetUserId: string = '';
  deliveryMethods: DeliveryMethod[] = [];
  invitationTime: number = 0;
  byEmail: boolean = false;
  bySms: boolean = false;
  sender: string = '';

  constructor(invitation?: InvitationModel) {
    super();
    if (invitation) {
      //
      let bySms: boolean = invitation.bySms ? invitation.bySms : false;
      let byEmail: boolean = invitation.byEmail ? invitation.byEmail : false;

      if (invitation.deliveryMethods && invitation.deliveryMethods.includes(DeliveryMethod.SMS)) {
        bySms = true;
      }

      if (invitation.deliveryMethods && invitation.deliveryMethods.includes(DeliveryMethod.EMAIL)) {
        byEmail = true;
      }

      Object.assign(this, { ...invitation, bySms, byEmail });
    }
  }
}

decorate(InvitationModel, {
  targetUserId: observable,
  // deliveryMethods: observable,
  invitationTime: observable,
});
