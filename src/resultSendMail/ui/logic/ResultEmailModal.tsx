import React from 'react';
import { Button, Form, Modal, Table, Container } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { mobxHelper, reactAutobind } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import ResultMailService from 'resultSendMail/present/logic/ResultMailService';
import { UserIdentityModel } from 'cube/user/model/UserIdentityModel';

interface Props {
  onClose: () => void;
  resultMailService?: ResultMailService;
}

interface States {
  openModal: boolean;
  receiverCount: number;
}

@inject(mobxHelper.injectFrom('resultMailService'))
@observer
@reactAutobind
class ResultEmailModal extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openModal: false,
      receiverCount: 0,
    };
  }

  //
  componentDidMount(): void {
    this.setState({ openModal: true });

    const { resultMailService } = this.props;
    const { resultSendCont } = resultMailService!;
    let receiverCount = 0;
    resultSendCont.sendLists &&
      resultSendCont.sendLists.length &&
      resultSendCont.sendLists.map((model: any, idx: any) => {
        if (model.receiverEmail !== undefined) {
          const emails = model.receiverEmail?.split(',') || [];
          emails.map((email: any) => {
            receiverCount++;
          });
          if (model.receiverName === null) {
            resultMailService?.findUsersByEmails(emails).then((emailRtn: UserIdentityModel[]) => {
              let name = '';
              emailRtn.map((emailRes: UserIdentityModel) => {
                name += getPolyglotToAnyString(emailRes.name) + ',';
              });
              resultMailService?.changeResultMailContSendListProps(
                idx,
                'receiverName',
                name === '' ? '' : name.substr(0, name.length - 1)
              );
            });
          }
        }
      });
    this.setState({ receiverCount });
  }

  // props 변경되었을때
  componentDidUpdate(prevProps: Props) {
    //
  }

  // 화면 나갈때 액션
  componentWillUnmount(): void {
    this.setState({ openModal: false });
  }

  close() {
    this.closePop();
  }

  //
  closePop() {
    const { onClose } = this.props;
    this.setState({ openModal: false });
    if (onClose) {
      onClose();
    }
  }

  render() {
    const { resultMailService } = this.props;
    const { resultSendCont } = resultMailService!;
    const { openModal, receiverCount } = this.state;
    return (
      <>
        <Container fluid>
          <Modal
            size="large"
            open={openModal}
            closeOnDimmerClick={false} // dim 클릭으로 닫기  true : O, false : X
            onClose={this.close}
          >
            <Modal.Header>메일보내기</Modal.Header>
            <Modal.Content>
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
                        <span style={{ verticalAlign: '-webkit-baseline-middle' }}>
                          선택된 수신자 {receiverCount} 명
                        </span>
                        <p />
                        {(resultSendCont.sendLists &&
                          resultSendCont.sendLists.length &&
                          resultSendCont.sendLists.map((model: any, idx: any) => {
                            if (resultSendCont.sendLists.length === 1) {
                              return model.receiverName;
                            }
                            if (idx === 0) {
                              return model.receiverName;
                            } else {
                              return ', ' + model.receiverName;
                            }
                          })) ||
                          ''}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>타이틀</Table.Cell>
                      <Table.Cell>
                        <span style={{ verticalAlign: '-webkit-baseline-middle' }}>
                          {resultSendCont.sendLists && resultSendCont.sendLists[0].mailTitle}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>과정명</Table.Cell>
                      <Table.Cell>
                        <span style={{ verticalAlign: '-webkit-baseline-middle' }}>
                          {resultSendCont.sendLists && resultSendCont.sendLists[0].cubeName}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>내용</Table.Cell>
                      <Table.Cell>
                        <div
                          style={{
                            width: '820px',
                            overflow: 'hidden',
                          }}
                          className="ql-editor"
                          dangerouslySetInnerHTML={{
                            __html: resultSendCont.sendTemplate && resultSendCont.sendTemplate.body,
                          }}
                        />
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>담당자</Table.Cell>
                      <Table.Cell>
                        <span style={{ verticalAlign: '-webkit-baseline-middle' }}>
                          {resultSendCont.sendLists && resultSendCont.sendLists[0].dispatcherName} :{' '}
                          {resultSendCont.sendLists && resultSendCont.sendLists[0].dispatcherEmail}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.close} type="button">
                OK
              </Button>
            </Modal.Actions>
          </Modal>
        </Container>
      </>
    );
  }
}

export default ResultEmailModal;
