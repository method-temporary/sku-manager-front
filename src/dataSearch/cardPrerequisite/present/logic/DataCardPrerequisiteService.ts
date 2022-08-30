import { action, observable, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import moment from 'moment';
import _ from 'lodash';

import DataCardPrerequisiteModel from 'dataSearch/cardPrerequisite/model/DataCardPrerequisiteModel';
import DataCardPrerequisiteExcelModel from 'dataSearch/cardPrerequisite/model/DataCardPrerequisiteExcelModel';
import DataCardPrerequisiteRdo from 'dataSearch/cardPrerequisite/model/DataCardPrerequisiteRdo';
import { DataCardPrerequisiteQueryModel } from 'dataSearch/cardPrerequisite/model/DataCardPrerequisiteQueryModel';

import DataCardPrerequisiteApi from '../apiClient/DataCardPrerequisiteApi';
import { PageModel } from 'shared/model';
import XLSX from 'xlsx';

@autobind
export class DataCardPrerequisiteService {
  static instance: DataCardPrerequisiteService;

  cardPrerequisiteApi: DataCardPrerequisiteApi;

  @observable
  searchQueryModel: DataCardPrerequisiteQueryModel = new DataCardPrerequisiteQueryModel();

  @observable
  cardPrerequisite: DataCardPrerequisiteModel = new DataCardPrerequisiteModel();

  @observable
  cardPrerequisites: DataCardPrerequisiteModel[] = [];

  @observable
  pivotCardPrerequisites: DataCardPrerequisiteModel[] = [];

  @observable
  cardPrerequisiteExcelDatas: DataCardPrerequisiteModel[] = [];

  constructor(api: DataCardPrerequisiteApi) {
    this.cardPrerequisiteApi = api;
  }

  @action
  changeDataQueryProp(name: string, value: any) {
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  changeDataProp(name: string, value: any) {
    this.cardPrerequisite = _.set(this.cardPrerequisite, name, value);
  }

  @action
  changeDataModalQueryProp(name: string, value: any) {
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  async findCardPrerequisite(pageModel: PageModel): Promise<number> {
    const offsetElementList = await this.cardPrerequisiteApi.findCardPrerequisite(
      new DataCardPrerequisiteRdo(this.searchQueryModel, pageModel)
    );

    if (offsetElementList.results) {
      runInAction(() => {
        this.cardPrerequisites = offsetElementList.results.map((data) => new DataCardPrerequisiteModel(data));
      });
    }

    return offsetElementList.totalCount;
  }

  @action
  async findPivotDatas(): Promise<number> {
    const offsetElementList = await this.cardPrerequisiteApi.findCardPrerequisite(
      new DataCardPrerequisiteRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.pivotCardPrerequisites = offsetElementList.results.map((data) => new DataCardPrerequisiteModel(data));
    });

    return offsetElementList.totalCount;
  }

  @action
  async findExcelDatas(): Promise<number> {
    const offsetElementList = await this.cardPrerequisiteApi.findCardPrerequisite(
      new DataCardPrerequisiteRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.cardPrerequisiteExcelDatas = offsetElementList.results.map(
        (excelData) => new DataCardPrerequisiteModel(excelData)
      );
    });

    return offsetElementList.totalCount;
  }

  @action
  setCardPrerequisiteQuery(data: DataCardPrerequisiteModel) {
    this.cardPrerequisite = data;
  }

  @action
  clearCardPrerequisiteQuery() {
    this.cardPrerequisite = new DataCardPrerequisiteModel();
  }
}

export function excelDownLoad(wbList: DataCardPrerequisiteExcelModel[], sheetName: string, fileName: string) {
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

DataCardPrerequisiteService.instance = new DataCardPrerequisiteService(DataCardPrerequisiteApi.instance);
export default DataCardPrerequisiteService;
