import { GroupBasedAccessRule } from 'shared/model';
import { CommunityType } from './CommunityType';
import { OperatorModel } from './OperatorModel';

export default interface Community {
  id?: string;
  communityId?: string;
  courseId?: string;
  createdTime?: number;
  creatorId?: string;
  creatorName?: string;
  creatorIp?: string;
  deleted?: true;
  description?: string;
  field?: string;
  managerId?: string;
  managerName?: string;
  managerEmail?: string;
  managerCompany?: string;
  modifiedTime?: number;
  modifierId?: string;
  modifierIp?: string;
  name?: string;
  thumbnailId?: string;
  type?: CommunityType;
  visible?: string;
  memberCount?: number;
  operator?: OperatorModel;

  groupBasedAccessRule?: GroupBasedAccessRule;
}

export function getEmptyCommunity(): Community {
  return {};
}
