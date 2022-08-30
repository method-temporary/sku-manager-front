import React from 'react';
import ReportModalContainer from 'student/ui/logic/ReportModalContainer';
import ReportResultModalContainer from 'student/ui/logic/ReportResultModalContainer';
import { useResultManagementViewModel } from 'student/store/ResultManagementStore';
import { getEmptyResultManagementViewModel } from 'student/viewModel/ResultManagementViewModel';
import GradeSheetResultModalContainer from 'exam/ui/logic/GradeSheetResultModalContainer';
import GradeSheetModalContainer from 'exam/ui/logic/GradeSheetModalContainer';

export function ResultManagementModalContainer() {
  const { gradeModalOpen, gradeFinished, reportModalOpen, reportFinished } =
    useResultManagementViewModel() || getEmptyResultManagementViewModel();

  return (
    <>
      {gradeModalOpen && (
        <>
          {gradeFinished && <GradeSheetResultModalContainer />}
          {!gradeFinished && <GradeSheetModalContainer />}
        </>
      )}
      {reportModalOpen && (
        <>
          {reportFinished && <ReportResultModalContainer />}
          {!reportFinished && <ReportModalContainer />}
        </>
      )}
    </>
  );
}
