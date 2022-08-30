import { createStore } from 'shared/store';
import { SmsListViewModel } from 'sms/viewmodel/SmsListViewModel';

export const [setSmsListViewModel, onSmsListViewModel, getSmsListViewModel, useSmsListViewModel] =
  createStore<SmsListViewModel>();

export const [setSmsUserInfo, onSmsUserInfo, getSmsUserInfo, useSmsUserInfo] = createStore<{
  userPhone: string;
  userAllowed: boolean;
}>();
