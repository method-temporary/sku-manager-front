export interface SmsMainNumberSearchBoxViewModel {
  keywordType: string;
  keyword: string;
}

export function initSmsMainNumberSearchBoxViewModel(): SmsMainNumberSearchBoxViewModel {
  return {
    keywordType: '',
    keyword: '',
  };
}

export interface SmsMainNumberListViewModel {
  results: SmsMainNumberListItemModel[];
  totalCount: number;
}

export interface SmsMainNumberListItemModel {
  enabled: boolean;
  id: string;
  modifiedTime: number;
  modifier: string;
  name: string;
  phone: string;
  registeredTime: number;
  registrant: string;
  registrantName: string;
}

export function initSmsMainNumberCreateViewModel(): SmsMainNumberCreateViewModel {
  return {
    id: '',
    mainNumberName: '',
    mainNumber: '',
    enabled: false,
  };
}

export interface SmsMainNumberCreateViewModel {
  id: string;
  mainNumberName: string;
  mainNumber: string;
  enabled: boolean;
}
