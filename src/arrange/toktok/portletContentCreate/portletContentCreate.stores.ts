import { createStore } from 'shared/store';
import { initPortletContentItems, PortletContentItem } from './portletContentCreate.models';

export const [setPortletContentItems, onPortletContentItems, getPortletContentItems, usePortletContentItems] =
  createStore<PortletContentItem[]>(initPortletContentItems());
