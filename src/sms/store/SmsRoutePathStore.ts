import { createStore } from 'shared/store';
import { SmsRoutePath } from 'sms/viewmodel/SmsRoutePath';

export const [setSmsRoutePath, onSmsRoutePath, getSmsRoutePath, useSmsRoutePath] = createStore<SmsRoutePath>();
