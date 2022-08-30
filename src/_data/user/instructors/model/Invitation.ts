import { DeliveryMethod } from './vo/DeliveryMethod';

export interface Invitation {
  //
  targetUserId: string;
  deliveryMethods: DeliveryMethod[];
  invitationTime: number;
  byEmail: boolean;
  bySms: boolean;
  sender: string;
}

export function getInitInvitation() {
  //
  return {
    targetUserId: '',
    deliveryMethods: [],
    invitationTime: 0,
    byEmail: false,
    bySms: false,
    sender: '',
  };
}
