import { createStore } from './store';
import { ContentsProviderModel } from 'college/model/ContentsProviderModel';

export const [setContentsProviders, onContentsProviders, getContentsProviders, useContentsProviders] =
  createStore<ContentsProviderModel[]>();
