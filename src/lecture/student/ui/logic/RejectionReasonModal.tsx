import React, { Fragment } from 'react';
import { Button, Modal, Table } from 'semantic-ui-react';

interface Props {
  open: boolean;
  handleClose: () => void;
  message: string;
}

class RejectionReasonModal extends React.Component<Props> {
  //
  render() {
    const { open, handleClose, message } = this.props;
    return (
      <>
        <Fragment>
          <Modal size="small" open={open} onClose={handleClose}>
            <Modal.Header>반려 사유</Modal.Header>
            <Modal.Content>
              {/* 반려사유 입력 */}
              <Table celled>
                <colgroup>
                  <col width="20%" />
                  <col width="80%" />
                </colgroup>

                <Table.Body>
                  <Table.Row>
                    <Table.Cell>처리정보</Table.Cell>
                    <Table.Cell>홍길동 | SK C&C | Collage Admin | 2019.10.18</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>반려사유</Table.Cell>
                    <Table.Cell>{message}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Modal.Content>
            <Modal.Actions centered>
              <Button onClick={handleClose} type="button">
                OK
              </Button>
            </Modal.Actions>
          </Modal>
        </Fragment>
      </>
    );
  }
}

export default RejectionReasonModal;
