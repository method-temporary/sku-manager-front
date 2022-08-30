import * as React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer } from 'mobx-react';
import { Button, Form, Image, Modal, Table } from 'semantic-ui-react';
import { parsingUserAccountErrorMessage } from 'userworkspace/model/dto/UserAccountErrorMessageCode';

interface Props {
  open: boolean;
  text: string;
  failedList: any[];
  onClosed: (value: boolean) => void;
}

interface States {}

interface Injected {}

@observer
@reactAutobind
class UserWorkspaceExcelUploadFailureListModal extends ReactComponent<Props, States, Injected> {
  //

  render() {
    //
    const { onClosed } = this.props;
    const { open, text, failedList } = this.props;

    return (
      <>
        <Modal size="small" open={open}>
          <Modal.Header>엑셀 업로드</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              {failedList.length > 0 ? (
                <Image src={`${process.env.PUBLIC_URL}/images/modal/alert.png`} className="message-icon" />
              ) : null}
              <p dangerouslySetInnerHTML={{ __html: text }} />
            </Modal.Description>
            {failedList.length > 0 ? (
              <Table className="scrolling-table">
                <colgroup>
                  <col width="100%" />
                  <col />
                  <col />
                  <col />
                  <col />
                </colgroup>
                <Table.Header>
                  <Table.Row textAlign="center">
                    <Table.HeaderCell>사번</Table.HeaderCell>
                    <Table.HeaderCell>이메일</Table.HeaderCell>
                    <Table.HeaderCell>연락처</Table.HeaderCell>
                    {/*<Table.HeaderCell>작업구분</Table.HeaderCell>*/}
                    <Table.HeaderCell>결과</Table.HeaderCell>
                    <Table.HeaderCell>비고</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {failedList.map((target, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{target.usid}</Table.Cell>
                      <Table.Cell>{target.email}</Table.Cell>
                      <Table.Cell>{target.phone}</Table.Cell>
                      {/*<Table.Cell>{target.usid}</Table.Cell>*/}
                      <Table.Cell>{target.failedReason}</Table.Cell>
                      <Table.Cell>{parsingUserAccountErrorMessage(target.errorMessageCode)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            ) : null}
          </Modal.Content>
          <Modal.Actions>
            <Button primary onClick={() => onClosed(false)} type="button">
              확인
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default UserWorkspaceExcelUploadFailureListModal;
