import { ButtonProps, DropdownProps } from "semantic-ui-react";
import { getSentSmsRdo } from "sms/model/SentSmsRdo";
import { requestSmsList } from "sms/service/requestSmsList";
import { getSmsListLimit } from "sms/store/SmsListLimitStore";
import { getSmsListPage } from "sms/store/SmsListPageStore";
import { getSmsSearchBoxViewModel, setSmsSearchBoxViewModel } from "sms/store/SmsSearchBoxStore";

export function onChangeStartDate(date: Date) {
  const smsSearchBox = getSmsSearchBoxViewModel();
  if (smsSearchBox !== undefined) {
    setSmsSearchBoxViewModel({
      ...smsSearchBox,
      startDate: date,
    });
  }
}

export function onChangeEndDate(date: Date) {
  const smsSearchBox = getSmsSearchBoxViewModel();
  if (smsSearchBox !== undefined) {
    setSmsSearchBoxViewModel({
      ...smsSearchBox,
      endDate: date,
    });
  }
}

export function onClickDate(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  const smsSearchBox = getSmsSearchBoxViewModel();
  if (smsSearchBox !== undefined) {
    setSmsSearchBoxViewModel({
      ...smsSearchBox,
      selectedDate: e.currentTarget.value,
    });
  }
}

export function onChangeKeyword(e: React.ChangeEvent<HTMLInputElement>) {
  const smsSearchBox = getSmsSearchBoxViewModel();
  if (smsSearchBox !== undefined) {
    setSmsSearchBoxViewModel({
      ...smsSearchBox,
      keyword: e.currentTarget.value,
    });
  }
}

export function onChangeKeywordType(_: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
  const smsSearchBox = getSmsSearchBoxViewModel();
  if (smsSearchBox !== undefined) {
    setSmsSearchBoxViewModel({
      ...smsSearchBox,
      keywordType: data.value as string,
    });
  }
}


export function onClickSearch(_: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) {
  const smsSearchBox = getSmsSearchBoxViewModel();
  const page = getSmsListPage();
  const limit = getSmsListLimit();
  if (smsSearchBox === undefined || page === undefined || limit === undefined) {
    return;
  }
  const offset = (page - 1) * limit;
  const sentSmsRdo = getSentSmsRdo(smsSearchBox, offset, limit);
  requestSmsList(sentSmsRdo);
}