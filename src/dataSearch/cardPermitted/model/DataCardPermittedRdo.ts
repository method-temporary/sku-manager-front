import { PageModel } from 'shared/model';
import { DataCardPermittedQueryModel } from './DataCardPermittedQueryModel';

class DataCardPermittedrRdo {
  name: string = '';
  limit: number = 20;
  offset: number = 0;

  constructor(searchModel?: DataCardPermittedQueryModel, pageModel?: PageModel) {
    if (searchModel && pageModel) {
      Object.assign(this, {
        name: searchModel.searchPart === '과정명' ? searchModel.searchWord : '',
        limit: pageModel.limit,
        offset: pageModel.offset,
      });
    }
  }
}

export default DataCardPermittedrRdo;
