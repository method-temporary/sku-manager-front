import { decorate, observable } from 'mobx';

export default class MemberCdoModel {
  communityId: string = '';
  memberId: string = '';
  approved: boolean = false;
}
decorate(MemberCdoModel, {
  communityId: observable,
  memberId: observable,
  approved: observable,
});
