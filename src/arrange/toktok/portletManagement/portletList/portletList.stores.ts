import { createStore } from 'shared/store';
import { initPortletList, PortletList } from './portletList.models';

export const [setPortletList, onPortletList, getPortletList, usePortletList] = createStore<PortletList>(
  initPortletList()
);

export const [setPortletListLimit, onPortletListLimit, getPortletListLimit, usePortletListLimit] =
  createStore<number>(20);

export const [setPortletListPage, onPortletListPage, getPortletListPage, usePortletListPage] = createStore<number>(1);
