import { PatronKey } from '@nara.platform/accent';

export interface SentSms {
  id: string;
  from: string;
  to: string[];
  message: string;
  time: number;
  patronKey: PatronKey;
}
