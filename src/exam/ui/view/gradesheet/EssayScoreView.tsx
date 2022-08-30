import React from 'react';
import { Input, Form } from 'semantic-ui-react';
import { EssayScore, ObtainedScore } from 'exam/viewmodel/GradeSheetViewModel';
import { getGradeSheetViewModel, setGradeSheetViewModel } from 'exam/store/GradeSheetStore';
import { useResultManagementViewModel } from 'student/store/ResultManagementStore';

interface EssayScoreViewProps {
  essayScore: EssayScore;
}

export function EssayScoreView({ essayScore }: EssayScoreViewProps) {
  const resultManagementViewModel = useResultManagementViewModel();
  const gradeFinished = resultManagementViewModel !== undefined ? resultManagementViewModel.gradeFinished : false;

  const onChangeScore = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const gradeSheetViewModel = getGradeSheetViewModel();
    if (gradeSheetViewModel === undefined) {
      return;
    }

    const targetQuestionNo = Number.parseInt(e.target.name);
    const nextScore = (e.target.value && Number.parseInt(e.target.value)) || 0;

    if (nextScore >= 0 && nextScore <= essayScore.allocatedPoint) {
      const nextEssayScore: EssayScore = {
        questionNo: targetQuestionNo,
        allocatedPoint: essayScore.allocatedPoint,
        score: nextScore,
      };

      const nextEssayScores: EssayScore[] = gradeSheetViewModel.essayScores
        .filter((essayScore) => essayScore.questionNo !== targetQuestionNo)
        .concat(nextEssayScore);

      const totalEssayScore = nextEssayScores.map((essayScore) => essayScore.score).reduce((a, b) => a + b);

      setGradeSheetViewModel({
        ...gradeSheetViewModel,
        obtainedScore: {
          ...gradeSheetViewModel.obtainedScore,
          essayScore: totalEssayScore,
        },
        essayScores: nextEssayScores,
      });
    }
  };

  return (
    <>
      {gradeFinished ? (
        <div style={{ marginBottom: 8, textAlign: 'left' }}>
          <span className="bold">서술형 점수 : {essayScore.score || 0}점</span>
        </div>
      ) : (
        <div style={{ marginBottom: 8 }}>
          <span style={{ marginRight: 4 }}> 서술형 점수</span>
          <Form.Field
            control={Input}
            className="inline-block"
            width={1}
            type="text"
            name={essayScore.questionNo}
            value={essayScore.score}
            onChange={onChangeScore}
          />
        </div>
      )}
    </>
  );
}
