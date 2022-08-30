import { ButtonProps, DropdownProps } from 'semantic-ui-react';

import { getToktokPortletRdo } from '../../shared/util';

import { getPortletSearchBox, setPortletSearchBox } from './portletSearchBox.stores';
import { requestPortletList } from '../portletList/portletList.services';
import { getPortletListLimit, getPortletListPage } from '../portletList/portletList.stores';

export function onChangeStartDate(date: Date) {
  const portletSearchBox = getPortletSearchBox();
  if (portletSearchBox !== undefined) {
    setPortletSearchBox({
      ...portletSearchBox,
      startDate: date,
    });
  }
}

export function onChangeEndDate(date: Date) {
  const portletSearchBox = getPortletSearchBox();
  if (portletSearchBox !== undefined) {
    setPortletSearchBox({
      ...portletSearchBox,
      endDate: date,
    });
  }
}

export function onClickDate(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  const portletSearchBox = getPortletSearchBox();
  if (portletSearchBox !== undefined) {
    setPortletSearchBox({
      ...portletSearchBox,
      selectedDate: e.currentTarget.value,
    });
  }
}

export function onChangeCineroom(_: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
  const portletSearchBox = getPortletSearchBox();
  if (portletSearchBox !== undefined) {
    setPortletSearchBox({
      ...portletSearchBox,
      cineroom: data.value as string,
    });
  }
}

export function onChangeKeywordType(_: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
  const portletSearchBox = getPortletSearchBox();
  if (portletSearchBox !== undefined) {
    setPortletSearchBox({
      ...portletSearchBox,
      keywordType: data.value as string,
    });
  }
}

export function onChangekeyword(e: React.ChangeEvent<HTMLInputElement>) {
  const portletSearchBox = getPortletSearchBox();
  if (portletSearchBox !== undefined) {
    setPortletSearchBox({
      ...portletSearchBox,
      keyword: e.currentTarget.value,
    });
  }
}

export function onClickSearch(_: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) {
  const searchBox = getPortletSearchBox();
  const limit = getPortletListLimit();
  const page = getPortletListPage();
  if (searchBox === undefined || limit === undefined || page === undefined) {
    return;
  }
  const offset = (page - 1) * limit;
  const toktokPortletRdo = getToktokPortletRdo(searchBox, offset, limit);
  requestPortletList(toktokPortletRdo);
}
