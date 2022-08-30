import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { BoardQueryModel } from '../../model/BoardQueryModel';
import { useBoardList } from '../../service/useBoardList';
import BoardListView from '../view/BoardListView';
import { useFieldList } from '../../../field/service/useFieldList';

interface BoardListContainerProps extends RouteComponentProps<{ cineroomId: string; postId: string }> {}

const BoardListContainer: React.FC<BoardListContainerProps> = function BoardListContainer(props) {
  const [fieldList] = useFieldList();

  const history = useHistory();
  function routeToBoardCreate() {
    history.push(`/cineroom/${props.match.params.cineroomId}/board-management/board/board-create`);
  }

  function routeToBoardDetail(boardId: string, postId: string) {
    history.push(
      `/cineroom/${props.match.params.cineroomId}/community-management/community/board-detail/${boardId}/${postId}`
    );
  }

  const [
    boardList,
    requestBoardList,
    limit,
    changeLimit,
    changeBoardQueryProps,
    searchQuery,
    boardQuery,
    clearBoardQuery,
    selectField,
    sharedService,
  ] = useBoardList();
  //const { results, empty, totalCount, offset } = boardList;

  return (
    <BoardListView
      searchQuery={searchQuery}
      boardQueryModel={boardQuery}
      changeBoardQueryProps={changeBoardQueryProps}
      field={boardQuery.field}
      clearBoardQuery={clearBoardQuery}
      selectField={selectField(fieldList)}
      boardList={boardList}
      routeToBoardDetail={routeToBoardDetail}
      sharedService={sharedService}
    />
  );
};

export default withRouter(BoardListContainer);
