import MenuType from './MenuType';
import AccessType from './AccessType';
import RelatedUrl, { getEmptyRelatedUrl } from '../model/RelatedUrl';

export default interface Menu {
  id: string;
  menuId: string;
  communityId?: string;
  type: MenuType;
  name: string;
  url: string;
  html: string;
  discussionTopic: string;
  order: number;
  accessType: AccessType;
  groupId: string;
  surveyId: string;
  surveyInformation: string;
  parentId?: string;
  content?: string;
  relatedUrlList?: RelatedUrl[];
  fileBoxId: string
  privateComment: boolean;
}

export interface MenuViewModel extends Menu {
  editing?: boolean;
  isNew?: boolean;
}

export function getEmptyMenu(): MenuViewModel {
  return {
    id: Date.now().toString(),
    menuId: '',
    editing: false,
    order: 0,
    type: 'BASIC',
    accessType: 'COMMUNITY_ALL_MEMBER',
    name: '',
    url: '',
    html: '',
    groupId: '',
    discussionTopic: '',
    surveyId: '',
    surveyInformation: '',
    content: '',
    relatedUrlList: [getEmptyRelatedUrl()],
    fileBoxId: '',
    privateComment: true,
  };
}
