import { NameValueList } from 'shared/model';
import { langSupportCdo } from 'shared/components/Polyglot';

import { BadgeCategoryModel, BadgeCategoryCdo } from '_data/badge/badgeCategories/model';

export const fromBadgeCategoryCdoModel = (badgeCategoryModel: BadgeCategoryModel): BadgeCategoryCdo => {
  //
  return {
    name: badgeCategoryModel.name,
    iconPath: badgeCategoryModel.iconPath,
    backgroundImagePath: badgeCategoryModel.backgroundImagePath,
    topImagePath: badgeCategoryModel.topImagePath,
    themeColor: badgeCategoryModel.themeColor,
    langSupports: langSupportCdo(badgeCategoryModel.langSupports),
  };
};

export const getBadgeCategoryModelNameValueList = (badgeCategory: BadgeCategoryModel): NameValueList => {
  //
  return {
    nameValues: [
      {
        name: 'name',
        value: JSON.stringify(badgeCategory.name),
      },
      {
        name: 'iconPath',
        value: badgeCategory.iconPath,
      },
      {
        name: 'backgroundImagePath',
        value: badgeCategory.backgroundImagePath,
      },
      {
        name: 'themeColor',
        value: badgeCategory.themeColor,
      },
      {
        name: 'topImagePath',
        value: badgeCategory.topImagePath,
      },
      {
        name: 'langSupports',
        value: JSON.stringify(langSupportCdo(badgeCategory.langSupports)),
      },
    ],
  };
};
