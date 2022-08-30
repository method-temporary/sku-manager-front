import { createStore } from 'shared/store';
import {
  initSmsSenderSearchBoxViewModel,
  SmsSenderListViewModel,
  SmsSenderSearchBoxViewModel,
} from 'sms/viewmodel/SmsSenderViewModel';

export const [
  setSmsSenderSearchBoxViewModel,
  onSmsSenderSearchBoxViewModel,
  getSmsSenderSearchBoxViewModel,
  useSmsSenderSearchBoxViewModel,
] = createStore<SmsSenderSearchBoxViewModel>(initSmsSenderSearchBoxViewModel());

export const [setSmsSenderListPage, onSmsSenderListPage, getSmsSenderListPage, useSmsSenderListPage] =
  createStore<number>(1);
export const initSmsSenderListLimit = 20;
export const [setSmsSenderListLimit, onSmsSenderListLimit, getSmsSenderListLimit, useSmsSenderListLimit] =
  createStore<number>(initSmsSenderListLimit);

export const [
  setSmsSenderListViewModel,
  onSmsSenderListViewModel,
  getSmsSenderListViewModel,
  useSmsSenderListViewModel,
] = createStore<SmsSenderListViewModel>();

export const [
  setSmsSenderCondListViewModel,
  onSmsSenderCondListViewModel,
  getSmsSenderCondListViewModel,
  useSmsSenderCondListViewModel,
] = createStore<SmsSenderListViewModel>();

export const [
  setSmsSenderDisplayListViewModel,
  onSmsSenderDisplayListViewModel,
  getSmsSenderDisplayListViewModel,
  useSmsSenderDisplayListViewModel,
] = createStore<SmsSenderListViewModel>();
