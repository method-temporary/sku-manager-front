import { ButtonProps, InputOnChangeData } from 'semantic-ui-react';
import { getTestCopyFormViewModel, setTestCopyFormViewModel } from 'exam/store/TestCopyFormStore';
import { reactAlert, reactConfirm } from '@nara.platform/accent';
import { getTestListPage, setTestListPage } from 'exam/store/TestListPageStore';
import { copyExamPaper } from 'exam/api/examApi';
import { CopyExamPaperUdo } from 'exam/model/sdo/CopyExamPaperUdo';
import { requestTestList } from 'exam/service/requestTestList';
import { getTestListLimit } from 'exam/store/TestListLimitStore';
import { TestCopyFormViewModel } from 'exam/viewmodel/TestCopyFormViewModel';

export const onCopyTestModalClose = () => {
  const testCopyFormViewModel = getTestCopyFormViewModel();
  if (testCopyFormViewModel !== undefined) {
    setTestCopyFormViewModel({
      ...testCopyFormViewModel,
      isOpen: false,
    });
  }
};

export const onClickTestCopyCineroomIds = (data: string) => {
  const testCopyFormViewModel = getTestCopyFormViewModel();
  const prev = testCopyFormViewModel?.cineroomIds || [];
  let next: string[];

  if (prev.includes(data)) {
    next = prev.filter((item) => item !== data);
  } else {
    next = [...prev, data];
  }

  if (testCopyFormViewModel !== undefined) {
    setTestCopyFormViewModel({
      ...testCopyFormViewModel,
      cineroomIds: next,
    });
  }
};

export const onChangeNewTitle = (_: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
  const testCopyFormViewModel = getTestCopyFormViewModel();
  if (testCopyFormViewModel !== undefined) {
    setTestCopyFormViewModel({
      ...testCopyFormViewModel,
      newTitle: data.value,
    });
  }
};

export const onOkCopy = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => {
  const testCopyFormViewModel = getTestCopyFormViewModel();
  if (testCopyFormViewModel === undefined) {
    return;
  }

  const isValid = isValidCopyForm(testCopyFormViewModel);
  if (isValid) {
    reactConfirm({
      title: '안내',
      message: '시험지 복사를 하시겠습니까?',
      onOk: onCopy,
    });
  } else {
    reactAlert({
      title: '안내',
      message: '시험지 이름을 작성해 주세요.',
    });
  }
};

export const onCopy = async () => {
  const testCopyFormViewModel = getTestCopyFormViewModel();
  if (testCopyFormViewModel === undefined) {
    return;
  }

  const copyExamPaperUdo: CopyExamPaperUdo = {
    title: testCopyFormViewModel.newTitle,
    authorName: JSON.parse(localStorage.getItem('nara.displayName') || '')?.ko || '',
    cineroomIds: testCopyFormViewModel.cineroomIds,
  };

  const result = await copyExamPaper(testCopyFormViewModel.id, copyExamPaperUdo);
  if (result !== undefined) {
    reactAlert({
      title: '안내',
      message: '시험지 복사 성공했습니다',
    });
    const testListPage = getTestListPage();
    const testListLimit = getTestListLimit();
    if (testListPage === undefined || testListLimit === undefined) {
      return;
    }
    if (testListPage === 1) {
      requestTestList(0, testListLimit);
    } else {
      setTestListPage(1);
    }

    setTestCopyFormViewModel({
      ...testCopyFormViewModel,
      isOpen: false,
    });
  }
};

export const isValidCopyForm = (testCopyFormViewModel: TestCopyFormViewModel): boolean => {
  const { newTitle } = testCopyFormViewModel;
  if (newTitle.length === 0) {
    return false;
  }
  return true;
};
