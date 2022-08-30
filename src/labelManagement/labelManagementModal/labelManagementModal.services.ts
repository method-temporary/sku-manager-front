import { createStore } from 'shared/store';
import { LabelManagementModal } from './labelManagementModal.models';

export const [
  setLabelManagementModalInput,
  onLabelManagementModalInput,
  getLabelManagementModalInput,
  useLabelManagementModalInput,
] = createStore<LabelManagementModal>();

export const [
  setLabelResourcePathIsOpen,
  onLabelResourcePathIsOpen,
  getLabelResourcePathIsOpen,
  useLabelResourcePathIsOpen,
] = createStore<boolean>();

export const [setLabelResourceIsOpen, onLabelResourceIsOpen, getLabelResourceIsOpen, useLabelResourceIsOpen] =
  createStore<boolean>();
