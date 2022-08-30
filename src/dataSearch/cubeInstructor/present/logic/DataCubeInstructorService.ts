import { action, observable, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import moment from 'moment';
import _ from 'lodash';

import DataCubeInstructorModel from 'dataSearch/cubeInstructor/model/DataCubeInstructorModel';
import DataCubeInstructorExcelModel from 'dataSearch/cubeInstructor/model/DataCubeInstructorExcelModel';
import DataCubeInstructorRdo from 'dataSearch/cubeInstructor/model/DataCubeInstructorRdo';
import { DataCubeInstructorQueryModel } from 'dataSearch/cubeInstructor/model/DataCubeInstructorQueryModel';

import DataCubeInstructorApi from '../apiClient/DataCubeInstructorApi';
import { PageModel } from 'shared/model';
import XLSX from 'xlsx';

@autobind
export class DataCubeInstructorService {
  static instance: DataCubeInstructorService;

  cubeInstructorApi: DataCubeInstructorApi;

  @observable
  searchQueryModel: DataCubeInstructorQueryModel = new DataCubeInstructorQueryModel();

  @observable
  cubeInstructor: DataCubeInstructorModel = new DataCubeInstructorModel();

  @observable
  cubeInstructors: DataCubeInstructorModel[] = [];

  @observable
  pivotCubeInstructors: DataCubeInstructorModel[] = [];

  @observable
  cubeInstructorExcelDatas: DataCubeInstructorModel[] = [];

  constructor(api: DataCubeInstructorApi) {
    this.cubeInstructorApi = api;
  }

  @action
  changeDataQueryProp(name: string, value: any) {
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  changeDataProp(name: string, value: any) {
    this.cubeInstructor = _.set(this.cubeInstructor, name, value);
  }

  @action
  changeDataModalQueryProp(name: string, value: any) {
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  async findCubeInstructor(pageModel: PageModel): Promise<number> {
    const offsetElementList = await this.cubeInstructorApi.findCubeInstructor(
      new DataCubeInstructorRdo(this.searchQueryModel, pageModel)
    );

    if (offsetElementList.results) {
      runInAction(() => {
        this.cubeInstructors = offsetElementList.results.map((data) => new DataCubeInstructorModel(data));
      });
    }

    return offsetElementList.totalCount;
  }

  @action
  async findPivotDatas(): Promise<number> {
    const offsetElementList = await this.cubeInstructorApi.findCubeInstructor(
      new DataCubeInstructorRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.pivotCubeInstructors = offsetElementList.results.map((data) => new DataCubeInstructorModel(data));
    });

    return offsetElementList.totalCount;
  }

  @action
  async findExcelDatas(): Promise<number> {
    const offsetElementList = await this.cubeInstructorApi.findCubeInstructor(
      new DataCubeInstructorRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.cubeInstructorExcelDatas = offsetElementList.results.map(
        (excelData) => new DataCubeInstructorModel(excelData)
      );
    });

    return offsetElementList.totalCount;
  }

  @action
  setCubeInstructorQuery(data: DataCubeInstructorModel) {
    this.cubeInstructor = data;
  }

  @action
  clearCubeInstructorQuery() {
    this.cubeInstructor = new DataCubeInstructorModel();
  }
}

export function excelDownLoad(wbList: DataCubeInstructorExcelModel[], sheetName: string, fileName: string) {
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

DataCubeInstructorService.instance = new DataCubeInstructorService(DataCubeInstructorApi.instance);
export default DataCubeInstructorService;
