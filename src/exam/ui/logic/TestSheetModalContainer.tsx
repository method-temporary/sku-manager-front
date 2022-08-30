import { setTestSheetModalViewModel, useTestSheetModalViewModel } from "exam/store/TestSheetModalStore";
import { getInitialTestSheetModalViewModel } from "exam/viewmodel/TestSheetModalViewModel";
import React, { useCallback } from "react";
import { TestSheetModalView } from "../view/TestSheetModalView";

export function TestSheetModalContainer() {
  const testSheetModal = useTestSheetModalViewModel();

  const onModalClose = useCallback(() => {
    setTestSheetModalViewModel(getInitialTestSheetModalViewModel());
  }, []);

  return (
    <>
      {testSheetModal !== undefined && (
        <TestSheetModalView
          isOpen={testSheetModal.isOpen}
          onClose={onModalClose}
        />
      )}
    </>
  );
}