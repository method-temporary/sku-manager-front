export default interface Board {
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
  name?: string;
  thumbnailId?: string;
  type?: string;
  visible?: string;

  title?: string;
  pinned?: string;
  writer?: string;
  time?: string;
}

export function getEmptyBoard(): Board {
  return {};
}
