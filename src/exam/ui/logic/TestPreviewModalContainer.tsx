import { setTestPreviewModalViewModel, useTestPreviewModalViewModel } from 'exam/store/TestPreviewModalStore';
import React, { useCallback } from 'react';
import { TestPreviewModalView } from '../view/TestPreviewModalView';

export function TestPreviewModalContainer() {
  const testPreviewModal = useTestPreviewModalViewModel();

  const onModalClose = useCallback(() => {
    setTestPreviewModalViewModel({
      isOpen: false,
    });
  }, []);

  return (
    <>
      {testPreviewModal !== undefined && (
        <TestPreviewModalView isOpen={testPreviewModal.isOpen} onClose={onModalClose} />
      )}
    </>
  );
}
