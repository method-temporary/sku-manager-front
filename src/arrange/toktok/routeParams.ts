import { createStore } from 'shared/store';

export interface PortletRouteParams {
  cineroomId: string;
  portletId: string;
}

export const [setPortletRouteParams, onPortletRouteParams, getPortletRouteParams, usePortletRouteParams] =
  createStore<PortletRouteParams>();
