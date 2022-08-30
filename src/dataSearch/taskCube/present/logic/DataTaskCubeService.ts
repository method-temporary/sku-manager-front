import { action, observable, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import moment from 'moment';
import _ from 'lodash';

import DataTaskCubeModel from 'dataSearch/taskCube/model/DataTaskCubeModel';
import DataTaskCubeExcelModel from 'dataSearch/taskCube/model/DataTaskCubeExcelModel';
import DataTaskCubeRdo from 'dataSearch/taskCube/model/DataTaskCubeRdo';
import { DataTaskCubeQueryModel } from 'dataSearch/taskCube/model/DataTaskCubeQueryModel';

import DataTaskCubeApi from '../apiClient/DataTaskCubeApi';
import { PageModel } from 'shared/model';
import XLSX from 'xlsx';

@autobind
export class DataTaskCubeService {
  static instance: DataTaskCubeService;

  taskCubeApi: DataTaskCubeApi;

  @observable
  searchQueryModel: DataTaskCubeQueryModel = new DataTaskCubeQueryModel();

  @observable
  taskCube: DataTaskCubeModel = new DataTaskCubeModel();

  @observable
  taskCubes: DataTaskCubeModel[] = [];

  @observable
  pivotTaskCubes: DataTaskCubeModel[] = [];

  @observable
  taskCubeExcelDatas: DataTaskCubeModel[] = [];

  constructor(api: DataTaskCubeApi) {
    this.taskCubeApi = api;
  }

  @action
  changeDataQueryProp(name: string, value: any) {
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  changeDataProp(name: string, value: any) {
    this.taskCube = _.set(this.taskCube, name, value);
  }

  @action
  changeDataModalQueryProp(name: string, value: any) {
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  async findTaskCubes(pageModel: PageModel): Promise<number> {
    const offsetElementList = await this.taskCubeApi.findTaskCube(
      new DataTaskCubeRdo(this.searchQueryModel, pageModel)
    );

    if (offsetElementList.results) {
      runInAction(() => {
        this.taskCubes = offsetElementList.results.map((data) => new DataTaskCubeModel(data));
      });
    }

    return offsetElementList.totalCount;
  }

  @action
  async findPivotDatas(): Promise<number> {
    const offsetElementList = await this.taskCubeApi.findTaskCube(
      new DataTaskCubeRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.pivotTaskCubes = offsetElementList.results.map((data) => new DataTaskCubeModel(data));
    });

    return offsetElementList.totalCount;
  }

  @action
  async findExcelDatas(): Promise<number> {
    const offsetElementList = await this.taskCubeApi.findTaskCube(
      new DataTaskCubeRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.taskCubeExcelDatas = offsetElementList.results.map((excelData) => new DataTaskCubeModel(excelData));
    });

    return offsetElementList.totalCount;
  }

  @action
  setTaskCubeQuery(data: DataTaskCubeModel) {
    this.taskCube = data;
  }

  @action
  clearTaskCubeQuery() {
    this.taskCube = new DataTaskCubeModel();
  }
}

export function excelDownLoad(wbList: DataTaskCubeExcelModel[], sheetName: string, fileName: string) {
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

DataTaskCubeService.instance = new DataTaskCubeService(DataTaskCubeApi.instance);
export default DataTaskCubeService;
