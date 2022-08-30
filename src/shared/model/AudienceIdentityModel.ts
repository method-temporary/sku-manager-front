import DramaEntityObservableModel from './DramaEntityObservableModel';
import { AudienceState } from './AudienceState';
import { AudienceType } from './AudienceType';
import { AudienceRoleList } from './AudienceRoleList';
import { decorate, observable } from 'mobx';

export default class AudienceIdentity extends DramaEntityObservableModel {
  //
  citizenId: string = '';
  loginId: string = '';
  cineroomId: string = '';

  displayName: string = '';

  usid: string = '';

  state: AudienceState = AudienceState.Active;
  type: AudienceType = AudienceType.Regular;
  audienceRoles: AudienceRoleList = new AudienceRoleList();

  constructor(audienceIdentity?: AudienceIdentity) {
    super();
    if (audienceIdentity) {
      Object.assign(this, { ...audienceIdentity });
    }
  }
}

decorate(AudienceIdentity, {
  citizenId: observable,
  loginId: observable,
  cineroomId: observable,

  displayName: observable,

  usid: observable,

  state: observable,
  type: observable,
  audienceRoles: observable,
});
