import { createStore } from 'shared/store';
import { initSmsSendFormViewModel, SmsSendFormViewModel } from 'sms/viewmodel/SmsSendFormViewModel';

export const [setSmsSendFormViewModel, onSmsSendFormViewModel, getSmsSendFormViewModel, useSmsSendFormViewModel] =
  createStore<SmsSendFormViewModel>(initSmsSendFormViewModel());
