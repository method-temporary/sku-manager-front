export default interface BoardRdo {
  searchFilter: string;
  name: string;
  creatorName: string;
  startDate: number;
  endDate: number;
  limit: number;
  offset: number;

  id?: string;
  boardId?: string;
  courseId?: string;
  createdTime?: number;
  creatorId?: string;
  creatorIp?: string;
  deleted?: true;
  description?: string;
  field?: string;
  managerId?: string;
  managerName?: string;
  modifiedTime?: number;
  modifierId?: string;
  modifierIp?: string;
  thumbnailId?: string;
  type?: string;
  visible?: string;
}
