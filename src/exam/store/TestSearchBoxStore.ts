import { getInitialTestSearchBoxViewModel, TestSearchBoxViewModel } from 'exam/viewmodel/TestSearchBoxViewModel';
import { createStore } from 'shared/store';

export const [
  setTestSearchBoxViewModel,
  onTestSearchBoxViewModel,
  getTestSearchBoxViewModel,
  useTestSearchBoxViewModel,
] = createStore<TestSearchBoxViewModel>(getInitialTestSearchBoxViewModel());
