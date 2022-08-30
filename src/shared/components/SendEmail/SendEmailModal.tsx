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

  // 화면 나갈때 액션
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
      alertTitle: '필수 정보 입력 안내',
      alertIcon: 'triangle',
      alertType: 'justOk',
    });
  }

  sendEmailIsBlank(sendEmail: SendEmailModel): string {
    if (!sendEmail.title) return '타이틀';
    if (!sendEmail.mailContents) {
      return '교육내용';
    }
    if (sendEmail.searchFilter === SearchFilter.SearchOff) {
      if (!sendEmail.senderName) return '발신자 이름';
      if (!sendEmail.senderEmail) {
        return '발신자 이메일';
      }
      if (sendEmail.senderEmail) {
        if (!commonHelper.chkEmailAddr(sendEmail.senderEmail)) {
          return '정확한 이메일 정보';
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

    const cubeIntroMessage = '"' + sendEmailObj + '" 은 필수 입력 항목입니다. 해당 정보를 입력하신 후 저장해주세요.';
    if (sendEmailObj !== 'success') {
      this.confirmBlank(cubeIntroMessage);
      return;
    }

    // sendEmailService?.sendEmail().then((res) => {
    //   reactAlert({
    //     title: '알림',
    //     message: '발송되었습니다.',
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
      title: '알림',
      message: '발송 요청 완료하였습니다.<br />수신자가 많을 경우 처리에 시간이 오래 소요될 수 있습니다.',
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
        // 찾아서 처음 것만 바꾸니까
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
    // //HTML Tag 제거
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
              메일보내기
            </Button>
            <ReactTooltip id="sendEmailTip" place="bottom" effect="solid">
              {tooltipText}
            </ReactTooltip>
          </>
        )) || (
          <Button onClick={this.show} type="button">
            메일보내기
          </Button>
        )}
        {openModal && (
          <Container fluid>
            <Modal
              size="large"
              open={openModal}
              closeOnDimmerClick={false} // dim 클릭으로 닫기  true : O, false : X
              onClose={this.close}
            >
              <Modal.Header>메일보내기</Modal.Header>
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
                          <Table.Cell>검색 정보</Table.Cell>
                          <Table.Cell>
                            <div>
                              교육기간 : {moment(studentQuery.period.startDateMoment).format('YYYY-MM-DD')} ~{' '}
                              {moment(studentQuery.period.endDateMoment).format('YYYY-MM-DD')}
                            </div>
                            <div>
                              상태 :{' '}
                              {SelectType.selectProposalState.find(
                                (selectProposalState) => selectProposalState.value === studentQuery.proposalState
                              )?.text || '전체'}
                            </div>
                            <div>
                              이수상태 :{' '}
                              {SelectType.completionState.find(
                                (completionState) => completionState.value === studentQuery.learningState
                              )?.text || '전체'}
                            </div>
                            <div>
                              설문여부 :{' '}
                              {studentQuery.surveyCompleted === true
                                ? '제출'
                                : studentQuery.surveyCompleted === false
                                ? '미제출'
                                : '전체'}
                            </div>
                            <div>
                              Test제출여부 :{' '}
                              {studentQuery.scoringState === ScoringState.Waiting ||
                              studentQuery.scoringState === ScoringState.Scoring
                                ? '제출'
                                : studentQuery.scoringState === ScoringState.Missing
                                ? '미제출'
                                : '전체'}
                            </div>
                            <div>완료여부 : {studentQuery.phaseCompleteState === true ? '체크' : '미체크'}</div>
                            <div>
                              검색어 : {studentQuery.searchPart || '전체'} &gt; {studentQuery.searchWord}
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      )}
                      <Table.Row>
                        <Table.Cell>선택한 수신자</Table.Cell>
                        <Table.Cell>
                          <span style={{ verticalAlign: '-webkit-baseline-middle' }}>
                            선택된 수신자 {sendEmails.names.length || sendCount || 0} 명
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
                      일괄 등록 수신자
                    </Table.Cell>
                    <Table.Cell>
                      <Button onClick={this.onHandleExcel} type="button">
                        엑셀 업로드
                      </Button>
                    </Table.Cell>
                  </Table.Row> */}
                      <Table.Row>
                        <Table.Cell>
                          타이틀<span className="required">*</span>
                        </Table.Cell>
                        <Table.Cell>
                          <Form.Field
                            fluid
                            control={Input}
                            placeholder="타이틀을 입력해주세요."
                            onChange={(e: any) => this.onChangeTitle(e.target.value)}
                          />
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>과정명</Table.Cell>
                        <Table.Cell>
                          <span style={{ verticalAlign: '-webkit-baseline-middle' }}>{sendEmails.cubeName}</span>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          내용<span className="required">*</span>
                        </Table.Cell>
                        <Table.Cell>
                          {/* <TextArea
                        // defaultValue="내용"
                        placeholder="구성원이 신청한 과정의 수강승인이 완료되었습니다."
                        rows={6}
                      /> */}

                          <HtmlEditor
                            modules={SelectType.modules}
                            formats={SelectType.formats}
                            placeholder="내용을 입력해주세요. (1,000자까지 입력가능), 이미지 2Mb 까지 권장"
                            onChange={(html) => this.onChangeStudentRequestProps(html === '<p><br></p>' ? '' : html)}
                            value={mailCont}
                          />
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          템플릿포함 여부<span className="required">*</span>
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
                            메일 본문 하단 담당자 표시<span className="required">*</span>
                            <br />
                            <span style={{ color: 'grey', fontSize: '11px' }}>
                              (발신 계정은 mysuni@mysuni.sk.com 공통)
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
                                  label="직접입력"
                                  name="radioGroup"
                                  value={SearchFilter.SearchOff}
                                  checked={senderRadio === SearchFilter.SearchOff}
                                  onChange={(e: any, data: any) => this.onChangeRadio(data.value)}
                                />
                              </Form.Field>
                            </Form.Group>
                            {sendEmails.sendType === '1' && sendEmails.searchFilter === SearchFilter.SearchOff && (
                              <Form.Group style={{ display: 'flex', alignItems: 'center', marginTop: '0.8rem' }}>
                                이름<span className="required">*</span>
                                <Form.Field
                                  width={3}
                                  control={Input}
                                  placeholder="이름을 입력해주세요."
                                  value={sendEmails.senderName}
                                  onChange={(e: any) => this.onChangeSenderName(e.target.value)}
                                />
                                이메일<span className="required">*</span>
                                <Form.Field
                                  width={4}
                                  control={Input}
                                  placeholder="이메일을 입력해주세요."
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
                                    ※ 정확한 이메일 정보를 입력하셔야 합니다.
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
