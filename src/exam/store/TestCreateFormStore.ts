import { getInitialTestCreateFromViewModel, TestCreateFormViewModel } from 'exam/viewmodel/TestCreateFormViewModel';
import { createStore } from 'shared/store';

export const [
  setTestCreateFormViewModel,
  onTestCreateFormViewModel,
  getTestCreateFormViewModel,
  useTestCreateFormViewModel,
] = createStore<TestCreateFormViewModel>(getInitialTestCreateFromViewModel());
