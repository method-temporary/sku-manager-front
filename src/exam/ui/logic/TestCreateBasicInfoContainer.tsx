import React from 'react';
import { TestCreateBasicInfoView } from '../view/TestCreateBasicInfoView';
import { useTestCreateFormViewModel } from 'exam/store/TestCreateFormStore';
import { onChangeDescription, onChangeTitle, onChangeApplyLimit } from 'exam/handler/TestCreateBasicInfoHandler';

export function TestCreateBasicInfoContainer() {
  const testCreateForm = useTestCreateFormViewModel();

  return (
    <>
      {testCreateForm !== undefined && (
        <TestCreateBasicInfoView
          finalCopy={testCreateForm.finalCopy}
          title={testCreateForm.title}
          description={testCreateForm.description}
          applyLimit={testCreateForm.applyLimit}
          authorName={testCreateForm.authorName}
          email={testCreateForm.email}
          language={testCreateForm.language}
          onChangeTitle={onChangeTitle}
          onChangeDescription={onChangeDescription}
          onChangeApplyLimit={onChangeApplyLimit}
        />
      )}
    </>
  );
}
