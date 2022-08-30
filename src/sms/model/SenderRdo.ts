import { SmsSenderSearchBoxViewModel } from 'sms/viewmodel/SmsSenderViewModel';

export interface SenderRdo {
  email?: string;
  name?: string;
  qualified?: boolean;
}

export function getSenderRdo(smsSearchBox: SmsSenderSearchBoxViewModel): SenderRdo {
  return {
    name: smsSearchBox.keywordType === 'name' ? smsSearchBox.keyword : undefined,
    email: smsSearchBox.keywordType === 'email' ? smsSearchBox.keyword : undefined,
    qualified: smsSearchBox.allowed === 'true' ? true : smsSearchBox.allowed === 'false' ? false : undefined,
  };
}
