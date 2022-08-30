import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import moment, { Moment } from 'moment';
import AdditionalInfoForCommunityView from '../view/AdditionalInfoForCommunityView';
import { BoardService } from '../../../../../cubetype';

interface Props extends RouteComponentProps {}

interface States {}

interface Injected {
  boardService: BoardService;
}

@inject('boardService')
@observer
@reactAutobind
class CreateBoardContainer extends ReactComponent<Props, States, Injected> {
  //
  onChangeBoardProps(name: string, value: string | boolean) {
    //
    const { boardService } = this.injected;
    if (boardService) boardService.changeBoardProps(name, value);
  }

  onChangeBoardPeriodProps(name: string, value: Moment) {
    //
    const { boardService } = this.injected;
    //if (name === 'learningPeriod.startDateMoment') boardService!.changeBoardProps(name, value.startOf('day'));
    boardService!.changeBoardProps(name, value.startOf('day'));
  }

  onClickUnlimitedPeriod() {
    //
    const { board } = this.injected.boardService;

    if (board) {
      if (board.learningPeriod.endDateDot === String('2100.12.30')) {
        this.onChangeBoardPeriodProps('learningPeriod.endDateMoment', moment().startOf('day'));
      } else {
        this.onChangeBoardPeriodProps('learningPeriod.endDateMoment', moment('2100-12-30').endOf('day'));
      }
    }
  }

  render() {
    const { board } = this.injected.boardService;
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
