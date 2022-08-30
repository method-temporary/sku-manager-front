import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import React from 'react';
import { Button, Image, Modal, Table } from 'semantic-ui-react';

interface Props {
  open: boolean;
  text: string;
  failedList: string[];
  onClosed: (value: boolean) => void;
}

interface States {}

@observer
@reactAutobind
class CubeStudentExcelUploadFailureListModal extends ReactComponent<Props, States, {}> {
  //
  render() {
    //
    const { onClosed } = this.props;
    const { open, text, failedList } = this.props;

    return (
      <Modal size="small" open={open}>
        <Modal.Header>엑셀 업로드</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {failedList.length > 0 ? (
              <Image src={`${process.env.PUBLIC_URL}/images/modal/alert.png`} className="message-icon" />
            ) : null}
            <p>{text}</p>
          </Modal.Description>
          {failedList.length > 0 ? (
            <Table className="scrolling-table">
              <colgroup>
                <col />
              </colgroup>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell textAlign="center">등록 실패 이메일</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {failedList.map((target, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{target}</Table.Cell>
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
    );
  }
}

export default CubeStudentExcelUploadFailureListModal;
