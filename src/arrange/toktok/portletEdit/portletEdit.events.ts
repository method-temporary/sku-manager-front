import { getCurrentHistory } from 'shared/store';

import { reactConfirm, reactAlert } from '@nara.platform/accent';

import { modifyToktokPortlet } from '_data/arrange/toktok/api/toktokApi';

import { getToktokPortletUdo } from '../shared/util';
import { getCheckedCinerooms } from '../cineroomCheckbox/cineroomCheckbox.stores';
import { getPortletContentItems } from '../portletContentCreate/portletContentCreate.stores';
import { getPortletDetailPath } from '../routePath';
import { getPortletEditForm, setPortletEditForm } from './portletEdit.stores';
import { getEmptyField, PortletEditForm } from './portletEdit.models';

export function onChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
  const editForm = getPortletEditForm();
  if (editForm !== undefined) {
    setPortletEditForm({
      ...editForm,
      title: e.currentTarget.value,
    });
  }
}

export function onChangeStartDate(date: Date) {
  const editForm = getPortletEditForm();
  if (editForm !== undefined) {
    setPortletEditForm({
      ...editForm,
      startDate: date,
    });
  }
}

export function onChangeEndDate(date: Date) {
  const editForm = getPortletEditForm();
  if (editForm !== undefined) {
    setPortletEditForm({
      ...editForm,
      endDate: date,
    });
  }
}

export function onClickEdit(portletId: string) {
  const editForm = getPortletEditForm();
  const checkedCinerooms = getCheckedCinerooms();
  const contentItems = getPortletContentItems();
  if (editForm === undefined || checkedCinerooms === undefined || contentItems === undefined) {
    return;
  }

  editForm.cinerooms = checkedCinerooms;
  editForm.contentItems = contentItems;

  const emptyField = getEmptyField(editForm);
  if (emptyField !== '') {
    const message = `${emptyField}은(는) 필수 입력 사항입니다.`;
    reactAlert({
      title: '필수 입력 사항',
      message,
    });
    return;
  }

  reactConfirm({
    title: 'Content 수정',
    message: 'Content 수정 처리 하시겠습니까?',
    onOk: () => onEdit(portletId, editForm),
  });
}

export async function onEdit(portletId: string, editForm: PortletEditForm) {
  const toktokPortletUdo = getToktokPortletUdo(editForm);
  const result = await modifyToktokPortlet(portletId, toktokPortletUdo);
  if (result === 'success') {
    reactAlert({
      title: 'Content 수정',
      message: 'Content 수정 처리 완료했습니다.',
    });
    const currentHistory = getCurrentHistory();
    currentHistory?.push(getPortletDetailPath(portletId));
  } else {
    reactAlert({
      title: 'Content 수정',
      message: 'Content 수정 처리 실패했습니다. 잠시 후 다시 이용해 주세요.',
    });
  }
}
