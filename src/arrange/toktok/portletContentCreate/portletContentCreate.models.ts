export interface PortletContentItem {
  contentNo: number,
  imageUrl: string;
  description: string;
  linkUrl: string;
}

export function initPortletContentItems(): PortletContentItem[] {
  return [
    {
      contentNo: 0,
      imageUrl: '',
      description: '',
      linkUrl: 'https://int.mysuni.sk.com/login?contentUrl=',
    },
  ];
}