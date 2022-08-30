import { decorate, observable } from 'mobx';

export default class GroupCdoModel {
  groupId: string = '';
  communityId: string = '';
  name: string = '';
  introduce: string = '';
  managerId: string = '';
  managerName: string = '';
  creatorId: string = '';
  createdTime: number = 0;
  modifierId: string = '';
  modifiedTime: number = 0;

  static isBlank(groupCdo: GroupCdoModel): string {
    if (!groupCdo.name) return '그룹명';
    if (!groupCdo.introduce) return '그룹설명';

    return 'success';
  }
}

decorate(GroupCdoModel, {
  groupId: observable,
  communityId: observable,
  name: observable,
  introduce: observable,
  managerId: observable,
  creatorId: observable,
  createdTime: observable,
  modifierId: observable,
  modifiedTime: observable,
  managerName: observable,
});
