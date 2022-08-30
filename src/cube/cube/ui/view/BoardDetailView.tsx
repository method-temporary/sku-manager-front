import { BoardModel } from '../../../board/board/model/BoardModel';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Form, Table } from 'semantic-ui-react';
import { reactAutobind } from '@nara.platform/accent';

interface Props {
  board: BoardModel;
}

@observer
@reactAutobind
class BoardDetailView extends React.Component<Props> {
  // Cube 관리 > create > Community
  // 부가정보
  render() {
    const { board } = this.props;
    return (
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2} className="title-header">
              부가 정보
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>오픈형/폐쇄형</Table.Cell>
            {board && board.config && board.config.enClosed ? (
              <Table.Cell>폐쇄형</Table.Cell>
            ) : (
              <Table.Cell>오픈형</Table.Cell>
            )}
          </Table.Row>
          {board && board.config && board.config.enClosed ? (
            <Table.Row>
              <Table.Cell>학습시작일 및 종료일</Table.Cell>
              <Table.Cell>
                <Form.Group>
                  <Form.Field>{(board && board.learningPeriod && board.learningPeriod.startDate) || ''}</Form.Field>~
                  <Form.Field>{(board && board.learningPeriod && board.learningPeriod.endDate) || ''}</Form.Field>
                </Form.Group>
              </Table.Cell>
            </Table.Row>
          ) : (
            ''
          )}
        </Table.Body>
      </Table>
    );
  }
}

export default BoardDetailView;
