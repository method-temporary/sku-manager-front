import { PageModel } from 'shared/model';
import { DataMetaBadgeQueryModel } from './DataMetaBadgeQueryModel';

class DataMetaBadgeRdo {
  searchPart: string = '';
  searchWord: string = '';
  limit: number = 20;
  offset: number = 0;

  constructor(searchModel?: DataMetaBadgeQueryModel, pageModel?: PageModel) {
    if (searchModel && pageModel) {
      Object.assign(this, {
        searchPart: searchModel.searchPart,
        searchWord: searchModel.searchWord,
        limit: pageModel.limit,
        offset: pageModel.offset,
      });
    }
  }
}

export default DataMetaBadgeRdo;
