import PageType from './PageType';
import PagePermission from './PagePermission';

export default interface Page {
  id: number;

  communityId: number;
  ownerId: number;

  orderId?: number;
  contentUrl?: string;
  htmlContent?: string;
  name?: string;
  pageType?: PageType;
  pagePermissions?: PagePermission[];
  subPages?: Page[];
  upperPage?: Page;
}

export function getEmptyPage(): Page {
  return {
    id: 0,
    communityId: 0,
    ownerId: 0,
  };
}
