import { action, observable, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import moment from 'moment';
import _ from 'lodash';

import DataCubeClassroomModel from 'dataSearch/cubeClassroom/model/DataCubeClassroomModel';
import DataCubeClassroomExcelModel from 'dataSearch/cubeClassroom/model/DataCubeClassroomExcelModel';
import DataCubeClassroomRdo from 'dataSearch/cubeClassroom/model/DataCubeClassroomRdo';
import { DataCubeClassroomQueryModel } from 'dataSearch/cubeClassroom/model/DataCubeClassroomQueryModel';

import DataCubeClassroomApi from '../apiClient/DataCubeClassroomApi';
import { PageModel } from 'shared/model';
import XLSX from 'xlsx';

@autobind
export class DataCubeClassroomService {
  static instance: DataCubeClassroomService;

  cubeClassroomApi: DataCubeClassroomApi;

  @observable
  searchQueryModel: DataCubeClassroomQueryModel = new DataCubeClassroomQueryModel();

  @observable
  cubeClassroom: DataCubeClassroomModel = new DataCubeClassroomModel();

  @observable
  cubeClassrooms: DataCubeClassroomModel[] = [];

  @observable
  pivotCubeClassrooms: DataCubeClassroomModel[] = [];

  @observable
  cubeClassroomExcelDatas: DataCubeClassroomModel[] = [];

  constructor(api: DataCubeClassroomApi) {
    this.cubeClassroomApi = api;
  }

  @action
  changeDataQueryProp(name: string, value: any) {
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  changeDataProp(name: string, value: any) {
    this.cubeClassroom = _.set(this.cubeClassroom, name, value);
  }

  @action
  changeDataModalQueryProp(name: string, value: any) {
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  async findCubeClassrooms(pageModel: PageModel): Promise<number> {
    const offsetElementList = await this.cubeClassroomApi.findCubeClassroom(
      new DataCubeClassroomRdo(this.searchQueryModel, pageModel)
    );

    if (offsetElementList.results) {
      runInAction(() => {
        this.cubeClassrooms = offsetElementList.results.map((data) => new DataCubeClassroomModel(data));
      });
    }

    return offsetElementList.totalCount;
  }

  @action
  async findPivotDatas(): Promise<number> {
    const offsetElementList = await this.cubeClassroomApi.findCubeClassroom(
      new DataCubeClassroomRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.pivotCubeClassrooms = offsetElementList.results.map((data) => new DataCubeClassroomModel(data));
    });

    return offsetElementList.totalCount;
  }

  @action
  async findExcelDatas(): Promise<number> {
    const offsetElementList = await this.cubeClassroomApi.findCubeClassroom(
      new DataCubeClassroomRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.cubeClassroomExcelDatas = offsetElementList.results.map(
        (excelData) => new DataCubeClassroomModel(excelData)
      );
    });

    return offsetElementList.totalCount;
  }

  @action
  setCubeClassroomQuery(data: DataCubeClassroomModel) {
    this.cubeClassroom = data;
  }

  @action
  clearCubeClassroomQuery() {
    this.cubeClassroom = new DataCubeClassroomModel();
  }
}

export function excelDownLoad(wbList: DataCubeClassroomExcelModel[], sheetName: string, fileName: string) {
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

DataCubeClassroomService.instance = new DataCubeClassroomService(DataCubeClassroomApi.instance);
export default DataCubeClassroomService;
