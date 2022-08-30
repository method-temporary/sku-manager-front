import { SendSmsResultDetailModel } from 'shared/model';
export interface SmsDetailViewModel {
  from: string;
  to: string;
  message: string;
  sentDate: string;
  detail: SendSmsResultDetailModel;
}
