export default interface Member {
  communityId?: string;
  memberId?: string;
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
}

export function getEmptyMember(): Member {
  return {};
}
