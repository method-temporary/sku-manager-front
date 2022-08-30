import { createStore } from 'shared/store';
import { initSmsSearchBoxViewModel, SmsSearchBoxViewModel } from 'sms/viewmodel/SmsSearchBoxViewModel';

export const [setSmsSearchBoxViewModel, onSmsSearchBoxViewModel, getSmsSearchBoxViewModel, useSmsSearchBoxViewModel] =
  createStore<SmsSearchBoxViewModel>(initSmsSearchBoxViewModel());
