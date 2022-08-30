import { decorate, observable } from 'mobx';
import BoardCdo from './BoardCdo';

export default class BoardCdoModel {
  boardId: string = '';
  courseId: string = '';
  // createdTime: number = 0;
  // creatorId: string = '';
  // creatorIp: string = '';
  deleted: boolean = false;
  description: string = '';
  field: string = '';
  managerId: string = '';
  managerName: string = '';
  // modifiedTime: number = 0;
  // modifierId: string = '';
  // modifierIp: string = '';
  name: string = '';
  thumbnailId: string = '';
  type: string = 'Open';
  visible: string = '0';

  static isBlank(boardCdo: BoardCdoModel): string {
    if (boardCdo.type === 'Open') {
      if (!boardCdo.field) return '분야';
      if (!boardCdo.thumbnailId) return '썸네일';
    } else if (boardCdo.type === 'Learning') {
      if (!boardCdo.courseId) return 'Course 선택';
    }

    if (!boardCdo.name) return '커뮤니티명 ';
    if (!boardCdo.description) return '커뮤니티 설명';
    if (!boardCdo.managerId) return '관리자 정보';

    return 'success';
  }
}

decorate(BoardCdoModel, {
  boardId: observable,
  courseId: observable,
  // createdTime: observable,
  // creatorId: observable,
  // creatorIp: observable,
  deleted: observable,
  description: observable,
  field: observable,
  managerId: observable,
  managerName: observable,
  // modifiedTime: observable,
  // modifierId: observable,
  // modifierIp: observable,
  name: observable,
  thumbnailId: observable,
  type: observable,
  visible: observable,
});
