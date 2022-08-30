import { createStore } from 'shared/store';
import { initPortletSearchBox, PortletSearchBox } from './portletSearchBox.models';

export const [setPortletSearchBox, onPortletSearchBox, getPortletSearchBox, usePortletSearchBox] =
  createStore<PortletSearchBox>(initPortletSearchBox());
