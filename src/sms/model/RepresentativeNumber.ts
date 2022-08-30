import { UserIdentityModel } from 'cube/user/model/UserIdentityModel';

export interface RepresentativeNumberWithUserIdentity {
  representativeNumber: RepresentativeNumber;
  simpleUserIdentity: UserIdentityModel;
}

export interface RepresentativeNumber {
  enabled: boolean;
  id: string;
  modifiedTime: number;
  modifier: string;
  name: string;
  phone: string;
  registeredTime: number;
  registrant: string;
}
