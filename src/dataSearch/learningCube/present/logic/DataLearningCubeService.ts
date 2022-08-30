import { action, observable, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import moment from 'moment';
import _ from 'lodash';

import DataLearningCubeModel from 'dataSearch/learningCube/model/DataLearningCubeModel';
import DataLearningCubeExcelModel from 'dataSearch/learningCube/model/DataLearningCubeExcelModel';
import DataLearningCubeRdo from 'dataSearch/learningCube/model/DataLearningCubeRdo';
import { DataLearningCubeQueryModel } from 'dataSearch/learningCube/model/DataLearningCubeQueryModel';

import DataLearningCubeApi from '../apiClient/DataLearningCubeApi';
import { PageModel } from 'shared/model';
import XLSX from 'xlsx';

@autobind
export class DataLearningCubeService {
  static instance: DataLearningCubeService;

  learningCubeApi: DataLearningCubeApi;

  @observable
  searchQueryModel: DataLearningCubeQueryModel = new DataLearningCubeQueryModel();

  @observable
  learningCube: DataLearningCubeModel = new DataLearningCubeModel();

  @observable
  learningCubes: DataLearningCubeModel[] = [];

  @observable
  learningCubeExcelDatas: DataLearningCubeModel[] = [];

  constructor(api: DataLearningCubeApi) {
    this.learningCubeApi = api;
  }

  @action
  changeDataQueryProp(name: string, value: any) {
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  changeDataProp(name: string, value: any) {
    this.learningCube = _.set(this.learningCube, name, value);
  }

  @action
  changeDataModalQueryProp(name: string, value: any) {
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  async findLearningCubes(pageModel: PageModel): Promise<number> {
    const offsetElementList = await this.learningCubeApi.findLearningCube(
      new DataLearningCubeRdo(this.searchQueryModel, pageModel)
    );

    if (offsetElementList.results) {
      runInAction(() => {
        this.learningCubes = offsetElementList.results.map((data) => new DataLearningCubeModel(data));
      });
    }

    return offsetElementList.totalCount;
  }

  @action
  async findExcelDatas(): Promise<number> {
    const offsetElementList = await this.learningCubeApi.findLearningCube(
      new DataLearningCubeRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.learningCubeExcelDatas = offsetElementList.results.map((excelData) => new DataLearningCubeModel(excelData));
    });

    return offsetElementList.totalCount;
  }

  @action
  setLearninCubeQuery(data: DataLearningCubeModel) {
    this.learningCube = data;
  }

  @action
  clearLearninCubeQuery() {
    this.learningCube = new DataLearningCubeModel();
  }
}

export function excelDownLoad(wbList: DataLearningCubeExcelModel[], sheetName: string, fileName: string) {
  const sheet = XLSX.utils.json_to_sheet(wbList);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, sheet, sheetName);

  const date = moment().format('YYYY-MM-DD_HH:mm:ss');
  fileName = `${fileName} -.${date}.xlsx`;
  XLSX.writeFile(wb, fileName, { compression: true });
  return fileName;
}

DataLearningCubeService.instance = new DataLearningCubeService(DataLearningCubeApi.instance);
export default DataLearningCubeService;
