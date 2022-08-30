import React from 'react';
import { List } from 'semantic-ui-react';
import { SingleChoiceView } from './SingleChoiceView';
import { MultiChoiceView } from './MultiChoiceView';
import { ShortAnswerView } from './ShortAnswerView';
import { EssayView } from './EssayView';
import { Question } from 'exam/viewmodel/GradeSheetViewModel';
import { QuestionType } from 'exam/model/QuestionType';

interface ExamQuestionViewProps {
  examQuestion: Question;
}

export function ExamQuestionView({
  examQuestion: { sequence, questionType, point, question, items, imagePath, examineeAnswer, isCorrect },
}: ExamQuestionViewProps) {
  return (
    <>
      {
        <List.Item as="li" key={sequence}>
          <div className={`ol-title ${getCorrectStyle(questionType, isCorrect)}`}>
            {question}
            <span className="q-score">({point}점)</span>
            {imagePath && <img src={imagePath} className="img-list" />}
          </div>
          <div className="ol-answer">
            {questionType === 'SingleChoice' && (
              <SingleChoiceView questionNo={sequence} answer={examineeAnswer} questionItems={items} />
            )}
            {questionType === 'MultiChoice' && <MultiChoiceView answer={examineeAnswer} questionItems={items} />}
            {questionType === 'ShortAnswer' && <ShortAnswerView answer={examineeAnswer} />}
            {questionType === 'Essay' && <EssayView answer={examineeAnswer} />}
          </div>
        </List.Item>
      }
    </>
  );
}

const getCorrectStyle = (questionType: QuestionType, isCorrect: boolean): string => {
  if (questionType === 'Essay') {
    return '';
  }
  return isCorrect ? 'exact-answer' : 'wrong-answer';
};
