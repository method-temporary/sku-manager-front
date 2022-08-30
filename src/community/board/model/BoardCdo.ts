import Board from './Board';

export default interface BoardCdo {
  // typeId?: string;
  // fieldId?: string;
  // thumbnail?: string;
  // name?: string;
  // description?: string;
  // adminInfo?: string;
  // isOpend?: boolean;

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
}

// export function fromField(board: Board): BoardCdo {
//     const { title, order } = board
//     return { title, order };
// }

export function getBoardCdo(): BoardCdo {
  return {};
}
