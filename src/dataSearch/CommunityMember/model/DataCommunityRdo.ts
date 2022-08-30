import { PageModel } from 'shared/model';
import { DataCommunityQueryModel } from './DataCommunityQueryModel';

export class DataCommunityRdo {
  //
  CommunityCode: string = '';

  limit: number = 20;
  offset: number = 0;

  constructor(searchModel?: DataCommunityQueryModel, pageModel?: PageModel) {
    //
    if (searchModel && pageModel) {
      Object.assign(this, {
        CommunityCode: searchModel.CommunityCode,
        limit: pageModel.limit,
        offset: pageModel.offset,
      });
    }
  }
}

export default DataCommunityRdo;
