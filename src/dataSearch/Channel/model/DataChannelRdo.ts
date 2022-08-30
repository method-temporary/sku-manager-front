import { PageModel } from 'shared/model';
import { DataChannelQueryModel } from './DataChannelQueryModel';

export class DataChannelRdo {
  //
  College: string = ''; // College
  Channel: string = ''; // Channel

  limit: number = 20;
  offset: number = 0;

  constructor(searchModel?: DataChannelQueryModel, pageModel?: PageModel) {
    //
    if (searchModel && pageModel) {
      Object.assign(this, {
        College: searchModel.College,
        Channel: searchModel.Channel,
        limit: pageModel.limit,
        offset: pageModel.offset,
      });
    }
  }
}

export default DataChannelRdo;
