import { ButtonProps } from 'semantic-ui-react';
import { reactAlert, reactConfirm } from '@nara.platform/accent';
import { getCurrentHistory } from 'shared/store';
import { getTestEditPath, getTestListPath } from 'exam/routePath';
import { removeTest } from 'exam/service/removeTest';

export const onClickModify = (testId: string) => {
  const currentHistory = getCurrentHistory();
  currentHistory?.push(getTestEditPath(testId));
};

export const onClickDelete = (testId: string) => {
  reactConfirm({
    title: '안내',
    message: '작성한 Test를 삭제하겠습니까?',
    onOk: () => onRemoveTest(testId),
  });
};

export const onRemoveTest = async (testId: string) => {
  const result = await removeTest(testId);
  if (result === 'success') {
    reactAlert({
      title: '안내',
      message: '시험지 삭제 성공했습니다',
      onClose: () => {
        const history = getCurrentHistory();
        history?.push(getTestListPath());
      },
    });
  } else {
    reactAlert({
      title: '안내',
      message: '시험지 삭제 실패했습니다',
    });
  }
};

export const onClickList = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => {
  const currentHistory = getCurrentHistory();
  currentHistory?.push(getTestListPath());
};
