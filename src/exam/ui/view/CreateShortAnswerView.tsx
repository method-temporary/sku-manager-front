import React from 'react';
import { Table, Form, Input, InputOnChangeData, TextArea, TextAreaProps } from 'semantic-ui-react';

import { Question } from 'exam/viewmodel/TestSheetViewModel';
import { onChangeQuestionAnswer, onChangeQuestionAnswerExplanation } from '../../handler/TestCreateQuestionHandler';

interface CreateShortAnswerViewProps {
  finalCopy: boolean;
  newQuestion: Question;
}

export function CreateShortAnswerView({ finalCopy, newQuestion }: CreateShortAnswerViewProps) {
  return (
    <>
      <Table.Row>
        <Table.Cell className="tb-header" colSpan={2}>
          정답
        </Table.Cell>
        <Table.Cell colSpan={11}>
          <div
            className={
              newQuestion.questionAnswer.answer.length >= 100
                ? 'ui right-top-count input error'
                : 'ui right-top-count input'
            }
          >
            <span className="count">
              <span className="now">{newQuestion.questionAnswer.answer.length}</span>/<span className="max">100</span>
            </span>
            <Form.Field
              readOnly={finalCopy}
              width={16}
              control={Input}
              placeholder="예)1,2,3"
              value={newQuestion.questionAnswer.answer}
              onChange={(e: React.ChangeEvent, data: InputOnChangeData) =>
                onChangeQuestionAnswer(newQuestion.sequence, data.value)
              }
            />
          </div>
        </Table.Cell>
      </Table.Row>
    </>
  );
}
