export interface SmsListViewModel {
  totalCount: number;
  smsList: SmsListItem[];
}

export interface SmsListItem {
  id: string;
  from: string;
  to: string;
  message: string;
  sentDate: string;
  senderEmail: string;
  senderName: string;
}

export function initSmsListViewModel(): SmsListViewModel {
  return {
    totalCount: 0,
    smsList: [],
  };
}
