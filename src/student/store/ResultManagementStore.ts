import { createStore } from 'shared/store';
import { ResultManagementViewModel } from '../viewModel/ResultManagementViewModel';

const [
  setResultManagementViewModel,
  onResultManagementViewModel,
  getResultManagementViewModel,
  useResultManagementViewModel,
] = createStore<ResultManagementViewModel>();

export {
  setResultManagementViewModel,
  onResultManagementViewModel,
  getResultManagementViewModel,
  useResultManagementViewModel,
};
