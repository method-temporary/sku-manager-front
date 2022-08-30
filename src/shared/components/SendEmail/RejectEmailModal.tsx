import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Form, Modal, Table, Radio, Input } from 'semantic-ui-react';

import { mobxHelper, reactAlert, reactAutobind } from '@nara.platform/accent';

import { SendEmailModel, SelectType, SearchFilter } from 'shared/model';
import { SendEmailService } from 'shared/present';
import { commonHelper } from 'shared/helper';
import { AlertWin, TextEditor } from 'shared/ui';

// import SendEmailFileModal from './SendEmailFileModal';

interface Props {
  onShow: () => boolean;
  onClickReject: () => void;
  onChangeRemark: (name: string, value: string) => void;
  emailList?: string[];
  nameList?: string[];
  cubeTitles?: string[];
  type?: string;
  buttonText?: string;
  isApprovalRoleOwner?: boolean | true;
  sendEmailService?: SendEmailService;
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
class RejectEmailModal extends React.Component<Props, States> {
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
    const { sendEmailService, emailList, nameList, cubeTitles, type } = this.props;
    const { changeSelectedRejectEmailProps } = sendEmailService!;
    changeSelectedRejectEmailProps(emailList!, nameList!, cubeTitles!, type!);
    this.setState({ mailCont: '' });
    this.setState({ senderRadio: SearchFilter.SearchOn });
  }

  componentDidUpdate(prevProps: Props) {
    const { sendEmailService, emailList, nameList, cubeTitles, type } = this.props;
    const { changeSelectedRejectEmailProps } = sendEmailService!;
    if (prevProps.emailList !== this.props.emailList) {
      changeSelectedRejectEmailProps(emailList!, nameList!, cubeTitles!, type!);
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
      return '내용';
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
    const { sendEmailService } = this.props;
    const { sendEmails } = sendEmailService!;

    let sendEmailObj: string = '';
    sendEmailObj = this.sendEmailIsBlank(sendEmails);

    const cubeIntroMessage = '"' + sendEmailObj + '" 은 필수 입력 항목입니다. 해당 정보를 입력하신 후 저장해주세요.';
    if (sendEmailObj !== 'success') {
      this.confirmBlank(cubeIntroMessage);
      return;
    }

    this.setReject()
      .then(() => {
        sendEmailService?.changeSendMailProps('mailContents', this.addStyleImg(sendEmails.mailContents));
        sendEmailService
          ?.sendRjEmail()
          .then((res) => {
            reactAlert({
              title: '알림',
              message: '발송 요청 완료하였습니다.',
              onClose: () => this.close(),
            });
          })
          .catch((res) => {
            reactAlert({
              title: '알림',
              message: '발송 요청 실패했습니다.',
              onClose: () => this.close(),
            });
          });
      })
      .catch((res) => {
        reactAlert({
          title: '알림',
          message: '반려 실패했습니다.',
          onClose: () => this.close(),
        });
      });
  }

  async setReject() {
    //
    const { onClickReject } = this.props;
    await onClickReject();
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
    const { onChangeRemark } = this.props;
    // const { mailCont } = this.state;
    // // HTML Tag 제거
    // const onlyText = value.replace(/(<([^>]+)>)/gi, '');

    // if (onlyText.length > 1000) {
    //   this.setState({ mailCont: mailCont || '' });
    //   onChangeRemark('remark', mailCont || '');
    // } else {
    this.setState({ mailCont: value });
    onChangeRemark('remark', value);
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

  render() {
    const { sendEmailService, buttonText, isApprovalRoleOwner } = this.props;
    const { sendEmails } = sendEmailService!;
    const { openModal, mailCont, senderRadio, emailVal, alertWinOpen, alertMessage, alertIcon, alertTitle, alertType } =
      this.state;
    return (
      <>
        <Button onClick={this.show} type="button" disabled={!isApprovalRoleOwner}>
          {buttonText || '반려'}
        </Button>

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
                  <Table.Row>
                    <Table.Cell>선택한 수신자</Table.Cell>
                    <Table.Cell>
                      {sendEmails.names && sendEmails.names.length > 1 && (
                        <>
                          <span style={{ verticalAlign: '-webkit-baseline-middle' }}>
                            선택된 수신자 {sendEmails.names.length} 명
                          </span>
                          <p />
                        </>
                      )}
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
                  {sendEmails.cubeTitles && sendEmails.cubeTitles.length === 1 && (
                    <Table.Row>
                      <Table.Cell>과정명</Table.Cell>
                      <Table.Cell>
                        <span style={{ verticalAlign: '-webkit-baseline-middle' }}>
                          {sendEmails.cubeTitles.map((model: any, idx) => {
                            if (sendEmails.cubeTitles.length === 1) {
                              return model;
                            }
                            if (idx === 0) {
                              return model;
                            } else {
                              return ', ' + model;
                            }
                          }) || ''}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  )}
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

                      <TextEditor
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
                      발신자 선택<span className="required">*</span>
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
                    </Table.Cell>
                  </Table.Row>
                  {sendEmails.searchFilter === SearchFilter.SearchOff && (
                    <>
                      <Table.Row>
                        <Table.Cell>
                          발신자 이름<span className="required">*</span>
                        </Table.Cell>
                        <Table.Cell>
                          <Form.Field
                            fluid
                            control={Input}
                            // defaultValue="발신자 이름을 입력해주세요."
                            placeholder="발신자 이름을 입력해주세요."
                            value={sendEmails.senderName}
                            onChange={(e: any) => this.onChangeSenderName(e.target.value)}
                          />
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          발신자 이메일<span className="required">*</span>
                        </Table.Cell>
                        <Table.Cell>
                          <Form.Field
                            fluid
                            control={Input}
                            // defaultValue="발신자 이메일을 입력해주세요."
                            placeholder="발신자 이메일을 입력해주세요."
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
                        </Table.Cell>
                      </Table.Row>
                    </>
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
      </>
    );
  }
}

export default RejectEmailModal;
