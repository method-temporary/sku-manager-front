import React from 'react';
import { useTestCreateFormViewModel } from 'exam/store/TestCreateFormStore';
import { getAnswerScore, getChoiceScore } from 'exam/viewmodel/TestCreateFormViewModel';
import { QuestionListView } from '../view/QuestionListView';
import { TestInfoView } from '../view/TestInfoView';
import { TestSubInfoView } from '../view/TestSubInfoView';

export function TestPreviewContainer() {
  const testCreateForm = useTestCreateFormViewModel();
  const questionCount = testCreateForm !== undefined && testCreateForm.newQuestions.length || 0;
  const choiceScore = (testCreateForm !== undefined && getChoiceScore(testCreateForm.newQuestions)) || 0;
  const answerScore = (testCreateForm !== undefined && getAnswerScore(testCreateForm.newQuestions)) || 0;

  return (
    <>
      {testCreateForm !== undefined && (
        <>
          <div className="privew-modal-header">
            <TestInfoView
              title={testCreateForm.title}
              description={testCreateForm.description}
              authorName={testCreateForm.authorName}
            />
            <TestSubInfoView
              questionCount={questionCount}
              totalScore={choiceScore + answerScore}
              choiceScore={choiceScore}
              answerScore={answerScore}
            />
          </div>
          <QuestionListView questions={testCreateForm.newQuestions} />
        </>
      )}
    </>
  );
}
