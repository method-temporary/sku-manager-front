import { decorate, observable } from 'mobx';
import { QueryModel } from 'shared/model';
import { CollegeBannerRdoModel } from './CollegeBannerRdoModel';

export class CollegeBannerQueryModel extends QueryModel {
  title: any;
  currentPage: number = 0;

  static asBannerRdo(collegeBannerQuery: CollegeBannerQueryModel): CollegeBannerRdoModel {
    const isTitle = true;
    return {
      startDate: collegeBannerQuery && collegeBannerQuery.period && collegeBannerQuery.period.startDateLong,
      endDate: collegeBannerQuery && collegeBannerQuery.period && collegeBannerQuery.period.endDateLong,
      title: (isTitle && collegeBannerQuery && collegeBannerQuery.searchWord) || '',
      offset: collegeBannerQuery && collegeBannerQuery.offset,
      limit: collegeBannerQuery && collegeBannerQuery.limit,
    };
  }
}

decorate(CollegeBannerQueryModel, {
  currentPage: observable,
  period: observable,
  title: observable,
  offset: observable,
  limit: observable,
});
