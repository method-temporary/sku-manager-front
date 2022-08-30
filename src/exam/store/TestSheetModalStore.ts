import { TestSheetModalViewModel, getInitialTestSheetModalViewModel } from 'exam/viewmodel/TestSheetModalViewModel';
import { createStore } from 'shared/store';

export const [
  setTestSheetModalViewModel,
  onTestSheetModalViewModel,
  getTestSheetModalViewModel,
  useTestSheetModalViewModel,
] = createStore<TestSheetModalViewModel>(getInitialTestSheetModalViewModel());
