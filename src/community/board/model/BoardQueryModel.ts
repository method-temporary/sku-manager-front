import { decorate, observable } from 'mobx';
import { QueryModel } from 'shared/model';
import BoardRdo from './BoardRdo';

export class BoardQueryModel extends QueryModel {
  searchFilter: string = '';
  popup: boolean = false;
  precedence: boolean | undefined = false;

  currentPage: number = 0;
  page: number = 0;
  pageIndex: number = 0;
  arrangeType: string = '';

  ownBoardId: string | undefined;

  type: string = '';
  field: string = '';
  isOpend: string = '';

  boardId: string = '';

  static asBoardRdo(boardQuery: BoardQueryModel): BoardRdo {
    //
    let isName = false;
    let isWord = false;
    let isAdmin = false;
    if (boardQuery.searchPart === '커뮤니티명') isName = true;
    if (boardQuery.searchPart === '생성자') isWord = true;
    if (boardQuery.searchPart === '관리자') isAdmin = true;
    return {
      startDate: boardQuery.period.startDateLong,
      endDate: boardQuery.period.endDateLong,
      name: (isName && boardQuery && encodeURIComponent(boardQuery.searchWord)) || '',
      creatorName: (isWord && boardQuery && encodeURIComponent(boardQuery.searchWord)) || '',
      managerId: (isAdmin && boardQuery && encodeURIComponent(boardQuery.searchWord)) || '',
      offset: boardQuery.offset,
      limit: boardQuery.limit,
      searchFilter: boardQuery.searchFilter,
      type: boardQuery.type,
      field: boardQuery.field,
      visible: boardQuery.isOpend,
      boardId: boardQuery.boardId,
    };
  }
}

decorate(BoardQueryModel, {
  searchFilter: observable,
  popup: observable,
  currentPage: observable,
  precedence: observable,
  isOpend: observable,
  type: observable,
  field: observable,
  page: observable,
});
