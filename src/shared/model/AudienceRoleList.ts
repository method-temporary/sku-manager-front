import { decorate, observable } from 'mobx';

export class AudienceRoleList {
  //
  roleKeys: string[] = [];
}

decorate(AudienceRoleList, {
  roleKeys: observable,
});
