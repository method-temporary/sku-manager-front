import { decorate, observable } from 'mobx';
import { PageModel, QueryModel } from 'shared/model';
import { BannerRdo } from './BannerRdo';

export class BannerQueryModel extends QueryModel {
  //
  language: string = '';
  state: string = '';

  orderBy: string = '';
  orderType: string = '';

  static asBannerRdo(bannerQuery: BannerQueryModel, pageModel: PageModel): BannerRdo {
    return {
      language: bannerQuery.language,
      state: bannerQuery.state,
      name: bannerQuery.searchWord,
      startDate: bannerQuery && bannerQuery.period && bannerQuery.period.startDateLong,
      endDate: bannerQuery && bannerQuery.period && bannerQuery.period.endDateLong,
      exposureType: null,
      orderBy: bannerQuery.orderBy,
      orderType: bannerQuery.orderType,
      offset: pageModel.offset,
      limit: pageModel.limit,
    };
  }
}

decorate(BannerQueryModel, {
  language: observable,
  state: observable,
  orderBy: observable,
  orderType: observable,
});
