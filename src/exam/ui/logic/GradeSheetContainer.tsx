import React from 'react';
import { useGradeSheetViewModel } from 'exam/store/GradeSheetStore';
import { GradeSheetView } from '../view/gradesheet/GradeSheetView';

export function GradeSheetContainer() {
  const gradeSheetViewModel = useGradeSheetViewModel();

  return (
    <>
      {gradeSheetViewModel !== undefined && (
        <GradeSheetView
          testInfo={gradeSheetViewModel.testInfo}
          questionSelectionInfo={gradeSheetViewModel.questionSelectionInfo}
          questions={gradeSheetViewModel.questions}
          obtainedScore={gradeSheetViewModel.obtainedScore}
          essayScores={gradeSheetViewModel.essayScores}
          graderComment={gradeSheetViewModel.graderComment}
        />
      )}
    </>
  );
}
