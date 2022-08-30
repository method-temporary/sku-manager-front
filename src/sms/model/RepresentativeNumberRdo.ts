import { SmsMainNumberSearchBoxViewModel } from 'sms/viewmodel/SmsMainNumberViewModel';

export interface RepresentativeNumberRdo {
  limit?: number;
  offset?: number;
  enabled?: boolean;
  name?: string;
  phone?: string;
  registrantName?: string;
}

export function getRepresentativeNumberRdo(
  smsSearchBox: SmsMainNumberSearchBoxViewModel,
  offset?: number,
  limit?: number
): RepresentativeNumberRdo {
  return {
    name: smsSearchBox.keywordType === 'name' ? smsSearchBox.keyword : undefined,
    phone: smsSearchBox.keywordType === 'phone' ? smsSearchBox.keyword : undefined,
    offset,
    limit,
  };
}
