export interface TestSearchBoxViewModel {
  startDate: Date;
  endDate: Date;
  selectedDate: string;
  versionState: string;
  questionSelectionType: string;
  keywordType: string;
  keyword: string;
}

export function getInitialTestSearchBoxViewModel(): TestSearchBoxViewModel {
  const now = new Date();
  const startDate = new Date(now.setFullYear(now.getFullYear() - 2));
  startDate.setDate(startDate.getDate() + 1);
  const endDate = new Date();

  return {
    startDate,
    endDate,
    selectedDate: '',
    versionState: '',
    questionSelectionType: '',
    keywordType: '',
    keyword: '',
  }
}