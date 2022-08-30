import { PageModel } from 'shared/model';
import { DataCubeClassroomQueryModel } from './DataCubeClassroomQueryModel';

class DataCubeClassroomRdo {
  college: string = '';
  channel: string = '';
  name: string = '';
  startDate: number = 0;
  endDate: number = 0;
  learningType: string = '';

  limit: number = 20;
  offset: number = 0;

  constructor(searchModel?: DataCubeClassroomQueryModel, pageModel?: PageModel) {
    if (searchModel && pageModel) {
      Object.assign(this, {
        college: searchModel.college,
        channel: searchModel.channel,
        name: searchModel.searchPart === '과정명' ? searchModel.searchWord : '',
        startDate: searchModel.period.startDateLong,
        endDate: searchModel.period.endDateLong,
        learningType: searchModel.learningType === '전체' ? '' : searchModel.learningType,
        limit: pageModel.limit,
        offset: pageModel.offset,
      });
    }
  }
}

export default DataCubeClassroomRdo;
