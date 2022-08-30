import { PageModel } from 'shared/model';
import { DataCubeInstructorQueryModel } from './DataCubeInstructorQueryModel';

class DataCubeInstructorRdo {
  college: string = '';
  channel: string = '';
  name: string = '';
  learningType: string = ''
  mainCategory: string = 'Y';

  limit: number = 20;
  offset: number = 0;

  constructor(searchModel?: DataCubeInstructorQueryModel, pageModel?: PageModel) {
    if (searchModel && pageModel) {
      Object.assign(this, {
        college: searchModel.college,
        channel: searchModel.channel,
        name: searchModel.searchPart === '과정명' ? searchModel.searchWord : '',
        learningType: searchModel.learningType === '전체' ? '' : searchModel.learningType,
        mainCategory: searchModel.mainCategory,
        limit: pageModel.limit,
        offset: pageModel.offset,
      });
    }
  }
}

export default DataCubeInstructorRdo;
