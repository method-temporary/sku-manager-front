import { PageElementPosition } from './PageElementPosition';

export enum PageElementType {
  //
  Default = '',
  //    top
  Category = 'Category',
  Learning = 'Learning',
  Recommend = 'Recommend',
  Create = 'Create',
  Certification = 'Certification',
  Community = 'Community',
  MyPage = 'MyPage',

  //    floating
  Introduction = 'Introduction',
  Support = 'Support',
  FavoriteChannels = 'FavoriteChannels',
  SiteMap = 'SiteMap',
  Approval = 'Approval',
  AplRegistration = 'AplRegistration',

  //    home
  Summary = 'Summary',
  LearningCards = 'LearningCards',
  ChallengingBadges = 'ChallengingBadges',
  RecommendCards = 'RecommendCards',
}

const getPageElementTypesByPosition = (position: PageElementPosition): PageElementType[] => {
  if (position === PageElementPosition.TopMenu) {
    return [
      PageElementType.Category,
      PageElementType.Learning,
      PageElementType.Recommend,
      PageElementType.Create,
      PageElementType.Certification,
      PageElementType.Community,
      PageElementType.MyPage,
    ];
  } else if (position === PageElementPosition.Footer) {
    return [
      PageElementType.Introduction,
      PageElementType.Support,
      PageElementType.FavoriteChannels,
      PageElementType.SiteMap,
      PageElementType.Approval,
      PageElementType.AplRegistration,
    ];
  } else if (position === PageElementPosition.HomeElement) {
    return [
      PageElementType.Summary,
      PageElementType.LearningCards,
      PageElementType.ChallengingBadges,
      PageElementType.RecommendCards,
    ];
  } else {
    return [
      PageElementType.Category,
      PageElementType.Learning,
      PageElementType.Recommend,
      PageElementType.Create,
      PageElementType.Certification,
      PageElementType.Community,
      PageElementType.MyPage,
      PageElementType.Introduction,
      PageElementType.Support,
      PageElementType.FavoriteChannels,
      PageElementType.SiteMap,
      PageElementType.Approval,
      PageElementType.AplRegistration,
      PageElementType.Summary,
      PageElementType.LearningCards,
      PageElementType.ChallengingBadges,
      PageElementType.RecommendCards,
    ];
  }
};

export { getPageElementTypesByPosition };
