import React from 'react';
import { Button, Form, Modal, Table, Radio, Container, TextArea, Select } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';

import { patronInfo } from '@nara.platform/dock';
import { mobxHelper, reactAlert, reactAutobind } from '@nara.platform/accent';

import { SendSmsService } from 'shared/present';
import { SelectType, SendSmsModel, SearchFilter, PageModel, PolyglotModel } from 'shared/model';
import { AlertWin } from 'shared/ui';

import { UserService } from 'user';
import { StudentQueryModel } from 'student/model/StudentQueryModel';
import { ScoringState } from 'student/model/vo/ScoringState';

import { getPolyglotToAnyString, setPolyglotValues } from '../Polyglot';

interface Props {
  onShow: () => boolean;
  idList?: string[];
  nameList?: string[];
  cubeId?: string;
  cubeName?: string;
  cardId?: string;
  type?: string;
  sendSmsService?: SendSmsService;
  userService?: UserService;
  sendCount?: number;
  tooltipText?: string;
  studentQuery?: StudentQueryModel;
  cardConfigType?: string;
}

interface States {
  openModal: boolean;
  smsCont: string;
  senderRadio: string;
  alertWinOpen: boolean;
  alertIcon: string;
  alertTitle: string;
  alertType: string;
  alertMessage: string;
}

@inject(mobxHelper.injectFrom('sendSmsService'))
@inject(mobxHelper.injectFrom('userService'))
@observer
@reactAutobind
class SendSmsModal extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openModal: false,
      smsCont: '',
      senderRadio: '',
      // , openFileModal: props.onShow()
      alertWinOpen: false,
      alertMessage: '',
      alertIcon: '',
      alertTitle: '',
      alertType: '',
    };
  }

  //
  componentDidMount(): void {
    const { sendSmsService, idList, nameList, cubeName, type, userService } = this.props;
    const { changeSelectedStudentPhoneProps } = sendSmsService!;
    changeSelectedStudentPhoneProps(idList!, nameList!, cubeName!, type!);
    this.setState({ smsCont: '' });

    userService?.findUser().then(() => {
      this.onChangeRadio(SearchFilter.SearchOff);
    });

    sendSmsService?.changeSendSmsProps('smsContents', '');

    sendSmsService?.findEnableMainNumbers().then((result) => {
      // if (result.length > 0) {
      //   sendSmsService?.changeSendSmsProps('senderName', result[0].representativeNumber.name);
      //   sendSmsService?.changeSendSmsProps('senderPhone', result[0].representativeNumber.phone);
      // }
    });
  }

  componentDidUpdate(prevProps: Props) {
    const { sendSmsService, idList, nameList, cubeName, type } = this.props;
    const { changeSelectedStudentPhoneProps } = sendSmsService!;
    if (prevProps.idList !== this.props.idList) {
      changeSelectedStudentPhoneProps(idList!, nameList!, cubeName!, type!);
    }
  }

  // ?????? ????????? ??????
  componentWillUnmount() {}

  show() {
    const { onShow } = this.props;
    //
    if (onShow()) {
      this.setState({ openModal: true });
    }
  }

  close() {
    const { sendSmsService } = this.props;
    sendSmsService?.changeSendSmsProps('searchFilter', SearchFilter.SearchOff);
    sendSmsService?.changeSendSmsProps('senderName', '');
    sendSmsService?.changeSendSmsProps('senderEmail', '');
    this.setState({ smsCont: '' });
    this.setState({ senderRadio: SearchFilter.SearchOff });
    this.setState({ openModal: false });
  }

  handleCloseAlertWin() {
    //
    this.setState({
      alertWinOpen: false,
    });
  }

  confirmBlank(message: string) {
    //
    this.setState({
      alertMessage: message,
      alertWinOpen: true,
      alertTitle: '?????? ?????? ?????? ??????',
      alertIcon: 'triangle',
      alertType: 'justOk',
    });
  }

  sendSmsIsBlank(sendSms: SendSmsModel): string {
    if (!sendSms.smsContents) {
      return '????????????';
    }
    if (!sendSms.senderPhone) {
      return '?????????';
    }
    return 'success';
  }

  onHandleOk() {
    const { sendSmsService, studentQuery, cubeId, cardId, cardConfigType } = this.props;
    const { sendSmss } = sendSmsService!;

    let sendSmsObj: string = '';
    sendSmsObj = this.sendSmsIsBlank(sendSmss);

    const cubeIntroMessage = '"' + sendSmsObj + '" ??? ?????? ?????? ???????????????. ?????? ????????? ???????????? ??? ??????????????????.';
    if (sendSmsObj !== 'success') {
      this.confirmBlank(cubeIntroMessage);
      return;
    }

    sendSmsService?.changeSendSmsProps('smsContents', sendSmss.smsContents);
    if (studentQuery !== undefined && cubeId !== undefined) {
      sendSmsService?.sendCubeStudentEmailOrSms(
        StudentQueryModel.asResultByCubeRdo(studentQuery, cubeId, new PageModel(0, 9999999))
      );
    } else if (studentQuery !== undefined && cardId !== undefined) {
      sendSmsService?.sendCardStudentEmailOrSms(
        StudentQueryModel.asStudentCardRdo(studentQuery, new PageModel(0, 9999999), { type: cardConfigType })
      );
    } else {
      sendSmsService?.sendCardStudentEmailOrSms();
    }

    reactAlert({
      title: '??????',
      message: '?????? ?????? ?????????????????????.<br />???????????? ?????? ?????? ????????? ????????? ?????? ????????? ??? ????????????.',
      onClose: () => this.close(),
    });
  }

  onChangeStudentRequestProps(value: string) {
    this.setState({ smsCont: value });
    const { sendSmsService } = this.props;
    sendSmsService?.changeSendSmsProps('smsContents', value);
  }

  onChangeRadio(value: SearchFilter) {
    const { sendSmsService, userService } = this.props;
    const { user } = userService!;
    this.setState({ senderRadio: value });
    //sendSmsService?.changeSendSmsProps('searchFilter', value);
    if (value === SearchFilter.SearchOn) {
      sendSmsService?.changeSendSmsProps('senderName', '');
      sendSmsService?.changeSendSmsProps('senderPhone', '');
    } else if (value === SearchFilter.SearchOff) {
      const names = JSON.parse(patronInfo.getPatronName() || '') || '';
      const polyglotName: PolyglotModel = setPolyglotValues(names.ko, names.en, names.zh);
      sendSmsService?.changeSendSmsProps('senderName', getPolyglotToAnyString(polyglotName));
      sendSmsService?.changeSendSmsProps('senderPhone', user.phone);
    }
  }

  onChangeMainNumberSelect(text: string, value: string) {
    const { sendSmsService } = this.props;
    sendSmsService?.changeSendSmsProps('senderName', text);
    sendSmsService?.changeSendSmsProps('senderPhone', value);
  }

  render() {
    const { sendSmsService, sendCount, tooltipText, studentQuery } = this.props;
    const { sendSmss, mainNumbers } = sendSmsService!;
    const { openModal, smsCont, senderRadio, alertWinOpen, alertMessage, alertIcon, alertTitle, alertType } =
      this.state;

    const names = JSON.parse(patronInfo.getPatronName() || '') || '';
    const polyglotName: PolyglotModel = setPolyglotValues(names.ko, names.en, names.zh);

    const mainNumbersSelctType: { key: string; text: string; value: string }[] = [];
    mainNumbers.map((result, index) =>
      mainNumbersSelctType.push({
        key: index.toString(),
        text: result.representativeNumber.name,
        value: result.representativeNumber.phone,
      })
    );
    return (
      <>
        {(tooltipText && (
          <>
            <Button onClick={this.show} type="button" data-tip data-for="sendSmsTip">
              SMS?????????
            </Button>
            <ReactTooltip id="sendSmsTip" place="bottom" effect="solid">
              {tooltipText}
            </ReactTooltip>
          </>
        )) || (
          <Button onClick={this.show} type="button">
            SMS?????????
          </Button>
        )}
        {openModal && (
          <Container fluid>
            <Modal
              size="large"
              open={openModal}
              closeOnDimmerClick={false} // dim ???????????? ??????  true : O, false : X
              onClose={this.close}
            >
              <Modal.Header>SMS?????????</Modal.Header>
              <Modal.Content style={{ overflow: 'auto' }}>
                <Form>
                  <Table celled>
                    <colgroup>
                      <col width="20%" />
                      <col width="80%" />
                    </colgroup>
                    <Table.Body>
                      {sendSmss.names.length < 1 && studentQuery && (
                        <Table.Row>
                          <Table.Cell>?????? ??????</Table.Cell>
                          <Table.Cell>
                            <div>
                              ???????????? : {moment(studentQuery.period.startDateMoment).format('YYYY-MM-DD')} ~{' '}
                              {moment(studentQuery.period.endDateMoment).format('YYYY-MM-DD')}
                            </div>
                            <div>
                              ?????? :{' '}
                              {SelectType.selectProposalState.find(
                                (selectProposalState) => selectProposalState.value === studentQuery.proposalState
                              )?.text || '??????'}
                            </div>
                            <div>
                              ???????????? :{' '}
                              {SelectType.completionState.find(
                                (completionState) => completionState.value === studentQuery.learningState
                              )?.text || '??????'}
                            </div>
                            <div>
                              ???????????? :{' '}
                              {studentQuery.surveyCompleted === true
                                ? '??????'
                                : studentQuery.surveyCompleted === false
                                ? '?????????'
                                : '??????'}
                            </div>
                            <div>
                              Test???????????? :{' '}
                              {studentQuery.scoringState === ScoringState.Waiting ||
                              studentQuery.scoringState === ScoringState.Scoring
                                ? '??????'
                                : studentQuery.scoringState === ScoringState.Missing
                                ? '?????????'
                                : '??????'}
                            </div>
                            <div>???????????? : {studentQuery.phaseCompleteState === true ? '??????' : '?????????'}</div>
                            <div>
                              ????????? : {studentQuery.searchPart || '??????'} &gt; {studentQuery.searchWord}
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      )}
                      <Table.Row>
                        <Table.Cell>????????? ?????????</Table.Cell>
                        <Table.Cell>
                          <span style={{ verticalAlign: '-webkit-baseline-middle' }}>
                            ????????? ????????? {sendSmss.names.length || sendCount || 0} ???
                          </span>
                          <p />
                          {(sendSmss.names &&
                            sendSmss.names.length &&
                            sendSmss.names.map((model: any, idx) => {
                              if (sendSmss.names.length === 1) {
                                return model;
                              }
                              if (idx === 0) {
                                return model;
                              } else {
                                return ', ' + model;
                              }
                            })) ||
                            ''}
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          ??????<span className="required">*</span>
                        </Table.Cell>
                        <Table.Cell>
                          <TextArea
                            style={{ width: '18rem', height: '14rem', fontSize: '1rem' }}
                            placeholder="????????? ??????????????????."
                            onChange={(e: any) => this.onChangeStudentRequestProps(e.target.value)}
                            value={smsCont}
                          />
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          ????????? ??????<span className="required">*</span>
                        </Table.Cell>
                        <Table.Cell>
                          <Form.Group>
                            <Form.Field>
                              <Radio
                                label={getPolyglotToAnyString(polyglotName)}
                                name="radioGroup"
                                value={SearchFilter.SearchOff}
                                checked={senderRadio === SearchFilter.SearchOff}
                                onChange={(e: any, data: any) => this.onChangeRadio(data.value)}
                              />
                            </Form.Field>
                            <Form.Field>
                              <Radio
                                name="radioGroup"
                                value={SearchFilter.SearchOn}
                                checked={senderRadio === SearchFilter.SearchOn}
                                onChange={(e: any, data: any) => this.onChangeRadio(data.value)}
                              />
                            </Form.Field>
                            <Form.Field>
                              <Select
                                width={4}
                                control={Select}
                                placeholder="Select"
                                options={mainNumbersSelctType}
                                value={sendSmss.senderPhone}
                                onChange={(e: any, data: any) =>
                                  this.onChangeMainNumberSelect(e.target.innerText, data.value)
                                }
                                disabled={senderRadio === SearchFilter.SearchOff}
                              />
                            </Form.Field>
                          </Form.Group>
                          {senderRadio === SearchFilter.SearchOn && (
                            <span style={{ color: 'grey', fontSize: '11px' }}>
                              ?????? ?????? <span>{sendSmss.senderPhone}</span>
                            </span>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                  <AlertWin
                    message={alertMessage}
                    handleClose={this.handleCloseAlertWin}
                    open={alertWinOpen}
                    alertIcon={alertIcon}
                    title={alertTitle}
                    type={alertType}
                    handleOk={this.handleCloseAlertWin}
                  />
                </Form>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={this.close} type="button">
                  Cancel
                </Button>
                <Button primary onClick={this.onHandleOk} type="button">
                  OK
                </Button>
              </Modal.Actions>
            </Modal>
          </Container>
        )}
      </>
    );
  }
}

export default SendSmsModal;
