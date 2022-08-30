import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { BoardService } from '../../index';
import BoardDetailView from '../view/BoardDetailView';

interface Props extends RouteComponentProps {
  boardService?: BoardService;
}

interface States {}

@inject('boardService')
@observer
@reactAutobind
class CreateBoardContainer extends React.Component<Props, States> {
  //
  render() {
    const { board } = this.props.boardService || ({} as BoardService);
    return (
      // Cube 관리 > create > Community
      // 교육정보
      <BoardDetailView board={board} />
    );
  }
}

export default withRouter(CreateBoardContainer);
