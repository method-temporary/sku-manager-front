import MenuType from './MenuType';
import { MenuViewModel } from './Menu';
import AccessType from './AccessType';

export default interface MenuCdo {
  type?: MenuType;
  name?: string;
  url?: string;
  html?: string;
  order?: number;
  accessType?: AccessType;
  groupId?: string;
  surveyId?: string;
  surveyInformation?: string;
  parentId?: string;
}

export function getEmptyMenuCdo(): MenuCdo {
  return {};
}

export function fromViewModel(menu: MenuViewModel): MenuCdo {
  const { type, name, url, html, order, accessType, groupId, surveyId, surveyInformation, parentId } = menu;
  return {
    type,
    name,
    url: url === '' ? undefined : url,
    html: html === '' ? undefined : html,
    order,
    accessType,
    groupId: groupId === '' ? undefined : groupId,
    surveyId: surveyId === '' ? undefined : surveyId,
    surveyInformation,
    parentId
  }
}
