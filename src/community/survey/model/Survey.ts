import MenuType from 'community/menu/model/MenuType';

export default interface Survey {
  accessType?: string;
  communityId?: string;
  groupId?: string;
  menuId?: string;
  name?: string;
  order?: number;
  parentId?: string;
  surveyCaseId?: string;
  surveyId?: string;
  surveyInformation?: string;
  type?: string;
  commentFeedbackId?: string;
}

export function getEmptySurvey(): Survey {
  return {};
}
