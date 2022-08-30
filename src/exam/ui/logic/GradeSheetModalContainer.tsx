import React, { useCallback } from 'react';
import { AlertWin } from 'shared/ui';
import {
  setResultManagementViewModel,
  useResultManagementViewModel,
  getResultManagementViewModel,
} from 'student/store/ResultManagementStore';
import { getEmptyResultManagementViewModel } from 'student/viewModel/ResultManagementViewModel';
import { useOpen } from 'exam/hooks/useOpen';
import { useRequestGradeSheet } from 'exam/hooks/useRequestGradeSheet';
import { updateGradeSheetAndLearningState } from 'exam/service/updateGradeSheet';
import { GradeSheetModalView } from '../view/gradesheet/GradeSheetModalView';

export default function GradeSheetModalContainer() {
  useRequestGradeSheet();
  const { open: alertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useOpen(false);
  const { gradeModalOpen, gradeFinished } = useResultManagementViewModel() || getEmptyResultManagementViewModel();

  const onModalClose = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setResultManagementViewModel(getEmptyResultManagementViewModel());
  }, []);

  const onAlertConfirm = useCallback(async (): Promise<void> => {
    const result = await updateGradeSheetAndLearningState();
    
    if (result === 'success') {
      onAlertClose();

      const resultManagementViewModel = getResultManagementViewModel();

      if (resultManagementViewModel !== undefined) {
        setResultManagementViewModel({
          ...resultManagementViewModel,
          gradeModalOpen: false,
          gradeFinished: true,
        });
      }

      setTimeout(async () => {
        resultManagementViewModel && resultManagementViewModel.onOk && (await resultManagementViewModel.onOk());
      }, 300)      
    }
  }, [onAlertClose]);

  return (
    <>
      {!gradeFinished && (
        <GradeSheetModalView modalOpen={gradeModalOpen} onModalClose={onModalClose} onAlertOpen={onAlertOpen} />
      )}
      <AlertWin
        open={alertOpen}
        type="알림"
        title="시험 채점"
        message="시험 채점을 하시겠습니까?"
        handleOk={onAlertConfirm}
        handleClose={onAlertClose}
      />
    </>
  );
}
