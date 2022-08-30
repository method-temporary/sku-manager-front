import React from 'react';
import { useRequestLectureTest } from 'exam/hooks/useRequestLectureTest';
import { useTestSheetViewModel } from 'exam/store/TestSheetStore';
import { QuestionListView } from '../view/QuestionListView';
import { TestInfoView } from '../view/TestInfoView';
import { QuestionSelectionInfoView } from '../view/QuestionSlectionInfoView';

export function LectureTestSheetContainer() {
  useRequestLectureTest();
  const testSheet = useTestSheetViewModel();

  return (
    <>
      {testSheet !== undefined && (
        <>
          <div className="privew-modal-header">
            <TestInfoView
              title={testSheet.title}
              description={testSheet.description}
              authorName={testSheet.authorName}
            />
            <QuestionSelectionInfoView
              questionSelectionTypeText={testSheet.questionSelectionTypeText}
              questionCount={testSheet.questionCount}
              totalPoint={testSheet.totalPoint}
              successPoint={testSheet.successPoint}
              choiceScore={testSheet.choiceScore}
              answerScore={testSheet.answerScore}
            />
          </div>
          <QuestionListView questions={testSheet.questions} />
        </>
      )}
    </>
  );
}
