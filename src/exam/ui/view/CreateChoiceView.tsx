import React from 'react';
import { Question } from 'exam/viewmodel/TestSheetViewModel';
import { CreateQuestionItemView } from './CreateQuestionItemView';
import { Table } from 'semantic-ui-react';

interface CreateChoiceViewProps {
  finalCopy: boolean;
  newQuestion: Question;
}

export function CreateChoiceView({ finalCopy, newQuestion }: CreateChoiceViewProps) {
  return (
    <>
      {newQuestion.items.map((questionItem, index) => (
        <Table.Row key={index}>
          <CreateQuestionItemView
            key={index}
            index={index}
            finalCopy={finalCopy}
            questionNo={newQuestion.sequence}
            questionType={newQuestion.questionType}
            questionAnswer={newQuestion.questionAnswer.answer}
            newQuestionItem={questionItem}
            itemCount={newQuestion.items.length}
          />
        </Table.Row>
      ))}
    </>
  );
}
