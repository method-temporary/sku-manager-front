import { createStore } from 'shared/store';
import { initSmsModalViewModel, SmsModalViewModel } from 'sms/viewmodel/SmsModalViewModel';

export const [setSmsModalViewModel, onSmsModalViewModel, getSmsModalViewModel, useSmsModalViewModel] =
  createStore<SmsModalViewModel>(initSmsModalViewModel());
