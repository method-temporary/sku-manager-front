import { EmailFormat } from './EmailFormat';
import { SmsFormat } from './SmsFormat';
import { Target } from './Target';

export interface AutoEncourageSdo {
  cardId: string;
  title: string;
  scheduledSendTime?: number;
  emailFormat?: EmailFormat;
  smsFormat?: SmsFormat;
  target: Target;
  round?: number;
}
