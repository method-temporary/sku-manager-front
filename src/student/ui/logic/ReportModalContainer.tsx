import React, { useCallback } from 'react';
import { AlertWin } from 'shared/ui';
import {
  useResultManagementViewModel,
  getResultManagementViewModel,
  setResultManagementViewModel,
} from 'student/store/ResultManagementStore';
import { getEmptyResultManagementViewModel } from 'student/viewModel/ResultManagementViewModel';
import { useOpen } from 'exam/hooks/useOpen';
import { ReportModalView } from '../view/ReportModalView';
import { updateReport } from './useReport/utility/updateReport';

export default function ReportModalContainer() {
  const { open: alertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useOpen(false);
  const { reportModalOpen, reportFinished } = useResultManagementViewModel() || getEmptyResultManagementViewModel();

  const onModalClose = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setResultManagementViewModel(getEmptyResultManagementViewModel());
  }, []);

  const onAlertConfirm = useCallback(async (): Promise<void> => {
    await updateReport();
    onAlertClose();

    const resultManagementViewModel = getResultManagementViewModel();

    if (resultManagementViewModel !== undefined) {
      setResultManagementViewModel({
        ...resultManagementViewModel,
        reportModalOpen: false,
        reportFinished: true,
      });

      resultManagementViewModel && resultManagementViewModel.onOk && (await resultManagementViewModel.onOk());
    }
  }, [onAlertClose]);

  return (
    <>
      {reportFinished === false && (
        <ReportModalView modalOpen={reportModalOpen} onModalClose={onModalClose} onAlertOpen={onAlertOpen} />
      )}
      <AlertWin
        open={alertOpen}
        type="알림"
        title="과제 채점"
        message="과제 채점을 하시겠습니까?"
        alertIcon=""
        handleOk={onAlertConfirm}
        handleClose={onAlertClose}
      />
    </>
  );
}
