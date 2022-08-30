import { ButtonProps } from 'semantic-ui-react';
import { reactConfirm, reactAlert } from '@nara.platform/accent';
import { getCurrentHistory } from 'shared/store';

import { registerToktokPortlet } from '_data/arrange/toktok/api/toktokApi';

import { getEmptyField, PortletCreateForm } from './portletCreate.models';
import { getToktokPortletCdo } from '../shared/util';
import { getPortletContentItems } from '../portletContentCreate/portletContentCreate.stores';
import { getCheckedCinerooms } from '../cineroomCheckbox/cineroomCheckbox.stores';
import { getPortletListPath } from '../routePath';
import { getPortletCreateForm, setPortletCreateForm } from './portletCreate.stores';

export function onChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
  const portletCreateForm = getPortletCreateForm();
  if (portletCreateForm !== undefined) {
    setPortletCreateForm({
      ...portletCreateForm,
      title: e.currentTarget.value,
    });
  }
}

export function onChangeStartDate(date: Date) {
  const createForm = getPortletCreateForm();
  if (createForm !== undefined) {
    setPortletCreateForm({
      ...createForm,
      startDate: date,
    });
  }
}

export function onChangeEndDate(date: Date) {
  const createForm = getPortletCreateForm();
  if (createForm !== undefined) {
    setPortletCreateForm({
      ...createForm,
      endDate: date,
    });
  }
}

export function onClickSave(_: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) {
  const createForm = getPortletCreateForm();
  const checkedCinerooms = getCheckedCinerooms();
  const contentItems = getPortletContentItems();
  if (createForm === undefined || checkedCinerooms === undefined || contentItems === undefined) {
    return;
  }
  createForm.cinerooms = checkedCinerooms;
  createForm.contentItems = contentItems;

  const emptyField = getEmptyField(createForm);
  if (emptyField !== '') {
    const message = `${emptyField}은(는) 필수 입력 사항입니다.`;
    reactAlert({
      title: '필수 입력 사항',
      message,
    });
    return;
  }

  reactConfirm({
    title: 'Content 등록',
    message: 'Content 등록 처리 하시겠습니까?',
    onOk: () => onSave(createForm),
  });
}

export async function onSave(createForm: PortletCreateForm) {
  const toktokPortletCdo = getToktokPortletCdo(createForm);
  const result = await registerToktokPortlet(toktokPortletCdo);
  if (result !== undefined) {
    reactAlert({
      title: 'Content 등록',
      message: 'Content 등록 처리 완료했습니다.',
    });
    const currentHistory = getCurrentHistory();
    currentHistory?.push(getPortletListPath());
  } else {
    reactAlert({
      title: 'Content 등록',
      message: 'Content 등록 처리 실패했습니다. 잠시 후 다시 이용해 주세요.',
    });
  }
}
