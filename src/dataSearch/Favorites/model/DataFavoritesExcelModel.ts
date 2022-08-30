import { DataFavoritesModel } from './DataFavoritesModel';

class DataFavoritesExcelModel {
  //
  email: string = '';
  name: string = '';
  college명: string = '';
  channel명: string = '';

  constructor(model?: DataFavoritesModel) {
    //
    if (model) {
      Object.assign(this, {
        email: model.email,
        name: model.name,
        college명: model.collegeName,
        channel명: model.channelName,
      });
    }
  }
}

export default DataFavoritesExcelModel;
