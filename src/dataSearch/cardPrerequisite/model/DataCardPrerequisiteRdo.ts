import { PageModel } from 'shared/model';
import { DataCardPrerequisiteQueryModel } from './DataCardPrerequisiteQueryModel';

class DataCardPrerequisiterRdo {
  searchSearchable: string = ''; // 공개 / 비공개
  limit: number = 20;
  offset: number = 0;

  constructor(searchModel?: DataCardPrerequisiteQueryModel, pageModel?: PageModel) {
    if (searchModel && pageModel) {
      Object.assign(this, {
        searchable:
          searchModel.searchSearchable === '전체' || searchModel.searchSearchable === ''
            ? ''
            : (searchModel.searchSearchable === 'SearchOn' ? 1 : 0),
        limit: pageModel.limit,
        offset: pageModel.offset,
      });
    }
  }
}

export default DataCardPrerequisiterRdo;
