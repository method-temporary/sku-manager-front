import { requestTestList } from "exam/service/requestTestList";
import { getInitialTestListLimit, getTestListLimit } from "exam/store/TestListLimitStore";
import { setTestListPage } from "exam/store/TestListPageStore";
import { getTestSearchBoxViewModel, setTestSearchBoxViewModel } from "exam/store/TestSearchBoxStore";
import { DropdownProps } from "semantic-ui-react";

export const onChangeStartDate = (startDate: Date) => {
  const testsearchBox = getTestSearchBoxViewModel();
  if (testsearchBox !== undefined) {
    setTestSearchBoxViewModel({
      ...testsearchBox,
      startDate,
    });
  }
}

export const onChangeEndDate = (endDate: Date) => {
  const testSearchBox = getTestSearchBoxViewModel();
  if (testSearchBox !== undefined) {
    setTestSearchBoxViewModel({
      ...testSearchBox,
      endDate,
    })
  }
}

export const onClickDate = (e: React.MouseEvent<HTMLButtonElement>) => {
  const testSearchBox = getTestSearchBoxViewModel();
  if (testSearchBox !== undefined) {
    setTestSearchBoxViewModel({
      ...testSearchBox,
      selectedDate: e.currentTarget.value,
    })
  }
}

export const onChangeVersionState = (
  e: React.SyntheticEvent<HTMLElement, Event>,
  data: DropdownProps,
) => {
  const testSearchBox = getTestSearchBoxViewModel();
  if (testSearchBox !== undefined) {
    setTestSearchBoxViewModel({
      ...testSearchBox,
      versionState: data.value as string,
    })
  }
}

export const onChangeQuestionSelectionType = (
  e: React.SyntheticEvent<HTMLElement, Event>,
  data: DropdownProps,
) => {
  const testSearchBox = getTestSearchBoxViewModel();
  if (testSearchBox !== undefined) {
    setTestSearchBoxViewModel({
      ...testSearchBox,
      questionSelectionType: data.value as string,
    })
  }
}


export const onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
  const testSearchBox = getTestSearchBoxViewModel();
  if (testSearchBox !== undefined) {
    setTestSearchBoxViewModel({
      ...testSearchBox,
      keyword: e.currentTarget.value,
    });
  }
};

export const onChangeKeywordType = (
  _: React.SyntheticEvent<HTMLElement, Event>,
  data: DropdownProps,
) => {
  const testSearchBox = getTestSearchBoxViewModel();
  if (testSearchBox !== undefined) {
    setTestSearchBoxViewModel({
      ...testSearchBox,
      keywordType: data.value as string,
    });
  }
};

export const onClickSearch = () => {
  setTestListPage(1);
  const testListLimit = getTestListLimit() || getInitialTestListLimit();
  requestTestList(0, testListLimit);
}