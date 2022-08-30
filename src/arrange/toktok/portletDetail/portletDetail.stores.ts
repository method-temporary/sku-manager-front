import { createStore } from 'shared/store';
import { PortletDetail } from './portletDetail.models';

export const [setPortletDetail, onPortletDetail, getPortletDetail, usePortletDetail] = createStore<PortletDetail>();
