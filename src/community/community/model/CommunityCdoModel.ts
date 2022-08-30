import { decorate, observable } from 'mobx';
import { GroupBasedAccessRule } from 'shared/model';
import { CommunityType } from './CommunityType';
import { OperatorModel } from './OperatorModel';

export default class CommunityCdoModel {
  communityId: string = '';
  // courseId: string = '';
  deleted: boolean = false;
  description: string = '';
  secretNumber: string = '';
  field: string = '';
  managerId: string = '';
  managerName: string = '';
  managerEmail: string = '';
  managerCompany: string = '';
  name: string = '';
  thumbnailId: string = '';
  type: CommunityType = 'OPEN';
  visible: string = '0';
  operator: OperatorModel = new OperatorModel();
  memberCount: number = 0;
  allowSelfJoin: number = 0;

  groupBasedAccessRule: GroupBasedAccessRule = new GroupBasedAccessRule();

  static isBlank(communityCdo: CommunityCdoModel): string {
    if (communityCdo.type === 'OPEN') {
      if (!communityCdo.field) return '분야';
      // if (!communityCdo.thumbnailId) return '썸네일';
      if (!communityCdo.description) return '커뮤니티 설명';
    }

    if (!communityCdo.thumbnailId) return '썸네일';
    if (!communityCdo.name) return '커뮤니티명 ';
    if (!communityCdo.managerName) return '관리자 정보';

    return 'success';
  }
}

decorate(CommunityCdoModel, {
  communityId: observable,
  // courseId: observable,
  deleted: observable,
  description: observable,
  field: observable,
  managerId: observable,
  managerName: observable,
  managerCompany: observable,
  name: observable,
  thumbnailId: observable,
  type: observable,
  visible: observable,
  operator: observable,
  secretNumber: observable,
  memberCount: observable,
  allowSelfJoin: observable,

  groupBasedAccessRule: observable,
});
