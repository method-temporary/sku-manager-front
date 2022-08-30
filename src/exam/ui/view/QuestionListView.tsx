import React from 'react';
import { Question } from 'exam/viewmodel/TestSheetViewModel';
import { QuestionWrapper } from './QuestionWrapper';
import { SingleChoiceView } from './gradesheet/SingleChoiceView';
import { MultiChoiceView } from './gradesheet/MultiChoiceView';
import { ShortAnswerView } from './gradesheet/ShortAnswerView';
import { EssayView } from './gradesheet/EssayView';

interface QuestionListViewProps {
  questions: Question[];
}

export function QuestionListView({ questions }: QuestionListViewProps) {
  return (
    <>
      {questions.map((question, index) => {
        const renderQuestion = getRenderQuestion(question, index);
        return renderQuestion;
      })}
    </>
  );
}

function getRenderQuestion(question: Question, index: number) {
  switch (question.questionType) {
    case 'SingleChoice':
      return (
        <QuestionWrapper key={index} {...question}>
          <SingleChoiceView
            questionNo={question.sequence}
            answer={question.questionAnswer.answer}
            questionItems={question.items}
          />
        </QuestionWrapper>
      );
    case 'MultiChoice':
      return (
        <QuestionWrapper key={index} {...question}>
          <MultiChoiceView answer={question.questionAnswer.answer} questionItems={question.items} />
        </QuestionWrapper>
      );
    case 'ShortAnswer':
      return (
        <QuestionWrapper key={index} {...question}>
          <ShortAnswerView answer={question.questionAnswer.answer} />
        </QuestionWrapper>
      );
    case 'Essay':
      return (
        <QuestionWrapper key={index} {...question}>
          <EssayView />
        </QuestionWrapper>
      );
    default:
      return null;
  }
}
