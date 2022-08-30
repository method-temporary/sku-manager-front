import { createStore } from 'shared/store';
import { TestPreviewModalViewModel } from 'exam/viewmodel/TestPreviewModalViewModel';

export const [
  setTestPreviewModalViewModel,
  onTestPreviewModalViewModel,
  getTestPreviewModalViewModel,
  useTestPreviewModalViewModel,
] = createStore<TestPreviewModalViewModel>({
  isOpen: false,
});
