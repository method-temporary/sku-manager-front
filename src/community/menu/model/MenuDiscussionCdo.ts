import MenuType from './MenuType';
import { MenuViewModel } from './Menu';
import AccessType from './AccessType';
import RelatedUrl, { getEmptyRelatedUrl } from '../model/RelatedUrl';

export default interface MenuDiscussionCdo {
  type?: MenuType;
  name?: string;
  discussionTopic?: string;
  order?: number;
  accessType?: AccessType;
  groupId?: string;
  parentId?: string;
  content?: string;
  fileBoxId?: string;
  title?: string;
  relatedUrlList?: RelatedUrl[];
  privateComment?: boolean;
  commentFeedbackId?: string;
}

export function getEmptyMenuDiscussionCdo(): MenuDiscussionCdo {
  return {};
}

export function fromViewModelToDiscussionCdo(
  menu: MenuViewModel
): MenuDiscussionCdo {
  const {
    type,
    name,
    discussionTopic,
    order,
    accessType,
    groupId,
    parentId,
    content,
    relatedUrlList,
    fileBoxId,
    privateComment
  } = menu;
  return {
    type,
    name,
    discussionTopic: discussionTopic === '' ? undefined : discussionTopic,
    order,
    accessType,
    groupId: groupId === '' ? undefined : groupId,
    parentId,
    content,
    relatedUrlList: relatedUrlList === undefined ? [getEmptyRelatedUrl()] : relatedUrlList,
    fileBoxId,
    privateComment
  };
}
