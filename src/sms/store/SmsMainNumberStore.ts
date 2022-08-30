import { createStore } from 'shared/store';
import {
  initSmsMainNumberCreateViewModel,
  initSmsMainNumberSearchBoxViewModel,
  SmsMainNumberCreateViewModel,
  SmsMainNumberListViewModel,
  SmsMainNumberSearchBoxViewModel,
} from 'sms/viewmodel/SmsMainNumberViewModel';

export const [
  setSmsMainNumberSearchBoxViewModel,
  onSmsMainNumberSearchBoxViewModel,
  getSmsMainNumberSearchBoxViewModel,
  useSmsMainNumberSearchBoxViewModel,
] = createStore<SmsMainNumberSearchBoxViewModel>(initSmsMainNumberSearchBoxViewModel());

export const [
  setSmsMainNumberListViewModel,
  onSmsMainNumberListViewModel,
  getSmsMainNumberListViewModel,
  useSmsMainNumberListViewModel,
] = createStore<SmsMainNumberListViewModel>();

export const [setSmsMainNumberListPage, onSmsMainNumberListPage, getSmsMainNumberListPage, useSmsMainNumberListPage] =
  createStore<number>(1);
export const [
  setSmsMainNumberListLimit,
  onSmsMainNumberListLimit,
  getSmsMainNumberListLimit,
  useSmsMainNumberListLimit,
] = createStore<number>(20);

export const [
  setSmsMainNumberCreateViewModel,
  onSmsMainNumberCreateViewModel,
  getSmsMainNumberCreateViewModel,
  useSmsMainNumberCreateViewModel,
] = createStore<SmsMainNumberCreateViewModel>(initSmsMainNumberCreateViewModel());
