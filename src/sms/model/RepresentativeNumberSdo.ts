import { SmsMainNumberCreateViewModel } from 'sms/viewmodel/SmsMainNumberViewModel';

export interface RepresentativeNumberSdo {
  id: string;
  enabled: boolean;
  name: string;
  phone: string;
}

export function getRepresentativeNumberSdo(mainNumber: SmsMainNumberCreateViewModel): RepresentativeNumberSdo {
  return {
    enabled: mainNumber.enabled,
    id: mainNumber.id,
    name: mainNumber.mainNumberName,
    phone: mainNumber.mainNumber,
  };
}
