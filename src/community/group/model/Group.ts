export default interface Group {
  groupId?: string;
  communityId?: string;
  name?: string;
  introduce?: string;
  managerName?: string;
  managerId?: string;
  memberCount?: number;
  creatorId?: string;
  createdTime?: number;
  modifierId?: string;
  modifiedTime?: number;
}

export function getEmptyGroup(): Group {
  return {};
}
