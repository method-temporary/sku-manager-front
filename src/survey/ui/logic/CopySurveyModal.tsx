import * as React from 'react';
import { Button, Modal, Form, Table, InputOnChangeData } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import '@nara.drama/approval/lib/snap.css';

import { reactAutobind, reactAlert } from '@nara.platform/accent';

import { SharedService } from 'shared/present';
import { getDefaultLanguage } from 'shared/components/Polyglot';
import { AlertWin } from 'shared/ui';

import { SurveyFormService } from '../../index';
import SurveyFormApi from '../../form/present/apiclient/SurveyFormApi';

interface Props {
  surveyFormService?: SurveyFormService;
  sharedService?: SharedService;
  open: boolean;
  findAllSurveyFormsByQuery: (page: number) => void;
  show: (open: boolean) => void;
  onChangeSurveyFormLangStringProp: (prop: string, language: string, value: string) => void;
}

interface States {
  confirmWinOpen: boolean;
  alertWinOpen: boolean;
  alertIcon: string;
  alertTitle: string;
  alertType: string;
  alertMessage: string;
}

@inject('surveyFormService', 'sharedService')
@observer
@reactAutobind
class CopySurveyModal extends React.Component<Props, States> {
  constructor(props: Props) {
    //
    super(props);
    this.state = {
      confirmWinOpen: false,
      alertWinOpen: false,
      alertIcon: '',
      alertTitle: '',
      alertType: '',
      alertMessage: '',
    };
  }

  componentDidMount() {}

  handleCloseAlertWin() {
    //
    this.setState({
      alertWinOpen: false,
    });
  }

  handleAlertOk() {
    //
    this.setState({
      alertWinOpen: false,
    });
  }

  handleChangeTitle(event: any, data: InputOnChangeData) {
    //
    const { surveyForm } = this.props.surveyFormService || ({} as SurveyFormService);
    this.props.onChangeSurveyFormLangStringProp('titles', getDefaultLanguage(surveyForm.langSupports), data.value);
  }

  handleCancel() {
    //
    const { surveyForm, changeCopySurveyModalOpen } = this.props.surveyFormService || ({} as SurveyFormService);
    this.props.onChangeSurveyFormLangStringProp('titles', getDefaultLanguage(surveyForm.langSupports), '');
    changeCopySurveyModalOpen(false);
  }

  handleOk() {
    //
    const { surveyForm, changeCopySurveyModalOpen } = this.props.surveyFormService || ({} as SurveyFormService);
    const { findAllSurveyFormsByQuery } = this.props;
    let blankMessage = '';
    const title = surveyForm.titles.langStringMap.get(getDefaultLanguage(surveyForm.langSupports));

    SurveyFormApi.instance.countSurveyTitle(title).then((response) => {
      if (response > 0) {
        blankMessage = '???????????? ????????? ?????????????????????.';
        this.alertBlank(blankMessage);
      } else {
        if (!title || title === '') {
          blankMessage = '???????????? ????????? ?????? ?????? ???????????????.';
          this.confirmBlank(blankMessage);
        } else {
          this.props
            .surveyFormService!.copySurveyForm()
            .then(() => changeCopySurveyModalOpen(false))
            .then(() => surveyForm.titles.string === '')
            .then(() => findAllSurveyFormsByQuery(1))
            .then(() =>
              this.props.onChangeSurveyFormLangStringProp('titles', getDefaultLanguage(surveyForm.langSupports), '')
            );
        }
      }
    });
  }

  confirmBlank(message: string) {
    //
    reactAlert({
      title: '?????? ?????? ?????? ??????',
      message,
      //onClose: () => ,
    });
  }

  alertBlank(message: string) {
    //
    reactAlert({
      title: '?????? ?????? ?????? ??????',
      message,
      //onClose: () => ,
    });
  }

  render() {
    const { confirmWinOpen, alertWinOpen, alertMessage, alertType, alertTitle, alertIcon } = this.state;
    const { open, show } = this.props;
    const { surveyForm } = this.props.surveyFormService || ({} as SurveyFormService);

    return (
      <React.Fragment>
        <Modal
          size="small"
          open={open}
          onClose={() => {
            this.props.onChangeSurveyFormLangStringProp('titles', getDefaultLanguage(surveyForm.langSupports), '');
            show(false);
          }}
        >
          <Modal.Header>????????? ??????</Modal.Header>
          <Modal.Content>
            <Table celled>
              <colgroup>
                <col width="20%" />
                <col width="80%" />
              </colgroup>

              <Table.Row>
                <Table.Cell className="tb-header">?????? ??????</Table.Cell>
                <Table.Cell>
                  <Form.Input
                    maxLength={100}
                    fluid
                    defaultValue={surveyForm.titles.langStringMap.get(surveyForm.titles.defaultLanguage)}
                    onChange={this.handleChangeTitle}
                  />
                </Table.Cell>
              </Table.Row>
            </Table>
          </Modal.Content>
          <Modal.Actions>
            <Button className="w190 d" onClick={() => this.handleCancel()}>
              Cancel
            </Button>
            <Button className="w190 p" onClick={() => this.handleOk()}>
              OK
            </Button>
          </Modal.Actions>
        </Modal>
        <AlertWin
          message={alertMessage}
          handleClose={this.handleCloseAlertWin}
          open={alertWinOpen}
          alertIcon={alertIcon}
          title={alertTitle}
          type={alertType}
          handleOk={this.handleAlertOk}
        />
      </React.Fragment>
    );
  }
}

export default CopySurveyModal;
