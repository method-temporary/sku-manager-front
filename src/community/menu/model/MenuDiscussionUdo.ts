import { MenuViewModel } from './Menu';
import MenuType from './MenuType';
import RelatedUrl, { getEmptyRelatedUrl } from '../model/RelatedUrl';
import AccessType from './AccessType';

export default interface MenuDiscussionUdo {
  type: MenuType,
  id: string;
  name: string,
  discussionTopic: string,
  title: string,
  fileBoxId?: string;
  content?: string;
  relatedUrlList?: RelatedUrl[];
  privateComment?: boolean;
  accessType?: AccessType;
  groupId?: string;

}

export function fromViewModelToDiscussionUdo(
  menu: MenuViewModel
): MenuDiscussionUdo {
  const {
    type,
    id,
    name,
    discussionTopic,
    content,
    relatedUrlList,
    fileBoxId,
    accessType,
    groupId

  } = menu;
  return {
    type,
    id: Date.now().toString(),
    name,
    discussionTopic,
    title: name,
    content,
    relatedUrlList: relatedUrlList === undefined ? [getEmptyRelatedUrl()] : relatedUrlList,
    fileBoxId,
    accessType,
    groupId
  };
}

export function setViewModelToDiscussionUdo(
  type: MenuType,
  name: string,
  discussionTopic: string,
  title: string,
  content: string,
  fileBoxId: string,
  relatedUrlList: RelatedUrl[],
  privateComment?: boolean,
  accessType?: AccessType,
  groupId?: string

): MenuDiscussionUdo {
  return {
    id: Date.now().toString(),
    type,
    name,
    discussionTopic,
    title,
    content,
    relatedUrlList: relatedUrlList === undefined ? [getEmptyRelatedUrl()] : relatedUrlList,
    fileBoxId,
    privateComment,
    accessType: accessType === undefined ? 'COMMUNITY_ALL_MEMBER' : accessType,
    groupId
  };
}
