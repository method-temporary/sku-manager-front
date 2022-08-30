import { ButtonProps, DropdownProps } from 'semantic-ui-react';
import { getCurrentHistory } from 'shared/store';
import { getTestCreatePath } from 'exam/routePath';
import { setTestListLimit } from 'exam/store/TestListLimitStore';
import { setTestListPage } from 'exam/store/TestListPageStore';

export const onChangeLimit = (_: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
  setTestListLimit(data.value as number);
  setTestListPage(1);
};

export const onClickCreate = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => {
  const currentHistory = getCurrentHistory();
  currentHistory?.push(getTestCreatePath());
};
