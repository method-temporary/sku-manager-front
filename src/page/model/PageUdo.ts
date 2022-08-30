import PageType from './PageType';
import PagePermission from './PagePermission';

export default interface PageUdo {
  communityId?: number;
  ownerId?: number;

  orderId?: number;
  contentUrl?: string;
  htmlContent?: string;
  name?: string;
  pageType?: PageType;
  pagePermissions?: PagePermission[];
  upperPageId?: number;
}
