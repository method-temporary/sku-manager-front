import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import moment, { Moment } from 'moment';
import AdditionalInfoForCommunityView from '../view/AdditionalInfoForCommunityView';
import { BoardService } from '../../index';

interface Props extends RouteComponentProps {
  boardService?: BoardService;
}

interface States {}

@inject('boardService')
@observer
@reactAutobind
class CreateBoardContainer extends React.Component<Props, States> {
  //
  onChangeBoardProps(name: string, value: string | boolean) {
    //
    const { boardService } = this.props;
    if (boardService) boardService.changeBoardProps(name, value);
  }

  onChangeBoardPeriodProps(name: string, value: Moment) {
    //
    const { boardService } = this.props;
    //if (name === 'learningPeriod.startDateMoment') boardService!.changeBoardProps(name, value.startOf('day'));
    boardService!.changeBoardProps(name, value.startOf('day'));
  }

  onClickUnlimitedPeriod() {
    //
    const { board } = this.props.boardService || ({} as BoardService);

    if (board) {
      if (board.learningPeriod.endDateDot === String('2100.12.30')) {
        this.onChangeBoardPeriodProps('learningPeriod.endDateMoment', moment().startOf('day'));
      } else {
        this.onChangeBoardPeriodProps('learningPeriod.endDateMoment', moment('2100-12-30').endOf('day'));
      }
    }
  }

  render() {
    const { board } = this.props.boardService || ({} as BoardService);
    return (
      <AdditionalInfoForCommunityView
        onChangeBoardProps={this.onChangeBoardProps}
        onChangeBoardPeriodProps={this.onChangeBoardPeriodProps}
        board={board}
        onClickUnlimitedPeriod={this.onClickUnlimitedPeriod}
      />
    );
  }
}

export default withRouter(CreateBoardContainer);
