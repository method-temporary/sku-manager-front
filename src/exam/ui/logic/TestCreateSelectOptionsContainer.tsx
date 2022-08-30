import React from 'react';
import { useTestCreateFormViewModel } from 'exam/store/TestCreateFormStore';
import { TestCreateSelectOptionsView } from '../view/TestCreateSelectOptionsView';
import {
  onChangeEnableShuffle,
  onChangePointPerQuestion,
  onChangeQuestionCount,
  onChangeQuestionSelectionType,
  onChangeSuccessPoint,
} from '../../handler/TestCreateSelectOptionsHandler';
import { TestCreateSelectionTypeView } from '../view/TestCreateSelectionTypeView';

export function TestCreateSelectOptionsContainer() {
  const testCreateForm = useTestCreateFormViewModel();

  return (
    <>
      {testCreateForm !== undefined && (
        <>
          <TestCreateSelectionTypeView
            finalCopy={testCreateForm.finalCopy}
            questionSelectionType={testCreateForm.questionSelectionType}
            onChangeQuestionSelectionType={onChangeQuestionSelectionType}
          />

          <TestCreateSelectOptionsView
            finalCopy={testCreateForm.finalCopy}
            questionSelectionType={testCreateForm.questionSelectionType}
            questionSelectionConfig={testCreateForm.questionSelectionConfig}
            successPoint={testCreateForm.successPoint}
            totalPoint={testCreateForm.totalPoint}
            questionCount={testCreateForm.questionCount}
            totalQuestionCount={testCreateForm.totalQuestionCount}
            mandatoryCount={testCreateForm.mandatoryCount}
            onChangeEnableShuffle={onChangeEnableShuffle}
            onChangeSuccessPoint={onChangeSuccessPoint}
            onChangePointPerQuestion={onChangePointPerQuestion}
            onChangeQuestionCount={onChangeQuestionCount}
          />
        </>
      )}
    </>
  );
}
