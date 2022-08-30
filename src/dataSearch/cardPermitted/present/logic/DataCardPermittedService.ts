import { action, observable, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import moment from 'moment';
import _ from 'lodash';

import DataCardPermittedModel from 'dataSearch/cardPermitted/model/DataCardPermittedModel';
import DataCardPermittedExcelModel from 'dataSearch/cardPermitted/model/DataCardPermittedExcelModel';
import DataCardPermittedRdo from 'dataSearch/cardPermitted/model/DataCardPermittedRdo';
import { DataCardPermittedQueryModel } from 'dataSearch/cardPermitted/model/DataCardPermittedQueryModel';

import DataCardPermittedApi from '../apiClient/DataCardPermittedApi';
import { PageModel } from 'shared/model';
import XLSX from 'xlsx';

@autobind
export class DataCardPermittedService {
  static instance: DataCardPermittedService;

  cardPermittedApi: DataCardPermittedApi;

  @observable
  searchQueryModel: DataCardPermittedQueryModel = new DataCardPermittedQueryModel();

  @observable
  cardPermitted: DataCardPermittedModel = new DataCardPermittedModel();

  @observable
  cardPermitteds: DataCardPermittedModel[] = [];

  @observable
  pivotCardPermitteds: DataCardPermittedModel[] = [];

  @observable
  cardPermittedExcelDatas: DataCardPermittedModel[] = [];

  constructor(api: DataCardPermittedApi) {
    this.cardPermittedApi = api;
  }

  @action
  changeDataQueryProp(name: string, value: any) {
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  changeDataProp(name: string, value: any) {
    this.cardPermitted = _.set(this.cardPermitted, name, value);
  }

  @action
  changeDataModalQueryProp(name: string, value: any) {
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  async findCardPermitted(pageModel: PageModel): Promise<number> {
    const offsetElementList = await this.cardPermittedApi.findCardPermitted(
      new DataCardPermittedRdo(this.searchQueryModel, pageModel)
    );

    if (offsetElementList.results) {
      runInAction(() => {
        this.cardPermitteds = offsetElementList.results.map((data) => new DataCardPermittedModel(data));
      });
    }

    return offsetElementList.totalCount;
  }

  @action
  async findPivotDatas(): Promise<number> {
    const offsetElementList = await this.cardPermittedApi.findCardPermitted(
      new DataCardPermittedRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.pivotCardPermitteds = offsetElementList.results.map((data) => new DataCardPermittedModel(data));
    });

    return offsetElementList.totalCount;
  }

  @action
  async findExcelDatas(): Promise<number> {
    const offsetElementList = await this.cardPermittedApi.findCardPermitted(
      new DataCardPermittedRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.cardPermittedExcelDatas = offsetElementList.results.map(
        (excelData) => new DataCardPermittedModel(excelData)
      );
    });

    return offsetElementList.totalCount;
  }

  @action
  setCardPermittedQuery(data: DataCardPermittedModel) {
    this.cardPermitted = data;
  }

  @action
  clearCardPermittedQuery() {
    this.cardPermitted = new DataCardPermittedModel();
  }
}

export function excelDownLoad(wbList: DataCardPermittedExcelModel[], sheetName: string, fileName: string) {
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

DataCardPermittedService.instance = new DataCardPermittedService(DataCardPermittedApi.instance);
export default DataCardPermittedService;
