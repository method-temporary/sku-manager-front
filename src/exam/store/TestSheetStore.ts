import { createStore } from 'shared/store';
import { TestSheetViewModel } from 'exam/viewmodel/TestSheetViewModel';

export const [setTestSheetViewModel, onTestSheetViewModel, getTestSheetViewModel, useTestSheetViewModel] =
  createStore<TestSheetViewModel>();
