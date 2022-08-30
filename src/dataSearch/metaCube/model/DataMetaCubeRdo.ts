import { PageModel } from 'shared/model';
import { DataMetaCubeQueryModel } from './DataMetaCubeQueryModel';

class DataMetaCubeRdo {
  college: string = '';
  channel: string = '';
  name: string = '';
  startDate: number = 0;
  endDate: number = 0;
  learningType: string = '';
  mainCategory: string = 'Y';

  limit: number = 20;
  offset: number = 0;

  constructor(searchModel?: DataMetaCubeQueryModel, pageModel?: PageModel) {
    if (searchModel && pageModel) {
      Object.assign(this, {
        college: searchModel.college,
        channel: searchModel.channel,
        name: searchModel.searchPart === '과정명' ? searchModel.searchWord : '',
        startDate: searchModel.period.startDateLong,
        endDate: searchModel.period.endDateLong,
        learningType: searchModel.learningType === '전체' ? '' : searchModel.learningType,
        mainCategory: searchModel.mainCategory,
        limit: pageModel.limit,
        offset: pageModel.offset,
      });
    }
  }
}

export default DataMetaCubeRdo;
