import { reactConfirm, reactAlert } from '@nara.platform/accent';
import { ButtonProps } from 'semantic-ui-react';
import { getCurrentHistory } from 'shared/store';
import { getPortletListPath, getPortletEditPath } from '../routePath';
import { removeToktokPortlet } from '../../../_data/arrange/toktok/api/toktokApi';

export function onClickList(_: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) {
  const currentHistory = getCurrentHistory();
  currentHistory?.push(getPortletListPath());
}

export function onClickDelete(id: string) {
  reactConfirm({
    title: 'Content 삭제',
    message: 'Content 삭제 처리 하시겠습니까?',
    onOk: () => {
      onDelete(id);
    },
  });
}

export async function onDelete(id: string) {
  const result = await removeToktokPortlet(id);
  if (result === 'success') {
    reactAlert({
      title: 'Content 삭제',
      message: 'Content 삭제 처리 완료했습니다.',
    });
    const currentHistory = getCurrentHistory();
    currentHistory?.push(getPortletListPath());
  } else {
    reactAlert({
      title: 'Content 삭제',
      message: 'Content 삭제 처리 실패했습니다. 잠시 후 다시 이용해 주세요.',
    });
  }
}

export function onClickEdit(id: string) {
  const currentHistory = getCurrentHistory();
  currentHistory?.push(getPortletEditPath(id));
}
