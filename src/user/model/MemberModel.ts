import { decorate, observable } from 'mobx';

export class MemberModel {
  citizenId: string = '';

  constructor(member?: MemberModel) {
    if (member) Object.assign(this, { ...member });
  }
}

decorate(MemberModel, {
  citizenId: observable,
});
