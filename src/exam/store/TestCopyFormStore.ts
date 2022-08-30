import { createStore } from 'shared/store';
import { getInitialTestCopyFromViewModel, TestCopyFormViewModel } from 'exam/viewmodel/TestCopyFormViewModel';

export const [setTestCopyFormViewModel, onTestCopyFormViewModel, getTestCopyFormViewModel, useTestCopyFormViewModel] =
  createStore<TestCopyFormViewModel>(getInitialTestCopyFromViewModel());
