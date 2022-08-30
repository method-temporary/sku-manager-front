import { DropdownProps } from 'semantic-ui-react';
import { getCurrentHistory } from 'shared/store';
import { getPortletCreatePath, getPortletDetailPath } from 'arrange/toktok/routePath';
import { setPortletListLimit } from './portletList.stores';

export function onChangeLimit(_: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
  setPortletListLimit(data.value as number);
}

export function onClickCreate() {
  const currentHistory = getCurrentHistory();
  currentHistory?.push(getPortletCreatePath());
}

export function onClickItem(id: string) {
  const currentHistory = getCurrentHistory();
  currentHistory?.push(getPortletDetailPath(id));
}
