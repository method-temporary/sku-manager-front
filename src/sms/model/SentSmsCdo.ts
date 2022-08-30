import { SmsSendFormViewModel } from "sms/viewmodel/SmsSendFormViewModel";

export interface SentSmsCdo {
  from: string;
  to: string[];
  message: string;
}

export function getSentSmsCdo(smsSendForm: SmsSendFormViewModel): SentSmsCdo {
  const uniqueToSet = new Set(smsSendForm.to.split('\n').filter(t => t !== ''));
  return {
    from: smsSendForm.from,
    to: Array.from(uniqueToSet),
    message: smsSendForm.message,
  };
}