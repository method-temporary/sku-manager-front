import * as React from 'react';
import { Table, Modal, Form, Pagination, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';

interface Props {
  open: boolean;
  handleClose: () => void;
}

@observer
@reactAutobind
class CommunityListModal extends React.Component<Props> {
  render() {
    const { open, handleClose } = this.props;
    return (
      <React.Fragment>
        <Modal size="large" open={open} onClose={handleClose}>
          <Modal.Header>커뮤니티 정보</Modal.Header>
          <Modal.Content>
            총 200개 커뮤니티 가입 중
            <Form>
              <Table celled>
                <colgroup>
                  <col width="8%" />
                  <col width="42%" />
                  <col width="20%" />
                  <col width="15%" />
                  <col width="15%" />
                </colgroup>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
                    <Table.HeaderCell>커뮤니티명</Table.HeaderCell>
                    <Table.HeaderCell>대표 카테고리</Table.HeaderCell>
                    <Table.HeaderCell>가입일자</Table.HeaderCell>
                    <Table.HeaderCell>생성자</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Table.Row>
                    <Table.Cell textAlign="center">20</Table.Cell>
                    <Table.Cell>mySUNI 커뮤니티의 첫번째 커뮤니티</Table.Cell>
                    <Table.Cell>college &gt; Channel</Table.Cell>
                    <Table.Cell>2019.10.18</Table.Cell>
                    <Table.Cell>Admin</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Form>
            <div className="center">
              <Pagination
                boundaryRange={0}
                defaultActivePage={1}
                ellipsisItem={null}
                firstItem={null}
                lastItem={null}
                siblingRange={1}
                totalPages={10}
              />
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleClose} type="button">
              Close
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CommunityListModal;
