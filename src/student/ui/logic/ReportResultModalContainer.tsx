import React, { useCallback } from 'react';
import ReportResultModalView from '../view/ReportResultModalView';
import {
  useResultManagementViewModel,
  setResultManagementViewModel,
} from 'student/store/ResultManagementStore';
import { getEmptyResultManagementViewModel } from 'student/viewModel/ResultManagementViewModel';

export default function ReportResultModalContainer() {
  const { reportModalOpen, reportFinished } = useResultManagementViewModel() || getEmptyResultManagementViewModel();

  const onModalClose = useCallback(() => {
    setResultManagementViewModel(getEmptyResultManagementViewModel());
  }, []);

  return (
    <>
      {reportFinished && (
        <ReportResultModalView modalOpen={reportModalOpen} onModalClose={onModalClose} />
      )}
    </>
  );
}
