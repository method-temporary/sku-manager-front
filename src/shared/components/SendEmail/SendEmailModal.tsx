import React from 'react';
import { Button, Form, Modal, Table, Radio, Container, Input, CheckboxProps } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';

import { mobxHelper, reactAlert, reactAutobind } from '@nara.platform/accent';

import { PageModel, SelectType, SendEmailModel, SearchFilter } from 'shared/model';
import { SendEmailService } from 'shared/present';
import { commonHelper } from 'shared/helper';
import { AlertWin } from 'shared/ui';

import { StudentQueryModel } from 'student/model/StudentQueryModel';
import { ScoringState } from 'student/model/vo/ScoringState';
import HtmlEditor from '../../ui/view/HtmlEditor';

interface Props {
  onShow: () => boolean;
  emailList?: string[];
  nameList?: string[];
  idList?: string[];
  cubeId?: string;
  cubeName?: string;
  cardId?: string;
  type?: string;
  sendEmailService?: SendEmailService;
  sendCount?: number;
  tooltipText?: string;
  studentQuery?: StudentQueryModel;
  cardConfigType?: string;
}

interface States {
  openModal: boolean;
  mailCont: string;
  senderRadio: string;
  emailVal: boolean;
  // openFileModal: boolean;
  alertWinOpen: boolean;
  alertIcon: string;
  alertTitle: string;
  alertType: string;
  alertMessage: string;
}

@inject(mobxHelper.injectFrom('sendEmailService'))
@observer
@reactAutobind
class SendEmailModal extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openModal: false,
      mailCont: '',
      senderRadio: '',
      emailVal: false,
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
    const { sendEmailService, emailList, nameList, cubeName, type, idList } = this.props;
    const { changeSelectedStudentEmailProps } = sendEmailService!;
    changeSelectedStudentEmailProps(emailList!, nameList!, cubeName!, type!, idList!);
    this.setState({ mailCont: '' });
    this.setState({ senderRadio: SearchFilter.SearchOn });
  }

  componentDidUpdate(prevProps: Props) {
    const { sendEmailService, emailList, nameList, cubeName, type, idList } = this.props;
    const { changeSelectedStudentEmailProps } = sendEmailService!;
    if (prevProps.emailList !== this.props.emailList) {
      changeSelectedStudentEmailProps(emailList!, nameList!, cubeName!, type!, idList!);
    }
  }

  // ?????? ????????? ??????
  componentWillUnmount() {
    // const { sendEmailService } = this.props;
    // sendEmailService?.clearDisplay();
    // this.setState({ mailCont: '' });
    // this.setState({ senderRadio: SearchFilter.SearchOn });
  }

  show() {
    const { onShow } = this.props;
    //
    if (onShow()) {
      this.setState({ openModal: true });
    }
  }

  close() {
    const { sendEmailService } = this.props;
    sendEmailService?.changeSendMailProps('title', '');
    sendEmailService?.changeSendMailProps('searchFilter', SearchFilter.SearchOn);
    sendEmailService?.changeSendMailProps('senderName', '');
    sendEmailService?.changeSendMailProps('senderEmail', '');
    this.setState({ mailCont: '' });
    this.setState({ senderRadio: SearchFilter.SearchOn });
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

  sendEmailIsBlank(sendEmail: SendEmailModel): string {
    if (!sendEmail.title) return '?????????';
    if (!sendEmail.mailContents) {
      return '????????????';
    }
    if (sendEmail.searchFilter === SearchFilter.SearchOff) {
      if (!sendEmail.senderName) return '????????? ??????';
      if (!sendEmail.senderEmail) {
        return '????????? ?????????';
      }
      if (sendEmail.senderEmail) {
        if (!commonHelper.chkEmailAddr(sendEmail.senderEmail)) {
          return '????????? ????????? ??????';
        }
      }
    }
    return 'success';
  }

  onHandleOk() {
    const { sendEmailService, studentQuery, cubeId, cardId, cardConfigType } = this.props;
    const { sendEmails } = sendEmailService!;

    let sendEmailObj: string = '';
    sendEmailObj = this.sendEmailIsBlank(sendEmails);

    const cubeIntroMessage = '"' + sendEmailObj + '" ??? ?????? ?????? ???????????????. ?????? ????????? ???????????? ??? ??????????????????.';
    if (sendEmailObj !== 'success') {
      this.confirmBlank(cubeIntroMessage);
      return;
    }

    // sendEmailService?.sendEmail().then((res) => {
    //   reactAlert({
    //     title: '??????',
    //     message: '?????????????????????.',
    //     onClose: () => this.close(),
    //   });
    // });

    sendEmailService?.changeSendMailProps('mailContents', this.addStyleImg(sendEmails.mailContents));
    if (studentQuery !== undefined && cubeId !== undefined) {
      sendEmailService?.sendCubeStudentEmailOrSms(
        StudentQueryModel.asResultByCubeRdo(studentQuery, cubeId, new PageModel(0, 9999999))
      );
    } else if (studentQuery !== undefined && cardId !== undefined) {
      sendEmailService?.sendCardStudentEmailOrSms(
        StudentQueryModel.asStudentCardRdo(studentQuery, new PageModel(0, 9999999), { type: cardConfigType })
      );
    } else {
      sendEmailService?.sendEmail();
    }
    reactAlert({
      title: '??????',
      message: '?????? ?????? ?????????????????????.<br />???????????? ?????? ?????? ????????? ????????? ?????? ????????? ??? ????????????.',
      onClose: () => this.close(),
    });
  }

  addStyleImg(value: string) {
    const matchCnt = (value.match(/<img src=/g) || []).length;
    // console.log('matchCnt:', matchCnt);

    const img = new Image();
    let cont = value;
    // let first = '';
    let rest = '';
    let firstImg = '';
    for (let i = 0; i < matchCnt; i++) {
      // first = cont.substr(0, cont.indexOf('<img src='));
      // console.log('first:', first);
      rest = cont.substr(cont.indexOf('<img src='), cont.length);
      // console.log('rest:', rest);
      firstImg = rest.substring(rest.indexOf('data:image'), rest.indexOf('><') - 1);
      // console.log('firstImg:', firstImg);
      img.src = firstImg;
      // console.log('img.width', img.width);
      if (img.width >= 1020) {
        // ????????? ?????? ?????? ????????????
        cont = cont.replace('<img src=', '<img width="100%" src=');
      } else {
        cont = cont.replace('<img src=', '<img style="max-width: 100%; height: auto !important;" src=');
      }
    }
    // console.log('value:', value);
    // console.log('cont:', cont);
    return cont;
  }

  onChangeStudentRequestProps(value: string) {
    // const { mailCont } = this.state;
    // //HTML Tag ??????
    // const onlyText = value.replace(/(<([^>]+)>)/gi, '');

    // if (onlyText.length > 1000) {
    //   this.setState({ mailCont: mailCont || '' });
    // } else {
    this.setState({ mailCont: value });
    const { sendEmailService } = this.props;
    sendEmailService?.changeSendMailProps('mailContents', value);
    // }
  }

  onChangeTitle(value: string) {
    const { sendEmailService } = this.props;
    sendEmailService?.changeSendMailProps('title', value);
  }

  onChangeRadio(value: SearchFilter) {
    const { sendEmailService } = this.props;
    this.setState({ senderRadio: value });
    sendEmailService?.changeSendMailProps('searchFilter', value);
  }

  onChangeSenderName(value: string) {
    const { sendEmailService } = this.props;
    sendEmailService?.changeSendMailProps('senderName', value);
  }

  onChangeSenderEmail(value: string) {
    const { sendEmailService } = this.props;
    sendEmailService?.changeSendMailProps('senderEmail', value);
    this.setState({ emailVal: commonHelper.chkEmailAddr(value) });
  }

  onChangeSendType(event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) {
    const { sendEmailService } = this.props;
    sendEmailService?.changeSendMailProps('sendType', data.value);
  }

  render() {
    const { sendEmailService, sendCount, tooltipText, studentQuery } = this.props;
    const { sendEmails } = sendEmailService!;
    const { openModal, mailCont, senderRadio, emailVal, alertWinOpen, alertMessage, alertIcon, alertTitle, alertType } =
      this.state;

    return (
      <>
        {(tooltipText && (
          <>
            <Button onClick={this.show} type="button" data-tip data-for="sendEmailTip">
              ???????????????
            </Button>
            <ReactTooltip id="sendEmailTip" place="bottom" effect="solid">
              {tooltipText}
            </ReactTooltip>
          </>
        )) || (
          <Button onClick={this.show} type="button">
            ???????????????
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
              <Modal.Header>???????????????</Modal.Header>
              <Modal.Content style={{ overflow: 'auto', height: 700 }}>
                <Form>
                  <Table celled>
                    <colgroup>
                      <col width="20%" />
                      <col width="80%" />
                    </colgroup>
                    <Table.Body>
                      {sendEmails.names.length < 1 && studentQuery && (
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
                            ????????? ????????? {sendEmails.names.length || sendCount || 0} ???
                          </span>
                          <p />
                          {(sendEmails.names &&
                            sendEmails.names.length &&
                            sendEmails.names.map((model: any, idx) => {
                              if (sendEmails.names.length === 1) {
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
                      {/* <Table.Row>
                    <Table.Cell className="tb-header">
                      ?????? ?????? ?????????
                    </Table.Cell>
                    <Table.Cell>
                      <Button onClick={this.onHandleExcel} type="button">
                        ?????? ?????????
                      </Button>
                    </Table.Cell>
                  </Table.Row> */}
                      <Table.Row>
                        <Table.Cell>
                          ?????????<span className="required">*</span>
                        </Table.Cell>
                        <Table.Cell>
                          <Form.Field
                            fluid
                            control={Input}
                            placeholder="???????????? ??????????????????."
                            onChange={(e: any) => this.onChangeTitle(e.target.value)}
                          />
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>?????????</Table.Cell>
                        <Table.Cell>
                          <span style={{ verticalAlign: '-webkit-baseline-middle' }}>{sendEmails.cubeName}</span>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          ??????<span className="required">*</span>
                        </Table.Cell>
                        <Table.Cell>
                          {/* <TextArea
                        // defaultValue="??????"
                        placeholder="???????????? ????????? ????????? ??????????????? ?????????????????????."
                        rows={6}
                      /> */}

                          <HtmlEditor
                            modules={SelectType.modules}
                            formats={SelectType.formats}
                            placeholder="????????? ??????????????????. (1,000????????? ????????????), ????????? 2Mb ?????? ??????"
                            onChange={(html) => this.onChangeStudentRequestProps(html === '<p><br></p>' ? '' : html)}
                            value={mailCont}
                          />
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          ??????????????? ??????<span className="required">*</span>
                        </Table.Cell>
                        <Table.Cell>
                          <Form.Group>
                            <Form.Field>
                              <Radio
                                label="Y"
                                name="SendTypeRadioGroup"
                                value="1"
                                checked={sendEmails.sendType === '1'}
                                onChange={this.onChangeSendType}
                              />
                            </Form.Field>
                            <Form.Field>
                              <Radio
                                label="N"
                                name="SendTypeRadioGroup"
                                value="2"
                                checked={sendEmails.sendType === '2'}
                                onChange={this.onChangeSendType}
                              />
                            </Form.Field>
                          </Form.Group>
                        </Table.Cell>
                      </Table.Row>

                      {sendEmails.sendType === '1' && (
                        <Table.Row>
                          <Table.Cell>
                            ?????? ?????? ?????? ????????? ??????<span className="required">*</span>
                            <br />
                            <span style={{ color: 'grey', fontSize: '11px' }}>
                              (?????? ????????? mysuni@mysuni.sk.com ??????)
                            </span>
                          </Table.Cell>
                          <Table.Cell>
                            <Form.Group>
                              <Form.Field>
                                <Radio
                                  label="mysuni@mysuni.sk.com"
                                  name="radioGroup"
                                  value={SearchFilter.SearchOn}
                                  checked={senderRadio === SearchFilter.SearchOn}
                                  onChange={(e: any, data: any) => this.onChangeRadio(data.value)}
                                />
                              </Form.Field>
                              <Form.Field>
                                <Radio
                                  label="????????????"
                                  name="radioGroup"
                                  value={SearchFilter.SearchOff}
                                  checked={senderRadio === SearchFilter.SearchOff}
                                  onChange={(e: any, data: any) => this.onChangeRadio(data.value)}
                                />
                              </Form.Field>
                            </Form.Group>
                            {sendEmails.sendType === '1' && sendEmails.searchFilter === SearchFilter.SearchOff && (
                              <Form.Group style={{ display: 'flex', alignItems: 'center', marginTop: '0.8rem' }}>
                                ??????<span className="required">*</span>
                                <Form.Field
                                  width={3}
                                  control={Input}
                                  placeholder="????????? ??????????????????."
                                  value={sendEmails.senderName}
                                  onChange={(e: any) => this.onChangeSenderName(e.target.value)}
                                />
                                ?????????<span className="required">*</span>
                                <Form.Field
                                  width={4}
                                  control={Input}
                                  placeholder="???????????? ??????????????????."
                                  value={sendEmails.senderEmail}
                                  onChange={(e: any) => this.onChangeSenderEmail(e.target.value)}
                                />
                                {!emailVal && (
                                  <p
                                    style={{
                                      color: 'red',
                                      textAlign: 'left',
                                      fontSize: '0.8rem',
                                      padding: 0,
                                    }}
                                  >
                                    ??? ????????? ????????? ????????? ??????????????? ?????????.
                                  </p>
                                )}
                              </Form.Group>
                            )}
                          </Table.Cell>
                        </Table.Row>
                      )}
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

export default SendEmailModal;
