import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Container } from 'semantic-ui-react';

import { alert, AlertModel } from 'shared/components';
import {displayManagementUrl} from '../../../../Routes';
import MainPagePopupDetailView from '../view/MainPagePopupDetailView';
import {MainPagePopupService} from "../../../index";

interface Params {
  cineroomId: string;
  popupId: string;
}

interface Props extends RouteComponentProps<Params> {}

interface States {

}

interface Injected {
  mainPagePopupService: MainPagePopupService;
}

@inject('mainPagePopupService')
@observer
@reactAutobind
class MainPagePopupDetailContainer extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);
  }

  componentDidMount(): void {
    //
    this.init();
  }

  init() {
    //
    const { mainPagePopupService } = this.injected;
    const { popupId } = this.props.match.params;

    Promise.resolve().then(() => {
        mainPagePopupService.findMainPagePopup(popupId);
    });
  }

  routeToMainPagePopupList() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${displayManagementUrl}/popup/mainPagePopup`
    );
  }

  routeToModifyMainPagePopup(popupId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${displayManagementUrl}/popup/mainPagePopup/modify/${popupId}`
    );
  }

  changeDateToString(date: Date) {
    //
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('.');
  }

  render() {
    const { mainPagePopup } = this.injected.mainPagePopupService;

    return (
      <Container fluid>
        <MainPagePopupDetailView
          popup={mainPagePopup}
          routeToMainPagePopupList={this.routeToMainPagePopupList}
          routeToModifyMainPagePopup={this.routeToModifyMainPagePopup}
          changeDateToString={this.changeDateToString}
        />
      </Container>
    );
  }
}

export default withRouter(MainPagePopupDetailContainer);
