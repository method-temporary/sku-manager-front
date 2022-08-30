import * as React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer } from 'mobx-react';
import { Button, Form, Image, Modal, Table } from 'semantic-ui-react';

interface Props {
  open: boolean;
  text: string;
  failedEmailList: string[];
  onClosed: (value: boolean) => void;
}

interface States {}

interface Injected {}

@observer
@reactAutobind
class CardStudentUploadResultListModal extends ReactComponent<Props, States, Injected> {
  //

  render() {
    //
    const { onClosed } = this.props;
    const { open, text, failedEmailList } = this.props;

    return (
      <>
        <Modal size="small" open={open}>
          <Modal.Header>엑셀 업로드</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              {failedEmailList.length > 0 ? (
                <Image src={`${process.env.PUBLIC_URL}/images/modal/alert.png`} className="message-icon" />
              ) : null}
              <p>{text}</p>
            </Modal.Description>
            {failedEmailList.length > 0 ? (
              <Table className="scrolling-table">
                <colgroup>
                  <col />
                </colgroup>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>등록 실패 이메일</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {failedEmailList.map((email, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{email}</Table.Cell>
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

export default CardStudentUploadResultListModal;
