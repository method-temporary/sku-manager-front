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
class LearningTrainingListModal extends React.Component<Props> {
  render() {
    const { open, handleClose } = this.props;
    return (
      <React.Fragment>
        <Modal size="large" open={open} onClose={handleClose}>
          <Modal.Header>학습내역 정보</Modal.Header>
          <Modal.Content>
            전체 50개 강의 참여 중 | 20개 학습 수강 완료 / 10개 강의 진행 중 / 2개 강의 수강 신청 / 1개 강의 수강 반려
            <Form>
              <Table celled>
                <colgroup>
                  <col width="8%" />
                  <col width="35%" />
                  <col width="15%" />
                  <col width="15%" />
                  <col width="15%" />
                  <col width="12%" />
                </colgroup>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
                    <Table.HeaderCell>과정명</Table.HeaderCell>
                    <Table.HeaderCell>학습유형</Table.HeaderCell>
                    <Table.HeaderCell>대표 카테고리</Table.HeaderCell>
                    <Table.HeaderCell>스깅일자</Table.HeaderCell>
                    <Table.HeaderCell>생성자</Table.HeaderCell>
                    <Table.HeaderCell>학습상태</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Table.Row>
                    <Table.Cell textAlign="center">20</Table.Cell>
                    <Table.Cell>AI와 Block chain과의 상관관계는 어떻게 되는가?</Table.Cell>
                    <Table.Cell>Classroom</Table.Cell>
                    <Table.Cell>college &gt; Channel</Table.Cell>
                    <Table.Cell>2019.10.18</Table.Cell>
                    <Table.Cell>홍길동</Table.Cell>
                    <Table.Cell>수강완료</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell textAlign="center">19</Table.Cell>
                    <Table.Cell>AI와 Block chain과의 상관관계는 어떻게 되는가?</Table.Cell>
                    <Table.Cell>Classroom</Table.Cell>
                    <Table.Cell>college &gt; Channel</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                    <Table.Cell>홍길동</Table.Cell>
                    <Table.Cell>진행 중</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell textAlign="center">18</Table.Cell>
                    <Table.Cell>AI와 Block chain과의 상관관계는 어떻게 되는가?</Table.Cell>
                    <Table.Cell>Classroom</Table.Cell>
                    <Table.Cell>college &gt; Channel</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                    <Table.Cell>홍길동</Table.Cell>
                    <Table.Cell>수강 신청</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell textAlign="center">17</Table.Cell>
                    <Table.Cell>AI와 Block chain과의 상관관계는 어떻게 되는가?</Table.Cell>
                    <Table.Cell>Classroom</Table.Cell>
                    <Table.Cell>college &gt; Channel</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                    <Table.Cell>홍길동</Table.Cell>
                    <Table.Cell>수강반려</Table.Cell>
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

export default LearningTrainingListModal;
