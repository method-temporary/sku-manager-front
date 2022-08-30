import { PageModel } from 'shared/model';
import { DataMetaCardQueryModel } from './DataMetaCardQueryModel';

class DataMetaCardRdo {
  college: string = '';
  channel: string = '';
  name: string = '';
  startDate: number = 0;
  endDate: number = 0;
  learningType: string = '';
  hasStamp: string = ''; // Stamp 획득 여부
  searchSearchable: string = ''; // 공개 / 비공개
  mainCategory: string = 'Y';

  limit: number = 20;
  offset: number = 0;

  constructor(searchModel?: DataMetaCardQueryModel, pageModel?: PageModel) {
    if (searchModel && pageModel) {
      Object.assign(this, {
        college: searchModel.college,
        channel: searchModel.channel,
        name: searchModel.searchPart === '과정명' ? searchModel.searchWord : '',
        startDate: searchModel.period.startDateLong,
        endDate: searchModel.period.endDateLong,
        learningType: searchModel.learningType === '전체' ? '' : searchModel.learningType,
        hasStamp:
          searchModel.hasStamp === '전체' || searchModel.hasStamp === ''
            ? ''
            : searchModel.hasStamp.toUpperCase() == 'YES'
            ? 1
            : 0,
        searchable:
          searchModel.searchSearchable === '전체' || searchModel.searchSearchable === ''
            ? ''
            : searchModel.searchSearchable === 'SearchOn'
            ? 1
            : 0,
        mainCategory: searchModel.mainCategory,
        limit: pageModel.limit,
        offset: pageModel.offset,
      });
    }
  }
}

export default DataMetaCardRdo;
