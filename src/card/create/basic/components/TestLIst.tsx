import React from 'react';
import { observer } from 'mobx-react';
import { Button, Icon, Table } from 'semantic-ui-react';

import { setTestSheetModalViewModel } from 'exam/store/TestSheetModalStore';
import { QuestionSelectionTypeText } from 'exam/model/QuestionSelectionType';

import { TestWithViewInfo } from '../model/TestWithViewInfo';

interface Props {
  readonly?: boolean;
  tests: TestWithViewInfo[];
  onTestDelete?: (paperId: string) => void;
}

const TestList = observer(({ readonly, tests, onTestDelete }: Props) => {
  //
  const onClickTest = (paperId: string) => {
    setTestSheetModalViewModel({
      isOpen: true,
      testId: paperId,
    });
  };

  const onClickTestDelete = (paperId: string) => {
    //
    onTestDelete && onTestDelete(paperId);
  };

  return (
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
        {tests.map((test: TestWithViewInfo, index) => {
          return (
            <Table.Row key={index}>
              {!readonly && (
                <Table.Cell>
                  <Button
                    icon
                    size="mini"
                    basic
                    name={test.paperId}
                    onClick={(e: any, data: any) => onClickTestDelete(data.name)}
                  >
                    <Icon name="minus" />
                  </Button>
                </Table.Cell>
              )}
              <Table.Cell className="pointer" onClick={() => onClickTest(test.paperId)}>
                {test.examTitle}
              </Table.Cell>
              <Table.Cell>{QuestionSelectionTypeText[test.questionSelectionType]}</Table.Cell>
              <Table.Cell>{`${test.successPoint} / ${test.totalPoint}`}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
});

export default TestList;
