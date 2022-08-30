export type CommunityMemberApprovedType =
  | 'APPROVED'
  | 'WAITING'
  | 'REJECT'
  | 'DRAW';

export type CommunityMemberType =
  | 'MEMBER'
  | 'ADMIN';

export default interface Member {
  communityId?: string;
  memberId?: string;
  approved?: CommunityMemberApprovedType;
  name?: string;
  companyId?: string;
  companyName?: string;
  teamId?: string;
  teamName?: string;
  email?: string;
  nickname?: string;
  creatorId?: string;
  createdTime?: number;
  modifierId?: string;
  modifiedTime?: number;
  memberType?: CommunityMemberType;
  companyCode?: string;
}

export function getEmptyMember(): Member {
  return {};
}
