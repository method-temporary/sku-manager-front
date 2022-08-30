import { PageModel } from 'shared/model';
import { DataTaskCubeQueryModel } from './DataTaskCubeQueryModel';

class DataTaskCubeRdo {
  // college: string = '';
  // channel: string = '';
  id: string = '';
  // name: string = '';
  startDate: number = 0;
  endDate: number = 0;
  // learningType: string = ''

  limit: number = 20;
  offset: number = 0;

  constructor(searchModel?: DataTaskCubeQueryModel, pageModel?: PageModel) {
    if (searchModel && pageModel) {
      Object.assign(this, {
        // college: searchModel.college,
        // channel: searchModel.channel,
        id: searchModel.id,
        // name: searchModel.searchPart === '과정명' ? searchModel.searchWord : '',
        startDate: searchModel.period.startDateLong,
        endDate: searchModel.period.endDateLong,
        // learningType: searchModel.learningType === '전체' ? '' : searchModel.learningType,
        limit: pageModel.limit,
        offset: pageModel.offset,
      });
    }
  }
}

export default DataTaskCubeRdo;
