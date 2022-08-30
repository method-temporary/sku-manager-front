import { action, observable, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import moment from 'moment';
import _ from 'lodash';

import { PageModel } from 'shared/model';
import DataFavoritesApi from '../apiclient/DataFavoritesApi';
import { DataFavoritesModel } from '../../model/DataFavoritesModel';
import DataFavoritesRdo from '../../model/DataFavoritesRdo';
import XLSX from 'xlsx';
import { DataFavoritesQueryModel } from '../../model/DataFavoritesQueryModel';
import DataFavoritesExcelModel from '../../model/DataFavoritesExcelModel';

@autobind
export class DataFavoritesService {
  //
  static instance: DataFavoritesService;

  favoriteApi: DataFavoritesApi;

  @observable
  searchQueryModel: DataFavoritesQueryModel = new DataFavoritesQueryModel();

  @observable
  favorite: DataFavoritesModel = new DataFavoritesModel();

  @observable
  favorites: DataFavoritesModel[] = [];

  @observable
  favoritesExcel: DataFavoritesModel[] = [];

  constructor(favoriteApi: DataFavoritesApi) {
    //
    this.favoriteApi = favoriteApi;
  }

  @action
  changeChannelQueryProp(name: string, value: any) {
    //
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  changeChannelProp(name: string, value: any) {
    //
    this.favorite = _.set(this.favorite, name, value);
  }

  @action
  changeChannelModalQueryProp(name: string, value: any) {
    //
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  async findChannels(pageModel: PageModel): Promise<number> {
    //
    const offsetElementList = await this.favoriteApi.findChannel(
      new DataFavoritesRdo(this.searchQueryModel, pageModel)
    );

    if (offsetElementList.results) {
      runInAction(() => {
        this.favorites = offsetElementList.results.map((favorites) => new DataFavoritesModel(favorites));
      });
    }

    return offsetElementList.totalCount;
  }

  @action
  async findExcelDataChannels(): Promise<number> {
    //
    const offsetElementList = await this.favoriteApi.findChannel(
      new DataFavoritesRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.favoritesExcel = offsetElementList.results.map((favoritesExcel) => new DataFavoritesModel(favoritesExcel));
    });

    return offsetElementList.totalCount;
  }

  @action
  setChannelQuery(favorite: DataFavoritesModel) {
    //
    this.favorite = favorite;
  }

  @action
  clearChannelQuery() {
    this.favorite = new DataFavoritesModel();
  }
}

export function excelDownLoad(wbList: DataFavoritesExcelModel[], sheetName: string, fileName: string) {
  //
  const sheet = XLSX.utils.json_to_sheet(wbList);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, sheet, sheetName);

  const date = moment().format('YYYY-MM-DD_HH:mm:ss');
  fileName = `${fileName} -.${date}.xlsx`;
  XLSX.writeFile(wb, fileName, { compression: true });
  return fileName;
}

DataFavoritesService.instance = new DataFavoritesService(DataFavoritesApi.instance);
export default DataFavoritesService;
