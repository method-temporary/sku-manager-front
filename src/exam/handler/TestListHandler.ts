import { getCurrentHistory } from 'shared/store';
import { getTestDetailPath, getTestEditPath } from 'exam/routePath';
import { setTestCopyFormViewModel } from 'exam/store/TestCopyFormStore';
import { TestListItem } from 'exam/viewmodel/TestListViewModel';

export const onClickTestDetail = (testId: string, isFinalVersion: boolean) => {
  const currentHistory = getCurrentHistory();
  if (isFinalVersion === true) {
    currentHistory?.push(getTestDetailPath(testId));
  } else {
    currentHistory?.push(getTestEditPath(testId));
  }
};

export const onClickCopyTest = (testItem: TestListItem) => {
  setTestCopyFormViewModel({
    isOpen: true,
    newTitle: '',
    id: testItem.id,
    title: testItem.title,
    creatorName: testItem.creatorName,
    cineroomIds: testItem?.cineroomIds || [],
  });
};
