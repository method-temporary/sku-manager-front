import {
  getTestQuestionGroupModalViewModel,
  setTestQuestionGroupModalViewModel,
} from 'exam/store/TestQuestionGroupModalStore';
import { alert, AlertModel, confirm, ConfirmModel } from 'shared/components';
import {
  createModalGroup,
  getInitialModalGroup,
  ModalGroup,
  ModalQuestion,
} from '../viewmodel/TestQuestionGroupModalViewModel';
import { getTestCreateFormViewModel, setTestCreateFormViewModel } from 'exam/store/TestCreateFormStore';
import { getGroupsByModalGroups, getQuestionsByModalQuestions } from '../viewmodel/TestCreateFormViewModel';
import { setResultViewValues } from './TestCreateHandler';

export const onChangeGroupNameInModal = (groupName: string) => {
  //
  const testQuestionGroupModal = getTestQuestionGroupModalViewModel();

  if (testQuestionGroupModal === undefined) {
    return;
  }

  if (groupName.length > 50) {
    groupName = groupName.substring(0, 50);
  }

  setTestQuestionGroupModalViewModel({
    ...testQuestionGroupModal,
    groupName,
  });
};

export const onClickAllSelectQuestion = () => {
  const testQuestionGroupModal = getTestQuestionGroupModalViewModel();

  if (testQuestionGroupModal === undefined) {
    return;
  }

  const selectedQuestions: number[] = [];
  testQuestionGroupModal.questions.forEach((question) => {
    if (question.groupName === '') selectedQuestions.push(question.sequence);
  });

  setTestQuestionGroupModalViewModel({
    ...testQuestionGroupModal,
    selectedQuestions,
  });
};

export const onChangeSelectQuestion = (checked: boolean, sequence: number) => {
  //
  const testQuestionGroupModal = getTestQuestionGroupModalViewModel();

  if (testQuestionGroupModal === undefined) {
    return;
  }

  let selectedQuestions = testQuestionGroupModal.selectedQuestions;

  if (checked) {
    selectedQuestions.push(sequence);
  } else {
    selectedQuestions = selectedQuestions.filter((seq) => seq !== sequence);
  }

  setTestQuestionGroupModalViewModel({
    ...testQuestionGroupModal,
    selectedQuestions,
  });
};

export const onChangeSelectedGroupName = (selectedGroupName: string) => {
  //
  const testQuestionGroupModal = getTestQuestionGroupModalViewModel();

  if (testQuestionGroupModal === undefined) {
    return;
  }

  setTestQuestionGroupModalViewModel({
    ...testQuestionGroupModal,
    selectedGroupName,
  });
};

export const onChangeSelectedQuestionInGroup = (sequence: number, checked: boolean) => {
  //
  const testQuestionGroupModal = getTestQuestionGroupModalViewModel();

  if (testQuestionGroupModal === undefined) {
    return;
  }

  let selectedQuestionsInGroup = testQuestionGroupModal.selectedQuestionsInGroup;

  if (checked) {
    selectedQuestionsInGroup.push(sequence);
  } else {
    selectedQuestionsInGroup = selectedQuestionsInGroup.filter((seq) => seq !== sequence);
  }

  setTestQuestionGroupModalViewModel({
    ...testQuestionGroupModal,
    selectedQuestionsInGroup,
  });
};

export const onClickAddGroup = (groupName: string) => {
  //
  const testQuestionGroupModal = getTestQuestionGroupModalViewModel();

  if (testQuestionGroupModal === undefined) {
    return;
  }

  const groups = testQuestionGroupModal.groups;

  if (!validationGroupName(groupName, groups)) return;

  groups.push(createModalGroup(groupName));

  setTestQuestionGroupModalViewModel({
    ...testQuestionGroupModal,
    groups,
    groupName: '',
  });
};

export const onClickRemoveGroup = (groupName: string) => {
  //
  confirm(
    ConfirmModel.getCustomConfirm('삭제 안내', '해당 그룹을 삭제하시곘습니까?', false, '삭제', '취소', () => {
      const testQuestionGroupModal = getTestQuestionGroupModalViewModel();
      if (testQuestionGroupModal === undefined) {
        return;
      }

      const targetQuestions = testQuestionGroupModal.questions;
      if (targetQuestions === undefined) {
        return;
      }

      const targetGroups = testQuestionGroupModal.groups;
      if (targetGroups === undefined) {
        return;
      }

      const targetGroup = targetGroups.find((group) => group.name === groupName);

      if (targetGroup === undefined) {
        return;
      }

      const groups = targetGroups.filter((group) => group.name !== groupName);

      const questionSequences = targetGroup.questions.map((q) => q.sequence);
      const questions = targetQuestions.map((question) => {
        if (questionSequences.includes(question.sequence)) {
          question.groupName = '';
        }
        return question;
      });

      setTestQuestionGroupModalViewModel({
        ...testQuestionGroupModal,
        groups,
        questions,
      });
    })
  );
};

export const onClickOpenQuestion = (sequence: number, isOpen: boolean) => {
  //
  const testQuestionGroupModal = getTestQuestionGroupModalViewModel();

  if (testQuestionGroupModal === undefined) {
    return;
  }

  const targetQuestion = testQuestionGroupModal.questions.find((q) => q.sequence === sequence);
  if (targetQuestion === undefined) {
    return;
  }

  targetQuestion.isOpen = isOpen;

  const questions = testQuestionGroupModal.questions.map((q) => {
    if (q.sequence === sequence) {
      return targetQuestion;
    }
    return q;
  });

  setTestQuestionGroupModalViewModel({
    ...testQuestionGroupModal,
    questions,
  });
};

export const onClickUpdateForm = (groupName: string, updatable: boolean) => {
  //
  const testQuestionGroupModal = getTestQuestionGroupModalViewModel();

  if (testQuestionGroupModal === undefined) {
    return;
  }

  const targetGroup = testQuestionGroupModal.groups.find((group) => group.name === groupName);
  if (targetGroup === undefined) {
    return;
  }

  targetGroup.updatable = !updatable;

  if (!updatable) {
    targetGroup.updateName = targetGroup.name;
  }

  const groups = testQuestionGroupModal.groups.map((group) => {
    if (group.name === groupName) {
      return targetGroup;
    }
    return group;
  });

  setTestQuestionGroupModalViewModel({
    ...testQuestionGroupModal,
    groups,
  });
};

export const onChangeUpdateGroupName = (groupName: string, updateGroupName: string) => {
  //
  const testQuestionGroupModal = getTestQuestionGroupModalViewModel();

  if (testQuestionGroupModal === undefined) {
    return;
  }

  const targetGroup = testQuestionGroupModal.groups.find((group) => group.name === groupName);
  if (targetGroup === undefined) {
    return;
  }

  if (updateGroupName.length > 50) {
    updateGroupName = updateGroupName.substring(0, 50);
  }

  targetGroup.updateName = updateGroupName;

  const groups = testQuestionGroupModal.groups.map((group) => {
    if (group.name === groupName) {
      return targetGroup;
    }
    return group;
  });

  setTestQuestionGroupModalViewModel({
    ...testQuestionGroupModal,
    groups,
  });
};

export const onClickUpdateGroupName = (groupName: string, updateGroupName: string) => {
  //
  const testQuestionGroupModal = getTestQuestionGroupModalViewModel();

  if (testQuestionGroupModal === undefined) {
    return;
  }

  const targetGroups = testQuestionGroupModal.groups;

  const targetGroup = testQuestionGroupModal.groups.find((group) => group.name === groupName);
  if (targetGroup === undefined) {
    return;
  }

  if (!validationGroupName(updateGroupName, targetGroups, groupName)) return;

  const groups = testQuestionGroupModal.groups.map((group) => {
    if (group.name === groupName) {
      targetGroup.name = updateGroupName;
      targetGroup.updatable = false;
      return targetGroup;
    }
    return group;
  });

  setTestQuestionGroupModalViewModel({
    ...testQuestionGroupModal,
    groups,
  });
};

export const onClickOpenGroup = (groupName: string, isOpen: boolean) => {
  //
  const testQuestionGroupModal = getTestQuestionGroupModalViewModel();

  if (testQuestionGroupModal === undefined) {
    return;
  }

  const targetGroups = testQuestionGroupModal.groups;

  const targetGroup = testQuestionGroupModal.groups.find((group) => group.name === groupName);
  if (targetGroup === undefined) {
    return;
  }

  targetGroup.isOpen = isOpen;

  const groups = targetGroups.map((group) => {
    if (group.name === groupName) {
      return targetGroup;
    }

    return group;
  });

  setTestQuestionGroupModalViewModel({
    ...testQuestionGroupModal,
    groups,
  });
};

export const onClickGroupInQuestions = () => {
  //
  const testQuestionGroupModal = getTestQuestionGroupModalViewModel();

  if (testQuestionGroupModal === undefined) {
    return;
  }

  const selectedGroupName = testQuestionGroupModal.selectedGroupName; // 선택한 그룹 명
  const selectedQuestionSequences = testQuestionGroupModal.selectedQuestions; // 선택한 문항 Seq 목록

  if (selectedQuestionSequences.length === 0) {
    alert(AlertModel.getCustomAlert(true, '문항 미선택 안내', '그룹을 지정할 문항을 선택해 주세요.', '확인'));
    return;
  }

  if (selectedGroupName === '') {
    alert(AlertModel.getCustomAlert(true, '그룹 미선택 안내', '지정할 그룹을 선택해 주세요.', '확인'));
    return;
  }

  const targetQuestions = testQuestionGroupModal.questions;
  const targetGroups = testQuestionGroupModal.groups;

  const targetGroup = targetGroups.find((group) => group.name === selectedGroupName);

  if (targetGroup === undefined) {
    return;
  }

  const inQuestions: ModalQuestion[] = targetGroup.questions;

  const questions = targetQuestions.map((question) => {
    if (selectedQuestionSequences.includes(question.sequence)) {
      question.groupName = selectedGroupName;
      inQuestions.push(question);
    }
    return question;
  });

  targetGroup.questions = inQuestions;

  const groups = targetGroups.map((group) => {
    if (group.name === selectedGroupName) {
      return targetGroup;
    }
    return group;
  });

  setTestQuestionGroupModalViewModel({
    ...testQuestionGroupModal,
    groups,
    questions,
    selectedQuestions: [],
  });
};

export const onClickGroupOutQuestions = () => {
  //
  const testQuestionGroupModal = getTestQuestionGroupModalViewModel();

  if (testQuestionGroupModal === undefined) {
    return;
  }
  const selectedQuestionsInGroup = testQuestionGroupModal.selectedQuestionsInGroup; // 선택한 문항 Seq 목록

  if (selectedQuestionsInGroup.length === 0) {
    alert(AlertModel.getCustomAlert(true, '문항 미선택 안내', '그룹을 지정 해제할 문항을 선택해 주세요.', '확인'));
    return;
  }

  const targetQuestions = testQuestionGroupModal.questions;
  const targetGroups = testQuestionGroupModal.groups;

  const questions = targetQuestions.map((question) => {
    if (selectedQuestionsInGroup.includes(question.sequence)) {
      question.groupName = '';
    }
    return question;
  });

  const groups = targetGroups.map((group) => {
    const targetQuestions = group.questions;

    const nextQuestions: ModalQuestion[] = [];

    targetQuestions.map((question) => {
      if (!selectedQuestionsInGroup.includes(question.sequence)) {
        nextQuestions.push(question);
      }
    });

    group.questions = nextQuestions;

    return group;
  });

  setTestQuestionGroupModalViewModel({
    ...testQuestionGroupModal,
    groups,
    questions,
    selectedQuestionsInGroup: [],
  });
};

export const onClickModalOk = (close: () => void) => {
  //
  let testCreateForm = getTestCreateFormViewModel();
  const testQuestionGroupModal = getTestQuestionGroupModalViewModel();

  if (testCreateForm === undefined || testQuestionGroupModal === undefined) {
    return;
  }

  const targetQuestionsConfig = testCreateForm.questionSelectionConfig;

  if (targetQuestionsConfig === undefined) {
    return;
  }

  const questions = testQuestionGroupModal.questions;
  const groups = testQuestionGroupModal.groups;

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];

    if (question.groupName === '') {
      alert(
        AlertModel.getCustomAlert(
          true,
          '문항 그룹 미설정 안내',
          '그룹 미설정 상태인 문항이 있습니다. 미지정 문항을 우측 그룹 지정해 주세요.',
          '확인'
        )
      );
      return;
    }
  }

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];

    if (group.questions.length === 0 && group.name !== '') {
      alert(
        AlertModel.getCustomAlert(
          true,
          '빈 그룹 안내',
          '문항이 지정되지 않은 그룹이 있습니다. 그룹에 삭제 하시거나, 그룹에 문항을 1개 이상 지정해주세요.',
          '확인'
        )
      );
      return;
    }
  }

  const newQuestions = getQuestionsByModalQuestions(questions);
  const questionGroups = getGroupsByModalGroups(groups);

  targetQuestionsConfig.questionGroups = questionGroups;

  setTestCreateFormViewModel({
    ...testCreateForm,
    newQuestions,
    questionSelectionConfig: targetQuestionsConfig,
  });

  testCreateForm = getTestCreateFormViewModel();

  if (testCreateForm !== undefined) {
    const { totalPoint, successPoint, questionCount, mandatoryCount, totalQuestionCount, questionSelectionConfig } =
      setResultViewValues(testCreateForm.questionSelectionType);

    setTestCreateFormViewModel({
      ...testCreateForm,
      totalPoint,
      successPoint,
      questionCount,
      mandatoryCount,
      totalQuestionCount,
      questionSelectionConfig,
    });
  }

  close();
};

const validationGroupName = (groupName: string, groups: ModalGroup[], prevGroupName?: string) => {
  //
  if (groupName.trim() === '') {
    alert(AlertModel.getCustomAlert(true, '그룹명 미입력 안내', '한 글자 이상 그룹명을 입력하세요.', '확인'));
    return false;
  }

  if (groupName === '미지정') {
    alert(
      AlertModel.getCustomAlert(
        true,
        '그룹명 사용 불가 안내',
        '그룹명이 "미지정" 인 그룹은 생성할 수 없습니다.',
        '확인'
      )
    );
    return false;
  }

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];

    if (group.name.trim() === groupName.trim()) {
      // 수정 대상 그룹명과 새로운 그룹명이 동일할 때에는 중복체스에서 제외
      if (!prevGroupName || (prevGroupName && prevGroupName !== groupName)) {
        alert(AlertModel.getOverlapAlert('그룹명'));
        return false;
      }
    }
  }

  return true;
};
