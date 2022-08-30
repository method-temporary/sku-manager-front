import { PageModel } from 'shared/model';
import { DataFavoritesQueryModel } from './DataFavoritesQueryModel';

export class DataFavoritesRdo {
  //
  College: string = ''; // College
  Channel: string = ''; // Channel

  limit: number = 20;
  offset: number = 0;

  constructor(searchModel?: DataFavoritesQueryModel, pageModel?: PageModel) {
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

export default DataFavoritesRdo;
