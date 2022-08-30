import { action, observable, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import moment from 'moment';
import _ from 'lodash';

import DataMetaCubeModel from 'dataSearch/metaCube/model/DataMetaCubeModel';
import DataMetaCubeExcelModel from 'dataSearch/metaCube/model/DataMetaCubeExcelModel';
import DataMetaCubeRdo from 'dataSearch/metaCube/model/DataMetaCubeRdo';
import { DataMetaCubeQueryModel } from 'dataSearch/metaCube/model/DataMetaCubeQueryModel';

import DataMetaCubeApi from '../apiClient/DataMetaCubeApi';
import { PageModel } from 'shared/model';
import XLSX from 'xlsx';

@autobind
export class DataMetaCubeService {
  static instance: DataMetaCubeService;

  metaCubeApi: DataMetaCubeApi;

  @observable
  searchQueryModel: DataMetaCubeQueryModel = new DataMetaCubeQueryModel();

  @observable
  metaCube: DataMetaCubeModel = new DataMetaCubeModel();

  @observable
  metaCubes: DataMetaCubeModel[] = [];

  @observable
  pivotMetaCubes: DataMetaCubeModel[] = [];

  @observable
  metaCubeExcelDatas: DataMetaCubeModel[] = [];

  constructor(api: DataMetaCubeApi) {
    this.metaCubeApi = api;
  }

  @action
  changeDataQueryProp(name: string, value: any) {
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  changeDataProp(name: string, value: any) {
    this.metaCube = _.set(this.metaCube, name, value);
  }

  @action
  changeDataModalQueryProp(name: string, value: any) {
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  async findMetaCubes(pageModel: PageModel): Promise<number> {
    const offsetElementList = await this.metaCubeApi.findMetaCube(
      new DataMetaCubeRdo(this.searchQueryModel, pageModel)
    );

    if (offsetElementList.results) {
      runInAction(() => {
        this.metaCubes = offsetElementList.results.map((data) => new DataMetaCubeModel(data));
      });
    }

    return offsetElementList.totalCount;
  }

  @action
  async findPivotDatas(): Promise<number> {
    const offsetElementList = await this.metaCubeApi.findMetaCube(
      new DataMetaCubeRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.pivotMetaCubes = offsetElementList.results.map((data) => new DataMetaCubeModel(data));
    });

    return offsetElementList.totalCount;
  }

  @action
  async findExcelDatas(): Promise<number> {
    const offsetElementList = await this.metaCubeApi.findMetaCube(
      new DataMetaCubeRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.metaCubeExcelDatas = offsetElementList.results.map((excelData) => new DataMetaCubeModel(excelData));
    });

    return offsetElementList.totalCount;
  }

  @action
  setMetaCubeQuery(data: DataMetaCubeModel) {
    this.metaCube = data;
  }

  @action
  clearMetaCubeQuery() {
    this.metaCube = new DataMetaCubeModel();
  }
}

export function excelDownLoad(wbList: DataMetaCubeExcelModel[], sheetName: string, fileName: string) {
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

DataMetaCubeService.instance = new DataMetaCubeService(DataMetaCubeApi.instance);
export default DataMetaCubeService;
