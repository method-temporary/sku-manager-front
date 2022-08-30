import { createStore } from 'shared/store';

export interface PortletRoutePath {
  path: string;
}

export const [setPortletRoutePath, onPortletRoutePath, getPortletRoutePath, usePortletRoutePath] =
  createStore<PortletRoutePath>();

export function getPortletListPath() {
  const portletRoutePath = getPortletRoutePath();
  if (portletRoutePath === undefined) {
    return '';
  }
  return `${portletRoutePath.path}/toktok`;
}

export function getPortletCreatePath() {
  const portletRoutePath = getPortletRoutePath();
  if (portletRoutePath === undefined) {
    return '';
  }
  return `${portletRoutePath.path}/toktok/create`;
}

export function getPortletEditPath(id: string) {
  const portletRoutePath = getPortletRoutePath();
  if (portletRoutePath === undefined) {
    return '';
  }
  return `${portletRoutePath.path}/toktok/${id}/edit`;
}

export function getPortletDetailPath(id: string) {
  const portletRoutePath = getPortletRoutePath();
  if (portletRoutePath === undefined) {
    return '';
  }
  return `${portletRoutePath.path}/toktok/${id}/detail`;
}
