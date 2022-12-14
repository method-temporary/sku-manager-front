import { reactAlert, reactConfirm } from '@nara.platform/accent';
import { ButtonProps, DropdownProps } from 'semantic-ui-react';
import { getCurrentHistory } from 'shared/store';
import { modify, register, remove } from 'sms/api/representativeNumberApi';
import { getRepresentativeNumberRdo } from 'sms/model/RepresentativeNumberRdo';
import { getRepresentativeNumberSdo } from 'sms/model/RepresentativeNumberSdo';
import { requestSmsMainNumberList } from 'sms/service/requestSmsMainNumberList';
import {
  getSmsMainNumberCreateViewModel,
  getSmsMainNumberListLimit,
  getSmsMainNumberListPage,
  getSmsMainNumberSearchBoxViewModel,
  setSmsMainNumberCreateViewModel,
  setSmsMainNumberListLimit,
  setSmsMainNumberListPage,
  setSmsMainNumberSearchBoxViewModel,
} from 'sms/store/SmsMainNumberStore';
import { getSmsRoutePath } from 'sms/store/SmsRoutePathStore';
import { SmsMainNumberCreateViewModel } from 'sms/viewmodel/SmsMainNumberViewModel';

// searchbox
export function onChangeKeyword(e: React.ChangeEvent<HTMLInputElement>) {
  const smsSearchBox = getSmsMainNumberSearchBoxViewModel();
  if (smsSearchBox !== undefined) {
    setSmsMainNumberSearchBoxViewModel({
      ...smsSearchBox,
      keyword: e.currentTarget.value,
    });
  }
}

export function onChangeKeywordType(_: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
  const smsSearchBox = getSmsMainNumberSearchBoxViewModel();
  if (smsSearchBox !== undefined) {
    setSmsMainNumberSearchBoxViewModel({
      ...smsSearchBox,
      keywordType: data.value as string,
    });
  }
}

export function onClickSearch(_: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) {
  const smsSearchBox = getSmsMainNumberSearchBoxViewModel();
  setSmsMainNumberListPage(1);
  const page = getSmsMainNumberListPage();
  const limit = getSmsMainNumberListLimit();
  if (smsSearchBox === undefined || page === undefined || limit === undefined) {
    return;
  }
  const offset = (page - 1) * limit;
  const sentSmsRdo = getRepresentativeNumberRdo(smsSearchBox, offset, limit);
  requestSmsMainNumberList(sentSmsRdo);
}

// list header
export function onClickCreateMainNumber() {
  //
  const history = getCurrentHistory();
  if (history !== undefined) {
    const testRoutePath = getSmsRoutePath();
    if (testRoutePath !== undefined) {
      history.push(`${testRoutePath.path}/sms-mainnumber-management/create`);
    }
  }
}

export function onChangeLimit(_: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
  setSmsMainNumberListPage(1);
  setSmsMainNumberListLimit(data.value as number);
}

// list
export function onClickSmsMainNumberItem(id: string) {
  const history = getCurrentHistory();
  if (history !== undefined) {
    const testRoutePath = getSmsRoutePath();
    if (testRoutePath !== undefined) {
      history.push(`${testRoutePath.path}/sms-mainnumber-management/detail/${id}`);
    }
  }
}

// create
export function onChangeMainNumberName(value: string) {
  const smsMainNumberCreate = getSmsMainNumberCreateViewModel();
  if (smsMainNumberCreate !== undefined) {
    setSmsMainNumberCreateViewModel({
      ...smsMainNumberCreate,
      mainNumberName: value,
    });
  }
}
export function onChangeMainNumber(value: string) {
  const smsMainNumberCreate = getSmsMainNumberCreateViewModel();
  if (smsMainNumberCreate !== undefined) {
    setSmsMainNumberCreateViewModel({
      ...smsMainNumberCreate,
      mainNumber: value,
    });
  }
}
export function onChangeMainNumberEnabled(value: boolean) {
  const smsMainNumberCreate = getSmsMainNumberCreateViewModel();
  if (smsMainNumberCreate !== undefined) {
    setSmsMainNumberCreateViewModel({
      ...smsMainNumberCreate,
      enabled: value,
    });
  }
}

export function onClickDelete() {
  const smsMainNumberCreate = getSmsMainNumberCreateViewModel();
  if (smsMainNumberCreate !== undefined && smsMainNumberCreate.id !== '') {
    reactConfirm({
      title: 'SMS ???????????? ??????',
      message: '?????? ???????????????????',
      onOk: () => onDeleteMainNumber(smsMainNumberCreate.id),
    });
  }
}

async function onDeleteMainNumber(id: string) {
  await remove(id);
  reactAlert({
    title: 'SMS ???????????? ??????',
    message: '??????????????????.',
  });
  onClickList();
}

export function onClickList() {
  const history = getCurrentHistory();
  if (history !== undefined) {
    const testRoutePath = getSmsRoutePath();
    if (testRoutePath !== undefined) {
      history.push(`${testRoutePath.path}/sms-mainnumber-management`);
    }
  }
}

export function onClickSave() {
  const smsMainNumberCreate = getSmsMainNumberCreateViewModel();
  if (smsMainNumberCreate !== undefined) {
    reactConfirm({
      title: 'SMS ???????????? ??????',
      message: '?????? ???????????????????',
      onOk: () => onSaveMainNumber(smsMainNumberCreate),
    });
  }
}

async function onSaveMainNumber(smsMainNumberCreate: SmsMainNumberCreateViewModel) {
  const sdo = getRepresentativeNumberSdo(smsMainNumberCreate);
  if (smsMainNumberCreate.id !== '') {
    await modify(sdo);
    reactAlert({
      title: 'SMS ???????????? ??????',
      message: '??????????????????.',
    });
    onClickList();
  } else {
    const result = await register(sdo);
    if (result !== undefined) {
      reactAlert({
        title: 'SMS ???????????? ??????',
        message: '??????????????????.',
      });
      onClickList();
    } else {
      reactAlert({
        title: 'SMS ???????????? ??????',
        message: '????????? ??????????????????. ?????? ??? ?????? ????????? ?????????.',
      });
    }
  }
}
