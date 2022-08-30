import moment from 'moment';
import { DropdownProps } from 'semantic-ui-react';
import { disqualifySmsSender, qualifySmsSender } from 'sms/api/senderApi';
import { getSenderRdo } from 'sms/model/SenderRdo';
import { requestSmsSenderList } from 'sms/service/requestSmsSenderList';
import {
  getSmsSenderCondListViewModel,
  getSmsSenderDisplayListViewModel,
  getSmsSenderListLimit,
  getSmsSenderListPage,
  getSmsSenderListViewModel,
  getSmsSenderSearchBoxViewModel,
  initSmsSenderListLimit,
  setSmsSenderCondListViewModel,
  setSmsSenderDisplayListViewModel,
  setSmsSenderListLimit,
  setSmsSenderListPage,
  setSmsSenderListViewModel,
  setSmsSenderSearchBoxViewModel,
} from 'sms/store/SmsSenderStore';
import { asSmsSenderXLSX, SmsSenderXlsModel } from 'sms/viewmodel/SmsSenderViewModel';
import XLSX from 'xlsx';

export function onChangeSearchAllowed(_: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
  const smsSearchBox = getSmsSenderSearchBoxViewModel();
  if (smsSearchBox !== undefined) {
    setSmsSenderSearchBoxViewModel({
      ...smsSearchBox,
      allowed: data.value as string,
    });
  }
}

export function onChangeKeyword(e: React.ChangeEvent<HTMLInputElement>) {
  const smsSearchBox = getSmsSenderSearchBoxViewModel();
  if (smsSearchBox !== undefined) {
    setSmsSenderSearchBoxViewModel({
      ...smsSearchBox,
      keyword: e.currentTarget.value,
    });
  }
}

export function onChangeKeywordType(_: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
  const smsSearchBox = getSmsSenderSearchBoxViewModel();
  if (smsSearchBox !== undefined) {
    setSmsSenderSearchBoxViewModel({
      ...smsSearchBox,
      keywordType: data.value as string,
    });
  }
}

export function onClickSearch() {
  const smsSearchBox = getSmsSenderSearchBoxViewModel();
  setSmsSenderListPage(1);
  if (smsSearchBox === undefined) {
    return;
  }
  const sentSmsRdo = getSenderRdo(smsSearchBox);
  requestSmsSenderList(sentSmsRdo);
}

export function onChangeLimit(_: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
  setSmsSenderListPage(1);
  setSmsSenderListLimit(data.value as number);
}

export async function onDownloadExcel() {
  const wbList: SmsSenderXlsModel[] = [];
  const senderList = getSmsSenderCondListViewModel();
  senderList?.results.forEach((sender) => {
    wbList.push(asSmsSenderXLSX(sender));
  });

  const studentExcel = XLSX.utils.json_to_sheet(wbList);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, studentExcel, 'Students');

  const date = moment().format('YYYY-MM-DD_HH:mm:ss');
  const time = new Date().toLocaleTimeString('en-GB');
  const fileName = `SMS발신자관리.${date}:${time}.xlsx`;
  XLSX.writeFile(wb, fileName, { compression: true });
  return fileName;
}

export function onChangePage() {
  const smsSearchBox = getSmsSenderSearchBoxViewModel();
  const senderListModel = getSmsSenderListViewModel();
  const senderList = senderListModel?.results;
  if (senderList !== undefined) {
    let alloweCondList = senderList;
    let offsetList = senderList;
    let displayTotalCount = senderListModel?.totalCount || 0;

    // 발송권한 검색조건
    if (smsSearchBox !== undefined && smsSearchBox.allowed !== undefined && smsSearchBox.allowed !== '') {
      alloweCondList = senderList.filter(
        (result) => result.allowed === (smsSearchBox.allowed === 'true' ? true : false)
      );
      displayTotalCount = alloweCondList.length;
    }
    setSmsSenderCondListViewModel({
      totalCount: displayTotalCount,
      results: alloweCondList,
    });

    // 페이징
    const page = getSmsSenderListPage() || 1;
    const limit = getSmsSenderListLimit() || initSmsSenderListLimit;
    const offset = (page - 1) * limit;
    offsetList = alloweCondList.slice(offset, offset + limit);

    setSmsSenderDisplayListViewModel({
      totalCount: displayTotalCount,
      results: offsetList,
    });
  }
}

export function onChangeSenderAllowed(id: string) {
  changeAllowedInData(id, true);

  qualifySmsSender(id);
}

export function onChangeSenderDisAllowed(id: string) {
  changeAllowedInData(id, false);

  disqualifySmsSender(id);
}

function changeAllowedInData(id: string, allow: boolean) {
  const senderList = getSmsSenderListViewModel();
  const condSenderList = getSmsSenderCondListViewModel();
  const displaySenderList = getSmsSenderDisplayListViewModel();

  if (senderList !== undefined) {
    const newSenderResults = senderList.results;
    const senderIdx = newSenderResults.findIndex((result) => result.id === id);
    newSenderResults[senderIdx].allowed = allow;
    setSmsSenderListViewModel({
      ...senderList,
      results: newSenderResults,
    });
  }
  if (condSenderList !== undefined) {
    const newSenderResults = condSenderList.results;
    const senderIdx = newSenderResults.findIndex((result) => result.id === id);
    newSenderResults[senderIdx].allowed = allow;
    setSmsSenderCondListViewModel({
      ...condSenderList,
      results: newSenderResults,
    });
  }
  if (displaySenderList !== undefined) {
    const newSenderResults = displaySenderList.results;
    const senderIdx = newSenderResults.findIndex((result) => result.id === id);
    newSenderResults[senderIdx].allowed = allow;
    setSmsSenderDisplayListViewModel({
      ...displaySenderList,
      results: newSenderResults,
    });
  }
}
