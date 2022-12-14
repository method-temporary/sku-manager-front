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
      return '??????';
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
    const { sendEmailService } = this.props;
    const { sendEmails } = sendEmailService!;

    let sendEmailObj: string = '';
    sendEmailObj = this.sendEmailIsBlank(sendEmails);

    const cubeIntroMessage = '"' + sendEmailObj + '" ??? ?????? ?????? ???????????????. ?????? ????????? ???????????? ??? ??????????????????.';
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
              title: '??????',
              message: '?????? ?????? ?????????????????????.',
              onClose: () => this.close(),
            });
          })
          .catch((res) => {
            reactAlert({
              title: '??????',
              message: '?????? ?????? ??????????????????.',
              onClose: () => this.close(),
            });
          });
      })
      .catch((res) => {
        reactAlert({
          title: '??????',
          message: '?????? ??????????????????.',
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
    const { onChangeRemark } = this.props;
    // const { mailCont } = this.state;
    // // HTML Tag ??????
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
          {buttonText || '??????'}
        </Button>

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
                  <Table.Row>
                    <Table.Cell>????????? ?????????</Table.Cell>
                    <Table.Cell>
                      {sendEmails.names && sendEmails.names.length > 1 && (
                        <>
                          <span style={{ verticalAlign: '-webkit-baseline-middle' }}>
                            ????????? ????????? {sendEmails.names.length} ???
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
                  {sendEmails.cubeTitles && sendEmails.cubeTitles.length === 1 && (
                    <Table.Row>
                      <Table.Cell>?????????</Table.Cell>
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
                      ??????<span className="required">*</span>
                    </Table.Cell>
                    <Table.Cell>
                      {/* <TextArea
                        // defaultValue="??????"
                        placeholder="???????????? ????????? ????????? ??????????????? ?????????????????????."
                        rows={6}
                      /> */}

                      <TextEditor
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
                      ????????? ??????<span className="required">*</span>
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
                    </Table.Cell>
                  </Table.Row>
                  {sendEmails.searchFilter === SearchFilter.SearchOff && (
                    <>
                      <Table.Row>
                        <Table.Cell>
                          ????????? ??????<span className="required">*</span>
                        </Table.Cell>
                        <Table.Cell>
                          <Form.Field
                            fluid
                            control={Input}
                            // defaultValue="????????? ????????? ??????????????????."
                            placeholder="????????? ????????? ??????????????????."
                            value={sendEmails.senderName}
                            onChange={(e: any) => this.onChangeSenderName(e.target.value)}
                          />
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          ????????? ?????????<span className="required">*</span>
                        </Table.Cell>
                        <Table.Cell>
                          <Form.Field
                            fluid
                            control={Input}
                            // defaultValue="????????? ???????????? ??????????????????."
                            placeholder="????????? ???????????? ??????????????????."
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
