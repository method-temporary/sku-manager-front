import { createStore } from 'shared/store';
import { getInitialTestListViewModel, TestListViewModel } from 'exam/viewmodel/TestListViewModel';

export const [setTestListViewModel, onTestListViewModel, getTestListViewModel, useTestListViewModel] =
  createStore<TestListViewModel>(getInitialTestListViewModel());
