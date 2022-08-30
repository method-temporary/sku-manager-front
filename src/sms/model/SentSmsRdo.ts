import { SmsSearchBoxViewModel } from "sms/viewmodel/SmsSearchBoxViewModel";

export interface SentSmsRdo {
  from?: string;
  to?: string;
  message?: string;
  startDate?: number;
  endDate?: number;
  offset?: number;
  limit?: number;
}

export function getSentSmsRdo(smsSearchBox: SmsSearchBoxViewModel, offset?: number, limit?: number): SentSmsRdo {
  return {
    from: smsSearchBox.keywordType === 'from' ? smsSearchBox.keyword : undefined,
    to: smsSearchBox.keywordType === 'to' ? smsSearchBox.keyword : undefined,
    message: smsSearchBox.keywordType === 'message' ? smsSearchBox.keyword : undefined,
    startDate: smsSearchBox.startDate.setHours(0, 0, 0, 0),
    endDate: smsSearchBox.endDate.setHours(23, 59, 59, 59),
    offset,
    limit,
  };
}