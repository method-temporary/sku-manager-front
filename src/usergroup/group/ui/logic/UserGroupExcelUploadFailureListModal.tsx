import * as React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer } from 'mobx-react';
import { Button, Form, Image, Modal, Table } from 'semantic-ui-react';

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
class UserGroupExcelUploadFailureListModal extends ReactComponent<Props, States, Injected> {
  //

  render() {
    //
    const { onClosed } = this.props;
    const { open, text, failedList } = this.props;

    console.log(failedList);
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
                </colgroup>
                <Table.Header>
                  <Table.Row textAlign="center">
                    <Table.HeaderCell>이메일</Table.HeaderCell>
                    <Table.HeaderCell>결과</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {failedList.map((target, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{target.email}</Table.Cell>
                      <Table.Cell>{target.failedReason}</Table.Cell>
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

export default UserGroupExcelUploadFailureListModal;
