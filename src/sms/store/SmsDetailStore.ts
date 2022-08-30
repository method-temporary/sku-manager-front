import { createStore } from 'shared/store';
import { SmsDetailViewModel } from 'sms/viewmodel/SmsDetailViewModel';

export const [setSmsDetailViewModel, onSmsDetailViewModel, getSmsDetailViewModel, useSmsDetailViewModel] =
  createStore<SmsDetailViewModel>();
