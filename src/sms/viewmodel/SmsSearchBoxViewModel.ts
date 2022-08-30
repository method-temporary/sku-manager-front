export interface SmsSearchBoxViewModel {
  startDate: Date;
  endDate: Date;
  selectedDate: string;
  keywordType: string;
  keyword: string;
}

export function initSmsSearchBoxViewModel(): SmsSearchBoxViewModel {
  const startYear = new Date().getFullYear() - 1;

  return {
    startDate: new Date(new Date().setFullYear(startYear)),
    endDate: new Date(),
    selectedDate: 'all',
    keywordType: '',
    keyword: '',
  };
}
