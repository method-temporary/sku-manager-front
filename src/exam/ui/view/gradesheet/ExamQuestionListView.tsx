import React from 'react';
import { List } from 'semantic-ui-react';
import { EssayScore, Question } from 'exam/viewmodel/GradeSheetViewModel';
import { EssayScoreView } from './EssayScoreView';
import { QuestionWrapper } from 'exam/ui/view/QuestionWrapper';
import { SingleChoiceView } from './SingleChoiceView';
import { MultiChoiceView } from './MultiChoiceView';
import { EssayView } from './EssayView';
import { ShortAnswerView } from './ShortAnswerView';

interface ExamQuestionListViewProps {
  examQuestions: Question[];
  essayScores: EssayScore[];
}

export function ExamQuestionListView({ examQuestions, essayScores }: ExamQuestionListViewProps) {
  const essayScoreMap = new Map<number, EssayScore>();

  if (essayScores.length > 0) {
    essayScores.forEach((essayScore) => {
      essayScoreMap.set(essayScore.questionNo, essayScore);
    });
  }

  return (
    <List as="ol" className="num-list" style={{ marginTop: '2.5rem' }}>
      {examQuestions.map((question) => {
        const questionNo = question.sequence;
        const matchedEssayScore = essayScoreMap.get(questionNo);

        return (
          <>
            {question.questionType === 'SingleChoice' && (
              <QuestionWrapper {...question}>
                <SingleChoiceView
                  questionNo={question.sequence}
                  answer={question.examineeAnswer}
                  questionItems={question.items}
                />
              </QuestionWrapper>
            )}
            {question.questionType === 'MultiChoice' && (
              <QuestionWrapper {...question}>
                <MultiChoiceView answer={question.examineeAnswer} questionItems={question.items} />
              </QuestionWrapper>
            )}
            {question.questionType === 'ShortAnswer' && (
              <QuestionWrapper {...question}>
                <ShortAnswerView answer={question.examineeAnswer} />
              </QuestionWrapper>
            )}
            {question.questionType === 'Essay' && (
              <QuestionWrapper {...question}>
                <>
                  <EssayView answer={question.examineeAnswer} />
                  {matchedEssayScore && <EssayScoreView essayScore={matchedEssayScore} />}
                </>
              </QuestionWrapper>
            )}
          </>
        );
      })}
    </List>
  );
}
