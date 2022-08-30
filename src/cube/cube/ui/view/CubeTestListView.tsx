import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Button, Icon, Table } from 'semantic-ui-react';
import { LectureTestListItem } from 'exam/viewmodel/LectureTestListViewModel';

interface Props {
  testList: LectureTestListItem[];
  readonly?: boolean;
  onClickTestDeleteRow: (paperId: string) => void;
  onClickTest: (paperId: string) => void;
}

@observer
@reactAutobind
class CubeTestListView extends ReactComponent<Props, {}> {
  //
  render() {
    const { testList, readonly, onClickTestDeleteRow, onClickTest } = this.props;

    return (
      <Table celled>
        <colgroup>
          {readonly ? null : <col width="5%" />}
          <col width="55%" />
          <col width="20%" />
          <col width="20%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            {readonly ? null : <Table.HeaderCell textAlign="center" />}
            <Table.HeaderCell textAlign="center">시험 제목</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">출제 방식</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">합격점수 / 총점</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {testList.map((test, index) => {
            return (
              <Table.Row key={index}>
                {readonly ? null : (
                  <Table.Cell>
                    <Button
                      size="mini"
                      basic
                      name={test.id}
                      onClick={() => onClickTestDeleteRow(test.id)}
                    >
                      <Icon name="minus" />
                    </Button>
                  </Table.Cell>
                )}
                <Table.Cell className="pointer" onClick={() => onClickTest(test.id)}>
                  {test.title}
                </Table.Cell>
                <Table.Cell textAlign="center">{test.questionSelectionTypeText}</Table.Cell>
                <Table.Cell textAlign="center">{`${test.successPoint} / ${test.totalPoint}`}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}

export default CubeTestListView;
