import { action, observable, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import moment from 'moment';
import _ from 'lodash';

import DataMetaCardModel from 'dataSearch/metaCard/model/DataMetaCardModel';
import DataMetaCardExcelModel from 'dataSearch/metaCard/model/DataMetaCardExcelModel';
import DataMetaCardRdo from 'dataSearch/metaCard/model/DataMetaCardRdo';
import { DataMetaCardQueryModel } from 'dataSearch/metaCard/model/DataMetaCardQueryModel';

import DataMetaCardApi from '../apiClient/DataMetaCardApi';
import { PageModel } from 'shared/model';
import XLSX from 'xlsx';

@autobind
export class DataMetaCardService {
  static instance: DataMetaCardService;

  metaCardApi: DataMetaCardApi;

  @observable
  searchQueryModel: DataMetaCardQueryModel = new DataMetaCardQueryModel();

  @observable
  metaCard: DataMetaCardModel = new DataMetaCardModel();

  @observable
  metaCards: DataMetaCardModel[] = [];

  @observable
  pivotMetaCards: DataMetaCardModel[] = [];

  @observable
  metaCardExcelDatas: DataMetaCardModel[] = [];

  constructor(api: DataMetaCardApi) {
    this.metaCardApi = api;
  }

  @action
  changeDataQueryProp(name: string, value: any) {
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  changeDataProp(name: string, value: any) {
    this.metaCard = _.set(this.metaCard, name, value);
  }

  @action
  changeDataModalQueryProp(name: string, value: any) {
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  async findMetaCards(pageModel: PageModel): Promise<number> {
    const offsetElementList = await this.metaCardApi.findMetaCard(
      new DataMetaCardRdo(this.searchQueryModel, pageModel)
    );

    if (offsetElementList.results) {
      runInAction(() => {
        this.metaCards = offsetElementList.results.map((data) => new DataMetaCardModel(data));
      });
    }

    return offsetElementList.totalCount;
  }

  @action
  async findPivotDatas(): Promise<number> {
    const offsetElementList = await this.metaCardApi.findMetaCard(
      new DataMetaCardRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.pivotMetaCards = offsetElementList.results.map((data) => new DataMetaCardModel(data));
    });

    return offsetElementList.totalCount;
  }

  @action
  async findExcelDatas(): Promise<number> {
    const offsetElementList = await this.metaCardApi.findMetaCard(
      new DataMetaCardRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.metaCardExcelDatas = offsetElementList.results.map((excelData) => new DataMetaCardModel(excelData));
    });

    return offsetElementList.totalCount;
  }

  @action
  setMetaCardQuery(data: DataMetaCardModel) {
    this.metaCard = data;
  }

  @action
  clearMetaCardQuery() {
    this.metaCard = new DataMetaCardModel();
  }
}

export function excelDownLoad(wbList: DataMetaCardExcelModel[], sheetName: string, fileName: string) {
  const sheet = XLSX.utils.json_to_sheet(wbList);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, sheet, sheetName);

  const date = moment().format('YYYY-MM-DD_HH:mm:ss');
  fileName = `${fileName} -.${date}.xlsx`;
  XLSX.writeFile(wb, fileName, { compression: true });
  return fileName;
}

export function pivotExcelDownLoad(wbList: any, sheetName: string, fileName: string) {
  const sheet = XLSX.utils.table_to_sheet(wbList);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, sheet, sheetName);

  const date = moment().format('YYYY-MM-DD_HH:mm:ss');
  fileName = `${fileName} -.${date}.xlsx`;
  XLSX.writeFile(wb, fileName, { compression: true });
  return fileName;
}

DataMetaCardService.instance = new DataMetaCardService(DataMetaCardApi.instance);
export default DataMetaCardService;
