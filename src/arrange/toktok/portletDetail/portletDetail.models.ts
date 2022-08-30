import { PortletContentItem } from "../portletContentCreate/portletContentCreate.models";

export interface PortletDetail {
  id: string;
  title: string;
  cineroomNames: string[];
  contentItems: PortletContentItem[];
  startDate: string;
  endDate: string;
  editable: boolean;
}