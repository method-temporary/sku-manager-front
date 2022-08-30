import { LectureTestListItem } from 'exam/viewmodel/LectureTestListViewModel';
import React from 'react';
import { Button, Icon, Table } from 'semantic-ui-react';

interface CardTestListViewProps {
  testList: LectureTestListItem[];
  readonly?: boolean;
  onClickTest: (paperId: string) => void;
  onClickTestDeleteRow: (paperId: string) => void;
}

export function CardTestListView({
  testList,
  readonly,
  onClickTest,
  onClickTestDeleteRow,
}: CardTestListViewProps) {

  return (
    <>
      <Table celled>
        <colgroup>
          {!readonly && <col width="5%" />}
          <col width="55%" />
          <col width="20%" />
          <col width="20%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            {!readonly && <Table.HeaderCell textAlign="center" />}
            <Table.HeaderCell textAlign="center">시험 제목</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">출제 방식</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">합격점수 / 총점</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {testList.map((test, index) => {
            return (
              <Table.Row key={index}>
                {!readonly && (
                  <Table.Cell>
                    <Button
                      icon
                      size="mini"
                      basic
                      name={test.id}
                      onClick={(e: any, data: any) => onClickTestDeleteRow(data.name)}
                    >
                      <Icon name="minus" />
                    </Button>
                  </Table.Cell>
                )}
                <Table.Cell className="pointer" onClick={() => onClickTest(test.id)}>
                  {test.title}
                </Table.Cell>
                <Table.Cell  >
                  {test.questionSelectionTypeText}
                </Table.Cell>
                <Table.Cell>
                  {`${test.successPoint} / ${test.totalPoint}`}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
}
