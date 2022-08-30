import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import dayjs from 'dayjs';

import { QuestionSelectionTypeText } from 'exam/model/QuestionSelectionType';
import { ExamPaperModel } from 'exam/model/ExamPaperModel';

import { isCheckedExamPaper } from '../TestModal.util';
import TestModalStore from '../TestModal.store';

interface Props {
  examPapers: ExamPaperModel[];
}

const TestModalList = observer(({ examPapers }: Props) => {
  //
  const { selectedExamPapers, setSelectedExamPapers } = TestModalStore.instance;

  const onCheckExamPaper = (checked: boolean, selectedExamPaper: ExamPaperModel) => {
    //
    let next = [...selectedExamPapers];

    if (checked) {
      next.push(selectedExamPaper);
    } else {
      next = selectedExamPapers
        .filter((examPaper) => examPaper.id !== selectedExamPaper.id)
        .map((examPaper) => examPaper);
    }

    setSelectedExamPapers(next);
  };

  return (
    <Form>
      <Table>
        <colgroup>
          <col width="10%" />
          <col width="50%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">Select</Table.HeaderCell>
            <Table.HeaderCell>시험이름</Table.HeaderCell>
            <Table.HeaderCell>출제 방식</Table.HeaderCell>
            <Table.HeaderCell>최종본 여부</Table.HeaderCell>
            <Table.HeaderCell>등록일</Table.HeaderCell>
            <Table.HeaderCell>등록자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {examPapers && examPapers.length > 0 ? (
            <>
              {examPapers.map((examPaper: ExamPaperModel, index: number) => {
                return (
                  <Table.Row key={index}>
                    <Table.Cell textAlign="center">
                      <Form.Field
                        control={Checkbox}
                        value="1"
                        checked={isCheckedExamPaper(examPaper.id)}
                        onChange={(_: any, data: any) => onCheckExamPaper(data.checked, examPaper)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <span className="ellipsis">{examPaper.title}</span>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {QuestionSelectionTypeText[examPaper.questionSelectionType]}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{examPaper.finalCopy ? '최종본' : '수정가능본'}</Table.Cell>
                    <Table.Cell textAlign="center">{dayjs(examPaper.time).format('YYYY-MM-DD')}</Table.Cell>
                    <Table.Cell textAlign="center">{examPaper.authorName}</Table.Cell>
                  </Table.Row>
                );
              })}
            </>
          ) : (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={6}>
                <div className="no-cont-wrap no-contents-icon">
                  <Icon className="no-contents80" />
                  <div className="sr-only">콘텐츠 없음</div>
                  <div className="text">검색 결과를 찾을 수 없습니다.</div>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Form>
  );
});

export default TestModalList;
