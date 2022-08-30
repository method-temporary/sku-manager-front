import { FileUploadType } from 'shared/model';
import { SharedApi } from 'shared/present';

import { getTestCreateFormViewModel, setTestCreateFormViewModel } from '../store/TestCreateFormStore';
import { changeQuestionItemNo, createQuestionItem, QuestionItem } from '../viewmodel/TestSheetViewModel';
import { QuestionType } from '../model/QuestionType';
import { validatedAll } from './TestCreateQuestionHandler';

export const onClickAddItem = (questionNo: number, itemNo: string) => {
  const testCreateForm = getTestCreateFormViewModel();
  if (testCreateForm === undefined) {
    return;
  }
  const targetQuestion = testCreateForm.newQuestions.find((q) => q.sequence === questionNo);
  if (targetQuestion === undefined) {
    return;
  }

  const targetQuestionAnswer = targetQuestion.questionAnswer;
  const targetAnswer = targetQuestionAnswer.answer;

  const targetItems = targetQuestion.items;

  const items: QuestionItem[] = [];

  targetItems.forEach((item) => {
    // 추가 생성 버튼을 누른 item 번호보다 작거나 같으면 이전과 동일하게
    if (Number(item.itemNo) <= Number(itemNo)) {
      items.push(item);
    }

    // 추가 생성 버튼을 누른 item 번호와 동일하면 새로 생성할 item 추가
    if (Number(item.itemNo) === Number(itemNo)) {
      items.push(createQuestionItem(String(Number(item.itemNo) + 1)));
    }

    // 추가 생성 버튼을 누른 item 번호보다 크면 itemNo + 1
    if (Number(item.itemNo) > Number(itemNo)) {
      items.push(changeQuestionItemNo(String(Number(item.itemNo) + 1), item));
    }
  });

  let answer = '';
  targetAnswer.split(',').forEach((prevAnswer, index) => {
    if (prevAnswer !== '') {
      if (Number(prevAnswer) > Number(itemNo)) {
        answer += answer !== '' ? `,${String(Number(prevAnswer) + 1)}` : String(Number(prevAnswer) + 1);
      } else {
        answer += answer !== '' ? `,${prevAnswer}` : prevAnswer;
      }
    }
  });

  targetQuestion.items = items;
  targetQuestionAnswer.answer = answer;
  targetQuestion.questionAnswer = targetQuestionAnswer;

  const newQuestions = testCreateForm.newQuestions.map((q) => {
    if (q.sequence === targetQuestion.sequence) {
      return targetQuestion;
    }
    return q;
  });

  setTestCreateFormViewModel({
    ...testCreateForm,
    newQuestions,
  });
};

export const onClickRemoveItem = (questionNo: number, itemNo: string) => {
  const testCreateForm = getTestCreateFormViewModel();
  if (testCreateForm === undefined) {
    return;
  }
  const targetQuestion = testCreateForm.newQuestions.find((q) => q.sequence === questionNo);
  if (targetQuestion === undefined) {
    return;
  }

  const targetQuestionAnswer = targetQuestion.questionAnswer;
  const targetAnswer = targetQuestionAnswer.answer;

  const newItems = targetQuestion.items.filter((item) => item.itemNo !== itemNo);

  // key: 변경 후 itemNo, value: 변경전 itemNo
  const itemNoMap = new Map<string, string>();
  const items = newItems.map((item, index) => {
    itemNoMap.set(String(index + 1), item.itemNo);
    return changeQuestionItemNo(String(index + 1), item);
  });

  let answer = '';
  targetAnswer.split(',').forEach((prevAnswer, index) => {
    if (prevAnswer !== '') {
      if (Number(prevAnswer) > Number(itemNo)) {
        answer += answer !== '' ? `,${String(Number(prevAnswer) - 1)}` : String(Number(prevAnswer) - 1);
      } else if (Number(prevAnswer) < Number(itemNo)) {
        if (index !== 0) answer += ',';
        answer += answer !== '' ? `,${prevAnswer}` : prevAnswer;
      }
    }
  });

  targetQuestion.items = items;
  targetQuestionAnswer.answer = answer;
  targetQuestion.questionAnswer = targetQuestionAnswer;

  const newQuestions = testCreateForm.newQuestions.map((q) => {
    if (q.sequence === targetQuestion.sequence) {
      return targetQuestion;
    }
    return q;
  });

  setTestCreateFormViewModel({
    ...testCreateForm,
    newQuestions,
  });
};

export const onChangeChoiceAnswer = (
  questionType: QuestionType,
  questionNo: number,
  itemNo: string,
  checked?: boolean
) => {
  const testCreateForm = getTestCreateFormViewModel();

  if (testCreateForm === undefined) {
    return;
  }
  const targetQuestion = testCreateForm.newQuestions.find((q) => q.sequence === questionNo);
  if (targetQuestion === undefined) {
    return;
  }

  const targetAnswer = targetQuestion.questionAnswer;
  if (targetAnswer === undefined) {
    return;
  }

  if (questionType === QuestionType.SingleChoice) {
    targetAnswer.answer = itemNo;
  } else if (questionType === QuestionType.MultiChoice) {
    const prevAnswer = targetAnswer.answer;

    // 처음 정답을 Check 하는 경우는 아무런 작업 없이 값 넣어줌
    if (prevAnswer === '') {
      targetAnswer.answer = itemNo;
    } else {
      const answerArray: number[] = [];

      if (checked) {
        // 체크
        // 기존 정답 Number Array 로 변환
        targetAnswer.answer.split(',').map((str) => answerArray.push(Number(str)));

        // 새로운 답 추가
        answerArray.push(Number(itemNo));

        // 답 Sorting
        answerArray.sort((a, b) => a - b);
      } else {
        // 체크 해제

        // 기존 답에서 선택된 값 제외한 나머지 Array 로 변환
        targetAnswer.answer
          .split(',')
          .filter((str) => str !== itemNo)
          .map((str) => answerArray.push(Number(str)));
      }

      let answer: string = '';

      // 답이 들어 있는 Number Array 를 string 로 변환 ( 구분자 : ',' )
      answerArray.map((num, index) => {
        if (index === 0) {
          answer = String(num);
        } else {
          answer += `,${String(num)}`;
        }
      });
      targetAnswer.answer = answer;
    }
  }

  targetQuestion.questionAnswer = targetAnswer;

  const newQuestions = testCreateForm.newQuestions.map((q) => {
    if (q.sequence === questionNo) {
      return targetQuestion;
    }
    return q;
  });

  setTestCreateFormViewModel({
    ...testCreateForm,
    newQuestions,
  });
};

export const onChangeItemText = (e: any, questionNo: number, itemNo: string) => {
  const testCreateForm = getTestCreateFormViewModel();
  if (testCreateForm === undefined) {
    return;
  }
  const targetQuestion = testCreateForm.newQuestions.find((q) => q.sequence === questionNo);
  if (targetQuestion === undefined) {
    return;
  }
  const targetItem = targetQuestion.items.find((i) => i.itemNo === itemNo);
  if (targetItem === undefined) {
    return;
  }
  targetItem.itemText = e.currentTarget.value;
  const nextItems = targetQuestion.items.map((i) => {
    if (i.itemNo === itemNo) {
      return targetItem;
    }
    return i;
  });
  targetQuestion.items = nextItems;

  const nextQuestions = testCreateForm.newQuestions.map((q) => {
    if (q.sequence === targetQuestion.sequence) {
      return targetQuestion;
    }
    return q;
  });

  setTestCreateFormViewModel({
    ...testCreateForm,
    newQuestions: nextQuestions,
  });
};

export const onChangeItemImage = (questionNo: number, itemNo: string, file: File) => {
  const testCreateForm = getTestCreateFormViewModel();
  if (testCreateForm === undefined) {
    return;
  }
  const targetQuestion = testCreateForm.newQuestions.find((q) => q.sequence === questionNo);
  if (targetQuestion === undefined) {
    return;
  }
  const targetItem = targetQuestion.items.find((i) => i.itemNo === itemNo);
  if (targetItem === undefined) {
    return;
  }

  if (!file || (file instanceof File && !validatedAll(file))) {
    return;
  }

  const sharedApi = SharedApi.instance;
  const formData = new FormData();
  formData.append('file', file);

  sharedApi.uploadFile(formData, FileUploadType.Exam).then((path) => {
    targetItem.imgSrc = path;
    const nextItems = targetQuestion.items.map((i) => {
      if (i.itemNo === itemNo) {
        return targetItem;
      }
      return i;
    });

    targetQuestion.items = nextItems;

    const nextQuestions = testCreateForm.newQuestions.map((q) => {
      if (q.sequence === targetQuestion.sequence) {
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
