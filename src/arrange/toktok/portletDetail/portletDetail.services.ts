import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { getWorkspaceById } from 'shared/hooks';
import { getPortletRouteParams, PortletRouteParams } from '../routeParams';
import { findToktokPortlet } from '../../../_data/arrange/toktok/api/toktokApi';
import { setPortletDetail } from './portletDetail.stores';
import { PortletContentItem } from '../portletContentCreate/portletContentCreate.models';

const MYSUNI_CINEROOM_ID = 'ne1-m2-c2';

export function useRequestPortletDetail() {
  const params = useParams<PortletRouteParams>();
  useEffect(() => {
    if (params.portletId === undefined || params.portletId === '') {
      return;
    }
    requestPortletDeteail(params.portletId);
  }, [params.portletId]);
}

export async function requestPortletDeteail(portletId: string) {
  const portlet = await findToktokPortlet(portletId);
  if (portlet === undefined) {
    return;
  }

  const contentItems: PortletContentItem[] = portlet.contents.map((content, index) => {
    return {
      contentNo: index,
      imageUrl: content.imgPath,
      description: content.text,
      linkUrl: content.link,
    };
  });

  const cineroomNames = portlet.cinerooms
    .map((cineroomId) => {
      if (cineroomId === MYSUNI_CINEROOM_ID) {
        return 'toktok';
      }
      const workspace = getWorkspaceById(cineroomId);
      return workspace === undefined ? '' : workspace.name.ko;
    })
    .filter((cineroomName) => cineroomName !== '');

  const params = getPortletRouteParams();

  setPortletDetail({
    id: portlet.id,
    title: portlet.title,
    cineroomNames,
    contentItems,
    startDate: moment(portlet.startTime).format('YYYY-MM-DD'),
    endDate: moment(portlet.endTime).format('YYYY-MM-DD'),
    editable: portlet.patronKey.keyString.endsWith(params?.cineroomId || '') === true,
  });
}
