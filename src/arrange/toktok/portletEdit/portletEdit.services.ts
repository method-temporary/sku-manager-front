import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { findToktokPortlet } from '../../../_data/arrange/toktok/api/toktokApi';
import { setPortletEditForm } from './portletEdit.stores';
import { initPortletEditForm } from './portletEdit.models';
import { getPortletRouteParams, PortletRouteParams } from '../routeParams';
import { setCheckedCinerooms } from '../cineroomCheckbox/cineroomCheckbox.stores';
import { setPortletContentItems } from '../portletContentCreate/portletContentCreate.stores';
import { initPortletContentItems, PortletContentItem } from '../portletContentCreate/portletContentCreate.models';

export function useRequestPortletEditForm() {
  const params = useParams<PortletRouteParams>();
  useEffect(() => {
    if (params.portletId === undefined || params.portletId === '') {
      return;
    }
    requestPortletEditForm(params.portletId);
  }, [params.portletId]);
}

export async function requestPortletEditForm(portletId: string) {
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

  const params = getPortletRouteParams();
  setPortletEditForm({
    id: portlet.id,
    title: portlet.title,
    cinerooms: portlet.cinerooms,
    contentItems,
    startDate: new Date(portlet.startTime),
    endDate: new Date(portlet.endTime),
    editable: portlet.patronKey.keyString.endsWith(params?.cineroomId || '') === true,
  });
  setCheckedCinerooms(portlet.cinerooms);
  setPortletContentItems(contentItems);
}

export function useClearPortletEdit() {
  useEffect(() => {
    return () => {
      setPortletEditForm(initPortletEditForm());
      setCheckedCinerooms([]);
      setPortletContentItems(initPortletContentItems());
    };
  }, []);
}
