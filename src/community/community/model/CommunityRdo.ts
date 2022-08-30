export default interface CommunityRdo {
  searchFilter: string;
  name: string;
  creatorName?: string;
  startDate: number;
  endDate: number;
  limit: number;
  offset: number;

  id?: string;
  communityId?: string;
  courseId?: string;
  createdTime?: number;
  creatorId?: string;
  deleted?: true;
  description?: string;
  field?: string;
  managerId?: string;
  managerName?: string;
  modifiedTime?: number;
  modifierId?: string;
  thumbnailId?: string;
  type?: string;
  visible?: string;

  userGroupSequences?: number[];
}
