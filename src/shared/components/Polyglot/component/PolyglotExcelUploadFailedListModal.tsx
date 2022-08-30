import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Button, Image, Modal, Table } from 'semantic-ui-react';
import * as React from 'react';

interface Props {
  open: boolean;
  failedList: string[];
  onClosed: (value: boolean) => void;
}

interface States {}

@observer
@reactAutobind
class PolyglotExcelUploadFailedListModal extends ReactComponent<Props, States> {
  //
  render() {
    //
    const { onClosed } = this.props;
    const { open, failedList } = this.props;

    return (
      <>
        <Modal size="small" open={open}>
          <Modal.Header>Bulk Upload</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              {failedList.length > 0 ? (
                <Image src={`${process.env.PUBLIC_URL}/images/modal/alert.png`} className="message-icon" />
              ) : null}
              <p>{`Upload Success. (Failed Count : ${failedList.length})`}</p>
            </Modal.Description>
            {failedList.length > 0 ? (
              <Table className="scrolling-table">
                <colgroup>
                  <col />
                </colgroup>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign="center">ID</Table.HeaderCell>
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
      </>
    );
  }
}

export default PolyglotExcelUploadFailedListModal;
