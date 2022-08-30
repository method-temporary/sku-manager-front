import { createStore } from 'shared/store';
import { PortletCreateForm, initPortletCreateForm } from './portletCreate.models';

export const [setPortletCreateForm, onPortletCreateForm, getPortletCreateForm, usePortletCreateForm] =
  createStore<PortletCreateForm>(initPortletCreateForm());
