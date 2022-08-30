import React, { useCallback } from 'react';
import { useRequestGradeSheet } from 'exam/hooks/useRequestGradeSheet';
import { useResultManagementViewModel, setResultManagementViewModel } from 'student/store/ResultManagementStore';
import { getEmptyResultManagementViewModel } from 'student/viewModel/ResultManagementViewModel';
import GradeSheetResultModalView from '../view/gradesheet/GradeSheetResultModalView';


export default function GradeSheetResultModalContainer() {
  useRequestGradeSheet();
  const { gradeModalOpen, gradeFinished } = useResultManagementViewModel() || getEmptyResultManagementViewModel();

  const onModalClose = useCallback(() => {
    setResultManagementViewModel(getEmptyResultManagementViewModel());
  }, []);

  return (
    <>{gradeFinished && (
      <GradeSheetResultModalView modalOpen={gradeModalOpen} onModalClose={onModalClose} />
    )}
    </>
  );
}
