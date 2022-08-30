import { createStore } from 'shared/store';
import { LabelInputTable } from './labelInputTable.models';

export const [setLabelInputTable, onLabelInputTable, getLabelInputTable, useLabelInputTable] =
  createStore<LabelInputTable>();

export function initLabelInputTable(): LabelInputTable {
  return {
    id: '',
    name: '',
    memo: '',
    isParent: false,
  };
}
