import { PageModel } from 'shared/model';
import { DataBadgeQueryModel } from './DataBadgeQueryModel';

export class DataBadgeRdo {
  //
  Date: number = 0; // 조회일자.
  CompanyCode: string = ''; // 회사코드

  limit: number = 20;
  offset: number = 0;

  constructor(searchModel?: DataBadgeQueryModel, pageModel?: PageModel) {
    //
    if (searchModel && pageModel) {
      Object.assign(this, {
        Date: searchModel.period.startDateLong,
        CompanyCode: searchModel.CompanyCode.toString(),
        limit: pageModel.limit,
        offset: pageModel.offset,
      });
    }
  }
}

export default DataBadgeRdo;
