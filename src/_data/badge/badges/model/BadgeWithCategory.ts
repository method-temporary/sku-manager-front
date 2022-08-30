import { BadgeModel } from './BadgeModel';
import { BadgeCategoryModel } from '../../badgeCategories/model';

export class BadgeWithCategory {
  //
  badge: BadgeModel = new BadgeModel();
  badgeCategory: BadgeCategoryModel = new BadgeCategoryModel();

  constructor(badgeWithCategory: BadgeWithCategory) {
    //
    if (badgeWithCategory) {
      const badge = new BadgeModel(badgeWithCategory.badge);
      const badgeCategory = new BadgeCategoryModel(badgeWithCategory.badgeCategory);

      Object.assign(this, { badge, badgeCategory });
    }
  }
}
