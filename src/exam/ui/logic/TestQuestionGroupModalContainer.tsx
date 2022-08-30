import React, { useCallback } from 'react';

import {
  useTestQuestionGroupModalViewModel,
  setTestQuestionGroupModalViewModel,
} from 'exam/store/TestQuestionGroupModalStore';
import { getTestCreateFormViewModel } from 'exam/store/TestCreateFormStore';

import {
  onChangeGroupNameInModal,
  onChangeSelectQuestion,
  onClickAddGroup,
  onClickAllSelectQuestion,
  onClickOpenQuestion,
  onChangeSelectedGroupName,
  onClickUpdateForm,
  onChangeUpdateGroupName,
  onClickUpdateGroupName,
  onClickGroupInQuestions,
  onClickGroupOutQuestions,
  onClickOpenGroup,
  onChangeSelectedQuestionInGroup,
  onClickModalOk,
  onClickRemoveGroup,
} from 'exam/handler/TestQuestionGroupModalHandler';

import { TestQuestionGroupModalView } from '../view/TestQuestionGroupModalView';
import {
  getInitialTestQuestionGroupModalViewModel,
  getModalGroupByQuestionGroup,
  getModalQuestionByQuestion,
} from '../../viewmodel/TestQuestionGroupModalViewModel';

export function TestQuestionGroupModalContainer() {
  const testQuestionGroupModal = useTestQuestionGroupModalViewModel();

  const onModalClose = useCallback((close: () => void) => {
    setTestQuestionGroupModalViewModel(getInitialTestQuestionGroupModalViewModel());

    close();
  }, []);

  const onMount = () => {
    const testCreateForm = getTestCreateFormViewModel();

    if (testQuestionGroupModal === undefined || testCreateForm === undefined) return;

    const questions = testCreateForm.newQuestions.map((question) => getModalQuestionByQuestion(question));
    const groups = testCreateForm.questionSelectionConfig.questionGroups.map((group) =>
      getModalGroupByQuestionGroup(group, questions)
    );

    setTestQuestionGroupModalViewModel({
      ...testQuestionGroupModal,
      questions,
      groups,
      selectedGroupName: '',
      selectedQuestions: [],
      selectedQuestionsInGroup: [],
    });
  };

  return (
    <>
      {testQuestionGroupModal !== undefined && (
        <TestQuestionGroupModalView
          onMount={onMount}
          onOk={onClickModalOk}
          onClose={onModalClose}
          groupName={testQuestionGroupModal.groupName}
          questions={testQuestionGroupModal.questions}
          groups={testQuestionGroupModal.groups}
          selectedGroupName={testQuestionGroupModal.selectedGroupName}
          selectedQuestions={testQuestionGroupModal.selectedQuestions}
          selectedQuestionsInGroup={testQuestionGroupModal.selectedQuestionsInGroup}
          onChangeSelectQuestion={onChangeSelectQuestion}
          onChangeUpdateGroupName={onChangeUpdateGroupName}
          onChangeGroupNameInModal={onChangeGroupNameInModal}
          onChangeSelectedGroupName={onChangeSelectedGroupName}
          onChangeSelectedQuestionInGroup={onChangeSelectedQuestionInGroup}
          onClickAddGroup={onClickAddGroup}
          onClickOpenGroup={onClickOpenGroup}
          onClickUpdateForm={onClickUpdateForm}
          onClickRemoveGroup={onClickRemoveGroup}
          onClickOpenQuestion={onClickOpenQuestion}
          onClickUpdateGroupName={onClickUpdateGroupName}
          onClickGroupInQuestions={onClickGroupInQuestions}
          onClickGroupOutQuestions={onClickGroupOutQuestions}
          onClickAllSelectQuestion={onClickAllSelectQuestion}
        />
      )}
    </>
  );
}
