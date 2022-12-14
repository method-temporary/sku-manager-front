import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Button, Container, Form, Breadcrumb, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { reactAutobind } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import { Polyglot, Loader } from 'shared/components';
import { AlertWin } from 'shared/ui';

import { learningManagementUrl } from '../../../Routes';
import { CollegeService } from '../../../college';
import { AplService } from '../../index';
import { APL_FOCUS_MAP } from '../../model/AplValidationData';
import { AplState } from '../../model/AplState';
import { AplModel } from '../../model/AplModel';
import AplDetailView from '../view/AplDetailView';
import AplBasicInfoContainer from '../view/AplBasicInfoContainer';

interface Props
  extends RouteComponentProps<{
    cineroomId: string;
    aplId: string;
    aplState: string;
  }> {
  aplService: AplService;
  sharedService?: SharedService;
  collegeService?: CollegeService;
}

interface States {
  alertWinOpen: boolean;
  alertIcon: string;
  alertTitle: string;
  alertType: string;
  alertMessage: string;
  saveAplOn: boolean;
  focusControlName: string;
  objStr: string;
  focusYn: string;
}

@inject('aplService', 'sharedService', 'collegeService')
@observer
@reactAutobind
class AplDetailContainer extends React.Component<Props, States> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      alertWinOpen: false,
      alertMessage: '',
      alertIcon: '',
      alertTitle: '',
      alertType: '',
      saveAplOn: false,
      focusControlName: '',
      objStr: '',
      focusYn: '',
    };
  }

  onChangeAplProps(name: string, value: string | number | {} | []) {
    //
    const { aplService } = this.props;
    if (aplService) aplService.changeAplProps(name, value);
  }

  confirmBlank(message: string | any) {
    //
    this.setState({
      alertMessage: message,
      alertWinOpen: true,
      alertTitle: '?????? ?????? ?????? ??????',
      alertIcon: 'triangle',
      alertType: '??????',
    });
  }

  confirmSave(message: string | any) {
    //
    this.setState({
      alertMessage: message,
      alertWinOpen: true,
      alertTitle: '?????? ??????',
      alertIcon: 'circle',
      alertType: 'save',
    });
  }

  confirmList(message: string | any) {
    //
    this.setState({
      alertMessage: message,
      alertWinOpen: true,
      alertTitle: '??????',
      alertIcon: 'circle',
      alertType: 'list',
    });
  }

  handleCloseAlertWin() {
    //
    //const { aplState } = this.props.match.params;
    //this.onChangeAplProps('state', aplState );
    if (this.state.focusYn === 'Y') {
      const objStr = this.state.objStr;
      this.setFocusControl(objStr);
    }
    this.setState({
      alertWinOpen: false,
      focusYn: '',
    });
  }

  routeToAplConfirm() {
    //
    const title = '??????????????????';

    let aplMessageList = null;
    aplMessageList = (
      <>
        <p className="center"> {title} List ???????????? ?????????????????????????</p>
        <p className="center"> {title} List ???????????? ?????? ??? ????????? ????????? ???????????? ????????????.</p>
      </>
    );

    this.confirmList(aplMessageList);
    this.setState({
      objStr: '',
      focusYn: 'N',
    });
  }

  routeToAplList() {
    //
    const { aplService, sharedService } = this.props;

    if (sharedService && aplService) {
      //aplService.changeAplSearchInit(false);

      Promise.resolve()
        .then(() => aplService.clearApl())
        .then(() => {
          this.props.history.push(
            `/cineroom/${this.props.match.params.cineroomId}/${learningManagementUrl}/cubes/apl-approve-management/apl-list`
          );
        })
        .then(() => {
          sharedService.setCount('apl', aplService.apls.totalCount || 0);
        });
    }
  }

  handleAlertOk(type: string) {
    //
    if (type === '??????') this.handleCloseAlertWin();
    if (type === 'save') {
      this.handleOKConfirmWinApl();
    }
    if (type === 'list') this.routeToAplList();
  }

  /*
  async clearAll() {
    //
    const { aplService } = this.props;
    if (aplService) {
      await aplService.clearAplQueryProps();
    }
  }
  */

  handleOKConfirmWinApl() {
    //
    const { apl } = this.props.aplService || ({} as AplService);
    const { aplService } = this.props;

    //SAVE ?????? ??? ??????
    if (!this.state.saveAplOn) {
      this.setState({ saveAplOn: true });
      aplService
        .modifyApl(apl)
        //.then(() => this.clearAll())
        .then(() => this.routeToAplList())
        .finally(() => {
          this.setState({ saveAplOn: false });
        });
    }
  }

  // ??????
  async handleSave() {
    //
    const { apl } = this.props.aplService || ({} as AplService);

    //???????????? ???????????? ??????
    const aplObject = AplModel.isBlank(apl);
    let aplMessageList = (
      <>
        <p className="center">{aplObject} ??? ?????? ?????? ???????????????.</p>
        <p className="center">?????? ????????? ???????????? ??? ??????????????????.</p>
      </>
    );
    /*
    if (Number(apl.updateHour) === 0 && Number(apl.updateMinute) === 0 ){
      aplObject = '????????????(???)';
      aplMessageList = (
        <>
          <p className="center">????????? ??????????????? ????????? ?????????.</p>
        </>
      );
    }
    */

    if (aplObject !== 'success') {
      this.setState({
        objStr: aplObject,
        focusYn: 'Y',
      });

      this.confirmBlank(aplMessageList);
      return;
    }

    if (aplObject === 'success') {
      this.setState({
        objStr: '',
        focusYn: 'N',
      });
      aplMessageList = (
        <>
          <p className="center"> ????????? ???????????? ?????? ??????????????? ?????? ???????????????????</p>
        </>
      );

      this.confirmSave(aplMessageList);
    }

    //this.onChangeAplProps('state', AplState.Opened);
  }

  setFocusControl(aplBlankField: string) {
    if (APL_FOCUS_MAP[aplBlankField]) {
      this.setState({ focusControlName: APL_FOCUS_MAP[aplBlankField] });
    }
  }

  onResetFocusControl() {
    this.setState({ focusControlName: '' });
  }

  render() {
    const { aplService } = this.props;
    const { aplState } = this.props.match.params;
    const { alertWinOpen, alertMessage, alertIcon, alertTitle, alertType, focusControlName } = this.state;
    const { aplId } = this.props.match.params;
    const { apl } = aplService;
    const collegeService = this.props.collegeService;
    const collegesMap = collegeService?.collegesMap || new Map<string, string>();
    const channelMap = collegeService?.channelMap || new Map<string, string>();

    return (
      <>
        <Container fluid>
          <Polyglot languages={apl.langSupports}>
            <div>
              <Breadcrumb icon="right angle" sections={SelectType.addPersonalLearningSection} />
              <Header as="h2">?????? ?????? ??????</Header>
            </div>
            <div className="btn-group">
              {aplState === AplState.Opened && (
                <>
                  <div className="fl-right">
                    <Button primary onClick={() => this.handleSave()} type="button">
                      ??????
                    </Button>
                    <Button onClick={this.routeToAplConfirm} type="button">
                      ??????
                    </Button>
                  </div>
                </>
              )}
            </div>
            <Form className="search-box">
              <Loader>
                <AplBasicInfoContainer aplService={aplService} />
              </Loader>
            </Form>
            <Loader>
              <AplDetailView
                onChangeAplProps={this.onChangeAplProps}
                aplService={aplService}
                aplState={aplState}
                aplId={aplId}
                focusControlName={focusControlName}
                onResetFocusControl={this.onResetFocusControl}
                collegesMap={collegesMap}
                channelMap={channelMap}
              />
            </Loader>
            {aplState !== AplState.Opened && (
              <Button onClick={this.routeToAplList} type="button">
                ??????
              </Button>
            )}
            <AlertWin
              message={alertMessage}
              handleClose={this.handleCloseAlertWin}
              open={alertWinOpen}
              alertIcon={alertIcon}
              title={alertTitle}
              type={alertType}
              handleOk={this.handleAlertOk}
            />
          </Polyglot>
        </Container>
      </>
    );
  }
}

export default withRouter(AplDetailContainer);
