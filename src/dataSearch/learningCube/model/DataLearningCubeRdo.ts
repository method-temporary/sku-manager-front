import { PageModel } from 'shared/model';
import { DataLearningCubeQueryModel } from './DataLearningCubeQueryModel';

class DataLearningCubeRdo {
  college: string = '';
  channel: string = '';
  companyCode: string = '';
  name: string = '';
  startDate: number = 0;
  endDate: number = 0;

  limit: number = 20;
  offset: number = 0;

  constructor(searchModel?: DataLearningCubeQueryModel, pageModel?: PageModel) {
    if (searchModel && pageModel) {
      Object.assign(this, {
        college: searchModel.college,
        channel: searchModel.channel,
        companyCode: searchModel.companyCode,
        name: searchModel.searchPart === '과정명' ? searchModel.searchWord : '',
        startDate: searchModel.period.startDateLong,
        endDate: searchModel.period.endDateLong,
        limit: pageModel.limit,
        offset: pageModel.offset,
      });
    }
  }
}

export default DataLearningCubeRdo;
