export interface PortletList {
  totalCount: number;
  items: PortletListItem[];
}

export interface PortletListItem {
  id: string;
  title: string;
  cineroomNames: string;
  displayStartDate: string;
  displayEndDate: string;
  registrantName: string;
  registeredTime: string;
}

export function initPortletList(): PortletList {
  return {
    totalCount: 0,
    items: [],
  };
}
