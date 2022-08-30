import { createStore } from 'shared/store';
import {
  getInitialTestQuestionGroupModalViewModel,
  TestQuestionGroupModalViewModel,
} from '../viewmodel/TestQuestionGroupModalViewModel';

export const [
  setTestQuestionGroupModalViewModel,
  onTestQuestionGroupModalViewModel,
  getTestQuestionGroupModalViewModel,
  useTestQuestionGroupModalViewModel,
] = createStore<TestQuestionGroupModalViewModel>(getInitialTestQuestionGroupModalViewModel());
