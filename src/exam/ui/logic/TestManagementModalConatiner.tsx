import React from 'react';
import { Modal } from 'semantic-ui-react';
import { onOkCopy, onCopyTestModalClose, onChangeNewTitle } from 'exam/handler/TestModalHandler';
import { useTestCopyFormViewModel } from 'exam/store/TestCopyFormStore';
import { TestCopyModalView } from '../view/TestCopyModalView';
import { UserWorkspaceService } from 'userworkspace';
import { mySUNIFirst } from 'shared/hooks';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

export function TestManagementModalContainer() {
  const testCopyFormViewModel = useTestCopyFormViewModel();
  let workspaces: { key: string; value: string; text: string }[] = [];
  if (UserWorkspaceService) {
    const { allUserWorkspaces } = UserWorkspaceService.instance;
    workspaces = allUserWorkspaces.sort(mySUNIFirst).map((workspace) => {
      return {
        key: workspace.id,
        value: workspace.id,
        text: getPolyglotToAnyString(workspace.name),
      };
    });
  }

  return (
    <>
      {testCopyFormViewModel !== undefined && (
        <Modal className="base w1000 inner-scroll" open={testCopyFormViewModel.isOpen} onClose={onCopyTestModalClose}>
          <TestCopyModalView
            title={testCopyFormViewModel.title}
            creatorName={testCopyFormViewModel.creatorName}
            onChangeTitle={onChangeNewTitle}
            onClose={onCopyTestModalClose}
            onOk={onOkCopy}
            workspaces={workspaces}
          />
        </Modal>
      )}
    </>
  );
}
