import React from 'react';
import { Modal } from 'semantic-ui-react';
import { EssayScore, hasEssayQuestion, ObtainedScore, Question, QuestionSelectionInfo, TestInfo } from 'exam/viewmodel/GradeSheetViewModel';
import { ExamQuestionListView } from './ExamQuestionListView';
import { GraderCommentView } from './GraderCommentView';
import { ObtainedScoreView } from './ObtainedScoreView';
import { TestInfoView } from 'exam/ui/view/TestInfoView';
import { QuestionSelectionInfoView } from 'exam/ui/view/QuestionSlectionInfoView';


interface GradeSheetViewProps {
  testInfo: TestInfo;
  questionSelectionInfo: QuestionSelectionInfo;
  questions: Question[];
  obtainedScore: ObtainedScore;
  essayScores: EssayScore[];
  graderComment?: string;
}

export function GradeSheetView({
  testInfo,
  questionSelectionInfo,
  questions,
  obtainedScore,
  essayScores,
  graderComment,
}: GradeSheetViewProps) {
  const hasEssay = hasEssayQuestion(questions);
  const answerScore = obtainedScore.shortAnswerScore + obtainedScore.essayScore;
  const totalScore = obtainedScore.choiceScore + answerScore;

  return (
    <>
      <Modal.Header className="res">
      </Modal.Header>
      <Modal.Content className="content_text">
        <div className="scrolling-80vh">
          <div className="content-wrap1">
            <div className="privew-modal-header">
              <TestInfoView
                title={testInfo.title}
                description={testInfo.description}
                authorName={testInfo.authorName}
              />
              <QuestionSelectionInfoView
                questionSelectionTypeText={questionSelectionInfo.questionSelectionTypeText}
                questionCount={questionSelectionInfo.questionCount}
                successPoint={questionSelectionInfo.successPoint}
                totalPoint={questionSelectionInfo.totalPoint}
                choiceScore={questionSelectionInfo.choiceScore}
                answerScore={questionSelectionInfo.answerScore}
              />
            </div>
            <ExamQuestionListView
              examQuestions={questions}
              essayScores={essayScores}
            />
            <ObtainedScoreView
              choiceScore={obtainedScore.choiceScore}
              answerScore={answerScore}
              totalScore={totalScore}
            />
            {hasEssay && (
              <GraderCommentView
                graderComment={graderComment}
              />
            )}
          </div>
        </div>
      </Modal.Content>
    </>
  );
}