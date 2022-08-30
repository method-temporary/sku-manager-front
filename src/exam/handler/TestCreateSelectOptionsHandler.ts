import { alert, AlertModel } from 'shared/components';
import { getTestCreateFormViewModel, setTestCreateFormViewModel } from 'exam/store/TestCreateFormStore';
import { QuestionSelectionType } from '../model/QuestionSelectionType';
import { setResultViewValues } from './TestCreateHandler';

export const onChangeQuestionSelectionType = (value: string | number | undefined) => {
  const testCreateForm = getTestCreateFormViewModel();
  if (testCreateForm !== undefined) {
    let questionSelectionType = QuestionSelectionType.ALL;

    if (value === QuestionSelectionType.BY_GROUP) {
      questionSelectionType = QuestionSelectionType.BY_GROUP;
    } else if (value === QuestionSelectionType.FIXED_COUNT) {
      questionSelectionType = QuestionSelectionType.FIXED_COUNT;
    }

    const {
      totalPoint,
      successPoint,
      questionCount,
      mandatoryCount,
      totalQuestionCount,
      questionSelectionConfig,
    } = setResultViewValues(questionSelectionType);

    setTestCreateFormViewModel({
      ...testCreateForm,
      totalPoint,
      successPoint,
      questionCount,
      mandatoryCount,
      totalQuestionCount,
      questionSelectionType,
      questionSelectionConfig,
    });
  }
};

export const onChangeEnableShuffle = (checked: boolean) => {
  const testCreateForm = getTestCreateFormViewModel();
  if (testCreateForm !== undefined) {
    const newQuestionSelectionConfig = testCreateForm.questionSelectionConfig;

    newQuestionSelectionConfig.enableShuffle = checked;

    setTestCreateFormViewModel({
      ...testCreateForm,
      questionSelectionConfig: newQuestionSelectionConfig,
    });
  }
};

export const onChangeSuccessPoint = (successPoint: string) => {
  const testCreateForm = getTestCreateFormViewModel();

  if (testCreateForm !== undefined) {
    if (successPoint.includes('.')) {
      successPoint = successPoint.substring(0, successPoint.indexOf('.'));
    }

    if (Number(successPoint) > testCreateForm.totalPoint) {
      alert(AlertModel.getCustomAlert(false, '합격점 안내', '합격점은 총점을 초과하여 설정할 수 없습니다.', '확인'));
      return;
    }

    if (successPoint === '') {
      successPoint = '0';
    } else if (successPoint.startsWith('0') && successPoint !== '0') {
      successPoint = successPoint.substr(1);
    }

    setTestCreateFormViewModel({
      ...testCreateForm,
      successPoint,
    });
  }
};

export const onChangePointPerQuestion = (pointPerQuestion: string) => {
  const testCreateForm = getTestCreateFormViewModel();

  if (testCreateForm !== undefined) {
    const questionSelectionConfig = testCreateForm.questionSelectionConfig;

    if (pointPerQuestion.includes('.')) {
      pointPerQuestion = pointPerQuestion.substring(0, pointPerQuestion.indexOf('.'));
    }

    if (pointPerQuestion === '') {
      pointPerQuestion = '0';
    } else if (Number(pointPerQuestion) > 100) {
      pointPerQuestion = '100';
    } else if (pointPerQuestion.startsWith('0') && pointPerQuestion !== '0') {
      pointPerQuestion = pointPerQuestion.substr(1);
    }

    questionSelectionConfig.pointPerQuestion = pointPerQuestion;

    // 총점 변경
    const totalPoint = Number(questionSelectionConfig.pointPerQuestion) * Number(questionSelectionConfig.questionCount);

    setTestCreateFormViewModel({
      ...testCreateForm,
      totalPoint,
      questionSelectionConfig,
    });
  }
};

export const onChangeQuestionCount = (questionCount: string) => {
  const testCreateForm = getTestCreateFormViewModel();

  if (testCreateForm !== undefined) {
    const questionSelectionConfig = testCreateForm.questionSelectionConfig;

    if (questionCount.includes('.')) {
      questionCount = questionCount.substring(0, questionCount.indexOf('.'));
    }
    // 출제 문항 수 빈값이면 0으로 변환
    if (questionCount === '') {
      questionCount = '0';
    } else if (questionCount.startsWith('0') && questionCount !== '0') {
      // 0으로 시작하는 값이면 0 제거
      questionCount = questionCount.substr(1);
    }

    questionSelectionConfig.questionCount = questionCount;

    // 총점 변경
    let totalPoint = 0;
    if (Number(questionSelectionConfig.questionCount) > testCreateForm.newQuestions.length) {
      totalPoint = Number(questionSelectionConfig.pointPerQuestion) * testCreateForm.newQuestions.length;
    } else if (Number(questionSelectionConfig.questionCount) < testCreateForm.mandatoryCount) {
      totalPoint = Number(questionSelectionConfig.pointPerQuestion) * testCreateForm.mandatoryCount;
    } else {
      totalPoint = Number(questionSelectionConfig.pointPerQuestion) * Number(questionSelectionConfig.questionCount);
    }

    setTestCreateFormViewModel({
      ...testCreateForm,
      totalPoint,
      questionCount: Number(questionCount),
      questionSelectionConfig,
    });
  }
};

export const onBlurQuestionCount = (questionCount: string) => {
  const testCreateForm = getTestCreateFormViewModel();

  if (testCreateForm !== undefined) {
    const questionSelectionConfig = testCreateForm.questionSelectionConfig;

    const totalQuestionCount = testCreateForm.totalQuestionCount;
    const mandatoryCount = testCreateForm.mandatoryCount;

    // 출제 문항 수 < 필수 문항 수 --> 출제문항수 = 필수 문항 수
    if (Number(questionCount) < Number(mandatoryCount)) {
      questionCount = mandatoryCount.toString();
    }

    // 출제 문항 수가 문항 수 보다 많으면 문항 수 값으로 변경
    if (Number(questionCount) > totalQuestionCount) {
      questionCount = String(totalQuestionCount);
    }

    questionSelectionConfig.questionCount = questionCount;

    // 총점 변경
    const totalPoint = Number(questionSelectionConfig.pointPerQuestion) * Number(questionSelectionConfig.questionCount);

    setTestCreateFormViewModel({
      ...testCreateForm,
      totalPoint,
      questionCount: Number(questionCount),
      questionSelectionConfig,
    });
  }
};

export const onChangeGroupPointPerQuestion = (groupName: string, pointPerQuestion: string) => {
  //
  const testCreateForm = getTestCreateFormViewModel();

  if (testCreateForm === undefined) {
    return;
  }

  const questionSelectionConfig = testCreateForm.questionSelectionConfig;
  if (questionSelectionConfig === undefined) {
    return;
  }

  let totalPoint = 0;
  const groups = questionSelectionConfig.questionGroups;

  const targetGroup = groups.find((group) => group.name === groupName);
  if (targetGroup === undefined) {
    return;
  }

  if (pointPerQuestion.includes('.')) {
    pointPerQuestion = pointPerQuestion.substring(0, pointPerQuestion.indexOf('.'));
  }

  if (pointPerQuestion === '') {
    pointPerQuestion = '0';
  } else if (Number(pointPerQuestion) > 100) {
    pointPerQuestion = '100';
  } else if (pointPerQuestion.startsWith('0') && pointPerQuestion !== '0') {
    pointPerQuestion = pointPerQuestion.substr(1);
  }

  targetGroup.pointPerGroup = pointPerQuestion;

  const questionGroups = groups.map((group) => {
    if (group.name === groupName) {
      totalPoint += Number(targetGroup.pointPerGroup) * Number(targetGroup.questionCount);
      return targetGroup;
    } else {
      totalPoint += Number(group.pointPerGroup) * Number(group.questionCount);
      return group;
    }
  });

  questionSelectionConfig.questionGroups = questionGroups;

  setTestCreateFormViewModel({
    ...testCreateForm,
    questionSelectionConfig,
    totalPoint,
  });
};

export const onChangeGroupQuestionCount = (groupName: string, groupQuestionCount: string) => {
  //
  const testCreateForm = getTestCreateFormViewModel();

  if (testCreateForm === undefined) {
    return;
  }

  const questionSelectionConfig = testCreateForm.questionSelectionConfig;
  if (questionSelectionConfig === undefined) {
    return;
  }

  let totalPoint = 0;
  let questionCount = 0;

  const groups = questionSelectionConfig.questionGroups;

  const targetGroup = groups.find((group) => group.name === groupName);
  if (targetGroup === undefined) {
    return;
  }

  if (groupQuestionCount.includes('.')) {
    groupQuestionCount = groupQuestionCount.substring(0, groupQuestionCount.indexOf('.'));
  }

  // 출제 문항 수 빈값이면 0으로 변환
  if (groupQuestionCount === '') {
    groupQuestionCount = '0';
  } else if (groupQuestionCount.startsWith('0') && groupQuestionCount !== '0') {
    // 0으로 시작하는 값이면 0 제거
    groupQuestionCount = groupQuestionCount.substr(1);
  }

  targetGroup.questionCount = groupQuestionCount;

  const questionGroups = groups.map((group) => {
    if (group.name === groupName) {
      if (Number(targetGroup.questionCount) > targetGroup.totalQuestionCount) {
        questionCount += Number(targetGroup.totalQuestionCount);
        totalPoint += Number(targetGroup.pointPerGroup) * Number(targetGroup.totalQuestionCount);
      } else if (Number(targetGroup.questionCount) < targetGroup.mandatoryCount) {
        questionCount += Number(targetGroup.mandatoryCount);
        totalPoint += Number(targetGroup.pointPerGroup) * Number(targetGroup.mandatoryCount);
      } else {
        questionCount += Number(targetGroup.questionCount);
        totalPoint += Number(targetGroup.pointPerGroup) * Number(targetGroup.questionCount);
      }

      return targetGroup;
    } else {
      totalPoint += Number(group.pointPerGroup) * Number(group.questionCount);
      questionCount += Number(group.questionCount);

      return group;
    }
  });

  questionSelectionConfig.questionGroups = questionGroups;

  setTestCreateFormViewModel({
    ...testCreateForm,
    questionSelectionConfig,
    totalPoint,
    questionCount,
  });
};

export const onBlurGroupQuestionCount = (groupName: string, groupQuestionCount: string) => {
  //
  const testCreateForm = getTestCreateFormViewModel();

  if (testCreateForm === undefined) {
    return;
  }

  const questionSelectionConfig = testCreateForm.questionSelectionConfig;
  if (questionSelectionConfig === undefined) {
    return;
  }

  let totalPoint = 0;
  let questionCount = 0;

  const groups = questionSelectionConfig.questionGroups;

  const targetGroup = groups.find((group) => group.name === groupName);
  if (targetGroup === undefined) {
    return;
  }

  // 출제 문항 수 < 필수 문항 수 --> 출제문항수 = 필수 문항 수
  if (Number(groupQuestionCount) < targetGroup.mandatoryCount) {
    groupQuestionCount = String(targetGroup.mandatoryCount);
  }

  const groupTotalQuestionCount = targetGroup.totalQuestionCount;
  // 출제 문항 수 > 총 문항 수 --> 출제 문항 수 = 총 문항 수
  if (Number(groupQuestionCount) > groupTotalQuestionCount) {
    // 0으로 시작하는 값이면 0 제거
    groupQuestionCount = String(groupTotalQuestionCount);
  }

  targetGroup.questionCount = groupQuestionCount;

  const questionGroups = groups.map((group) => {
    if (group.name === groupName) {
      totalPoint += Number(targetGroup.pointPerGroup) * Number(targetGroup.questionCount);
      questionCount += Number(targetGroup.questionCount);

      return targetGroup;
    } else {
      totalPoint += Number(group.pointPerGroup) * Number(group.questionCount);
      questionCount += Number(group.questionCount);

      return group;
    }
  });

  questionSelectionConfig.questionGroups = questionGroups;

  setTestCreateFormViewModel({
    ...testCreateForm,
    questionSelectionConfig,
    totalPoint,
    questionCount,
  });
};
