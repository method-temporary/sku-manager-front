import { TextAreaProps } from 'semantic-ui-react';
import { fileUtil } from '@nara.drama/depot';

import { FileUploadType } from 'shared/model';
import { SharedApi } from 'shared/present';

import { getTestCreateFormViewModel, setTestCreateFormViewModel } from 'exam/store/TestCreateFormStore';
import { copyQuestion, createQuestion, createQuestionAnswer, Question } from 'exam/viewmodel/TestSheetViewModel';
import { QuestionType } from 'exam/model/QuestionType';

export const onAddChoice = () => {
  const testCreateForm = getTestCreateFormViewModel();
  if (testCreateForm !== undefined) {
    const nextQuestionNo = testCreateForm.newQuestions.length + 1;
    const nextNewQuestions = testCreateForm.newQuestions.concat(
      createQuestion(nextQuestionNo, QuestionType.SingleChoice)
    );

    setTestCreateFormViewModel({
      ...testCreateForm,
      newQuestions: nextNewQuestions,
    });
  }
};

export const onAddShortAnswer = () => {
  const testCreateForm = getTestCreateFormViewModel();
  if (testCreateForm !== undefined) {
    const nextQuestionNo = testCreateForm.newQuestions.length + 1;
    const nextNewQuestions = testCreateForm.newQuestions.concat(
      createQuestion(nextQuestionNo, QuestionType.ShortAnswer)
    );

    setTestCreateFormViewModel({
      ...testCreateForm,
      newQuestions: nextNewQuestions,
    });
  }
};

export const onAddEssay = () => {
  const testCreateForm = getTestCreateFormViewModel();
  if (testCreateForm !== undefined) {
    const nextQuestionNo = testCreateForm.newQuestions.length + 1;
    const nextNewQuestions = testCreateForm.newQuestions.concat(createQuestion(nextQuestionNo, QuestionType.Essay));

    setTestCreateFormViewModel({
      ...testCreateForm,
      newQuestions: nextNewQuestions,
    });
  }
};

export const onRemoveQuestion = (questionIndex: number) => {
  const testCreateForm = getTestCreateFormViewModel();
  if (testCreateForm === undefined) {
    return;
  }

  const nextQuestions = testCreateForm.newQuestions
    .filter((q, index) => index !== questionIndex)
    .map((q, index) => {
      q.sequence = index + 1;
      return q;
    });

  setTestCreateFormViewModel({
    ...testCreateForm,
    newQuestions: nextQuestions,
  });
};

export const onCopyQuestion = (question: Question) => {
  const testCreateForm = getTestCreateFormViewModel();
  if (testCreateForm === undefined) {
    return;
  }

  const newQuestions = testCreateForm.newQuestions;
  const newQuestion = copyQuestion(testCreateForm.newQuestions.length + 1, question);

  newQuestions.push(newQuestion);

  setTestCreateFormViewModel({
    ...testCreateForm,
    newQuestions,
  });
};

export const onChangeMandatory = (sequence: number, checked: boolean) => {
  const testCreateForm = getTestCreateFormViewModel();
  if (testCreateForm === undefined) {
    return;
  }
  const targetQuestion = testCreateForm.newQuestions.find((q) => q.sequence === sequence);
  if (targetQuestion === undefined) {
    return;
  }

  targetQuestion.mandatory = checked;

  const nextQuestions = testCreateForm.newQuestions.map((q) => {
    if (q.sequence === sequence) {
      return targetQuestion;
    }
    return q;
  });

  setTestCreateFormViewModel({
    ...testCreateForm,
    newQuestions: nextQuestions,
  });
};

export const onChangeGroupName = (sequence: number, groupName: string) => {
  const testCreateForm = getTestCreateFormViewModel();
  if (testCreateForm === undefined) {
    return;
  }
  const targetQuestion = testCreateForm.newQuestions.find((q) => q.sequence === sequence);
  if (targetQuestion === undefined) {
    return;
  }

  targetQuestion.groupName = groupName;

  const nextQuestions = testCreateForm.newQuestions.map((q) => {
    if (q.sequence === sequence) {
      return targetQuestion;
    }
    return q;
  });

  setTestCreateFormViewModel({
    ...testCreateForm,
    newQuestions: nextQuestions,
  });
};

export const onChangeQuestionType = (sequence: number, questionType: QuestionType) => {
  const testCreateForm = getTestCreateFormViewModel();
  if (testCreateForm === undefined) {
    return;
  }
  const targetQuestion = testCreateForm.newQuestions.find((q) => q.sequence === sequence);
  if (targetQuestion === undefined) {
    return;
  }

  const questionAnswer = createQuestionAnswer();

  targetQuestion.questionType = questionType;
  targetQuestion.questionAnswer = questionAnswer;

  const nextQuestions = testCreateForm.newQuestions.map((q) => {
    if (q.sequence === sequence) {
      return targetQuestion;
    }
    return q;
  });

  setTestCreateFormViewModel({
    ...testCreateForm,
    newQuestions: nextQuestions,
  });
};

export const onChangePoint = (sequence: number, point: string) => {
  const testCreateForm = getTestCreateFormViewModel();

  if (testCreateForm === undefined) {
    return;
  }
  const targetQuestion = testCreateForm.newQuestions.find((q) => q.sequence === sequence);
  if (targetQuestion === undefined) {
    return;
  }

  if (point.includes('.')) {
    point = point.substring(0, point.indexOf('.'));
  }

  if (point === '') {
    point = '0';
  } else if (point.startsWith('0') && point !== '0') {
    point = point.substr(1);
  }

  if (Number(point) > 999) {
    point = String(999);
  }

  targetQuestion.point = point;

  const nextQuestions = testCreateForm.newQuestions.map((q) => {
    if (q.sequence === sequence) {
      return targetQuestion;
    }
    return q;
  });

  setTestCreateFormViewModel({
    ...testCreateForm,
    newQuestions: nextQuestions,
  });
};

export const onChangeQuestion = (sequence: number, data: TextAreaProps) => {
  const testCreateForm = getTestCreateFormViewModel();

  if (testCreateForm === undefined) {
    return;
  }
  const targetQuestion = testCreateForm.newQuestions.find((q) => q.sequence === sequence);
  if (targetQuestion === undefined) {
    return;
  }

  targetQuestion.question = data.value ? data.value.toString() : '';
  const newQuestions = testCreateForm.newQuestions.map((q) => {
    if (q.sequence === sequence) {
      return targetQuestion;
    }
    return q;
  });

  setTestCreateFormViewModel({
    ...testCreateForm,
    newQuestions,
  });
};

export const onChangeDescription = (sequence: number, data: TextAreaProps) => {
  const testCreateForm = getTestCreateFormViewModel();

  if (testCreateForm === undefined) {
    return;
  }
  const targetQuestion = testCreateForm.newQuestions.find((q) => q.sequence === sequence);
  if (targetQuestion === undefined) {
    return;
  }

  targetQuestion.description = data.value ? data.value.toString() : '';
  const newQuestions = testCreateForm.newQuestions.map((q) => {
    if (q.sequence === sequence) {
      return targetQuestion;
    }
    return q;
  });

  setTestCreateFormViewModel({
    ...testCreateForm,
    newQuestions,
  });
};

export const onChangeQuestionAnswer = (sequence: number, value: string | number | undefined) => {
  const testCreateForm = getTestCreateFormViewModel();
  if (testCreateForm === undefined) {
    return;
  }

  const targetQuestion = testCreateForm.newQuestions.find((q) => q.sequence === sequence);
  if (targetQuestion === undefined) {
    return;
  }

  const targetAnswer = targetQuestion.questionAnswer;
  if (targetAnswer === undefined) {
    return;
  }

  let answer = value ? value.toString() : '';

  if (answer.length > 100) {
    answer = answer.substring(0, 100);
  }

  targetAnswer.answer = answer;

  targetQuestion.questionAnswer = targetAnswer;
  const newQuestions = testCreateForm.newQuestions.map((q) => {
    if (q.sequence === sequence) {
      return targetQuestion;
    }
    return q;
  });

  setTestCreateFormViewModel({
    ...testCreateForm,
    newQuestions,
  });
};

export const onChangeQuestionAnswerExplanation = (sequence: number, data: TextAreaProps) => {
  const testCreateForm = getTestCreateFormViewModel();
  if (testCreateForm === undefined) {
    return;
  }

  const targetQuestion = testCreateForm.newQuestions.find((q) => q.sequence === sequence);
  if (targetQuestion === undefined) {
    return;
  }

  const targetAnswer = targetQuestion.questionAnswer;
  if (targetAnswer === undefined) {
    return;
  }

  let explanation = data.value ? data.value.toString() : '';

  if (explanation.length > 2000) {
    explanation = explanation.substr(0, 2000);
  }

  targetAnswer.explanation = explanation;
  targetQuestion.questionAnswer = targetAnswer;

  const newQuestions = testCreateForm.newQuestions.map((q) => {
    if (q.sequence === sequence) {
      return targetQuestion;
    }
    return q;
  });

  setTestCreateFormViewModel({
    ...testCreateForm,
    newQuestions,
  });
};

export const onChangeQuestionImage = (sequence: number, file: File) => {
  //
  const testCreateForm = getTestCreateFormViewModel();

  if (testCreateForm === undefined) {
    return;
  }
  const targetQuestion = testCreateForm.newQuestions.find((q) => q.sequence === sequence);
  if (targetQuestion === undefined) {
    return;
  }

  if (!file || (file instanceof File && !validatedAll(file))) {
    return;
  }

  const sharedApi = SharedApi.instance;
  const formData = new FormData();
  formData.append('file', file);

  sharedApi.uploadFile(formData, FileUploadType.Exam).then((path) => {
    targetQuestion.imagePath = path;
    const nextQuestions = testCreateForm.newQuestions.map((q) => {
      if (q.sequence === sequence) {
        return targetQuestion;
      }
      return q;
    });

    setTestCreateFormViewModel({
      ...testCreateForm,
      newQuestions: nextQuestions,
    });
  });
};

export const validatedAll = (file: File) => {
  const IMG_EXTENSION = {
    IMAGE: 'jpg|png|jpeg|svg|JPG|PNG|JPEG|SVG',
  };

  const validations = [{ type: 'Extension', validValue: IMG_EXTENSION.IMAGE }] as any[];
  const hasNonPass = validations.some((validation) => {
    if (validation.validator && typeof validation.validator === 'function') {
      return !validation.validator(file);
    } else {
      if (!validation.type || !validation.validValue) {
        return false;
      }

      return !fileUtil.validate(file, [], validation.type, validation.validValue);
    }
  });

  return !hasNonPass;
};
