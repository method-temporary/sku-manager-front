import * as React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer } from 'mobx-react';
import { Button, Form, Image, Modal, Table } from 'semantic-ui-react';
import StudentDeleteResultModel from 'student/model/StudentDeleteResultModel';

interface Props {
  open: boolean;
  text: string;
  failedStudentList: StudentDeleteResultModel[];
  onClosed: (value: boolean) => void;
}

interface States {}

interface Injected {}

@observer
@reactAutobind
class CardStudentRemoveResultModal extends ReactComponent<Props, States, Injected> {
  //

  render() {
    //
    const { onClosed } = this.props;
    const { open, text, failedStudentList } = this.props;

    return (
      <>
        <Modal size="small" open={open}>
          <Modal.Header>학습자 삭제 결과</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              {failedStudentList.length > 0 ? (
                <Image src={`${process.env.PUBLIC_URL}/images/modal/alert.png`} className="message-icon" />
              ) : null}
              <p dangerouslySetInnerHTML={{ __html: text }} />
            </Modal.Description>
            {failedStudentList.length > 0 ? (
              <>
                <div style={{ color: 'red' }}>* 아래 Cube의 학습자를 삭제해야 Card학습자 삭제가 가능합니다.</div>
                <Table className="scrolling-table">
                  <colgroup>
                    <col />
                  </colgroup>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>성명</Table.HeaderCell>
                      <Table.HeaderCell>Cube Id</Table.HeaderCell>
                      <Table.HeaderCell>삭제여부</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {/* {failedStudentList.map(
                    (student, studentIdx) =>
                      student.cubeIds &&
                      student.cubeIds.length > 0 &&
                      student.cubeIds.map((cubeId, cubeIdx) => (
                        <Table.Row key={`${studentIdx}-${cubeIdx}`}>
                          <Table.Cell>{student.name}</Table.Cell>
                          <Table.Cell>{cubeId}</Table.Cell>
                        </Table.Row>
                      ))
                  )} */}

                    {failedStudentList.map((student, studentIdx) => {
                      const cubeIds = student.cubeIds && student.cubeIds.length > 0 && student.cubeIds.join(', ');
                      return (
                        <Table.Row key={studentIdx}>
                          <Table.Cell>{student.name}</Table.Cell>
                          <Table.Cell>{cubeIds}</Table.Cell>
                          <Table.Cell>{student.removed ? '성공' : '실패'}</Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              </>
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

export default CardStudentRemoveResultModal;
