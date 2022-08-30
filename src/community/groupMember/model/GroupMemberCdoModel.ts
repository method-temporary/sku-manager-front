import { decorate, observable } from 'mobx';

export default class GroupMemberCdoModel {
  communityId: string = '';
  memberId: string = '';
  approved: boolean = false;
  admin: boolean = false;

  static asCdo(memeberId: string | undefined): GroupMemberCdoModel {
    //
    return <GroupMemberCdoModel>{
      memberId: memeberId,
      admin: true,
    };
  }
}

decorate(GroupMemberCdoModel, {
  communityId: observable,
  memberId: observable,
  approved: observable,
  admin: observable,
});
