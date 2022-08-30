import { createStore } from 'shared/store';
import { LabelTree } from './labelTree.models';

export const [setLabelTree, onLabelTree, getLabelTree, useLabelTree] = createStore<LabelTree[]>();
