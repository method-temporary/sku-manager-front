export default interface GroupMember {
  communityId?: string;
  groupMemberId?: string;
  approved?: boolean;
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

  memberId?: string;
  groupId?: string;
}

export function getEmptyGroupMember(): GroupMember {
  return {};
}
