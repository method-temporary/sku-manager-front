import { createStore } from 'shared/store';
import { PortletEditForm, initPortletEditForm } from './portletEdit.models';

export const [setPortletEditForm, onPortletEditForm, getPortletEditForm, usePortletEditForm] =
  createStore<PortletEditForm>(initPortletEditForm());
