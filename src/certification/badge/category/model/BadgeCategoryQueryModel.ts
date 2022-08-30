import { decorate, observable } from 'mobx';
import { QueryModel, PageModel } from 'shared/model';
import { BadgeCategoryRdo } from '_data/badge/badgeCategories/model';

export class BadgeCategoryQueryModel extends QueryModel {
  //
  cineroomId: string = '';

  static asBadgeCategoryRdo(badgeCategoryQuery: BadgeCategoryQueryModel, pageModel: PageModel): BadgeCategoryRdo {
    //
    return {
      cineroomId: badgeCategoryQuery.cineroomId,
      offset: pageModel.offset,
      limit: pageModel.limit,
      displayOrder: false,
    };
  }

  static asBadgeCineroomCategoryRdo(cinroomId: string, pageModel: PageModel): BadgeCategoryRdo {
    return {
      cineroomId: cinroomId,
      offset: pageModel.offset,
      limit: pageModel.limit,
      displayOrder: false,
    };
  }

  static asBadgeCategoryDisPlayOrder(
    badgeCategoryQuery: BadgeCategoryQueryModel,
    pageModel: PageModel
  ): BadgeCategoryRdo {
    //
    return {
      cineroomId: badgeCategoryQuery.cineroomId,
      offset: pageModel.offset,
      limit: pageModel.limit,
      displayOrder: true,
    };
  }
}

decorate(BadgeCategoryQueryModel, {
  cineroomId: observable,
});
