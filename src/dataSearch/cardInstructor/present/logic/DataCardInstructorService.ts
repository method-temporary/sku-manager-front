import { action, observable, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import moment from 'moment';
import _ from 'lodash';

import DataCardInstructorModel from 'dataSearch/cardInstructor/model/DataCardInstructorModel';
import DataCardInstructorExcelModel from 'dataSearch/cardInstructor/model/DataCardInstructorExcelModel';
import DataCardInstructorRdo from 'dataSearch/cardInstructor/model/DataCardInstructorRdo';
import { DataCardInstructorQueryModel } from 'dataSearch/cardInstructor/model/DataCardInstructorQueryModel';

import DataCardInstructorApi from '../apiClient/DataCardInstructorApi';
import { PageModel } from 'shared/model';
import XLSX from 'xlsx';

@autobind
export class DataCardInstructorService {
  static instance: DataCardInstructorService;

  cardInstructorApi: DataCardInstructorApi;

  @observable
  searchQueryModel: DataCardInstructorQueryModel = new DataCardInstructorQueryModel();

  @observable
  cardInstructor: DataCardInstructorModel = new DataCardInstructorModel();

  @observable
  cardInstructors: DataCardInstructorModel[] = [];

  @observable
  pivotCardInstructors: DataCardInstructorModel[] = [];

  @observable
  cardInstructorExcelDatas: DataCardInstructorModel[] = [];

  constructor(api: DataCardInstructorApi) {
    this.cardInstructorApi = api;
  }

  @action
  changeDataQueryProp(name: string, value: any) {
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  changeDataProp(name: string, value: any) {
    this.cardInstructor = _.set(this.cardInstructor, name, value);
  }

  @action
  changeDataModalQueryProp(name: string, value: any) {
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  async findCardInstructor(pageModel: PageModel): Promise<number> {
    const offsetElementList = await this.cardInstructorApi.findCardInstructor(
      new DataCardInstructorRdo(this.searchQueryModel, pageModel)
    );

    if (offsetElementList.results) {
      runInAction(() => {
        this.cardInstructors = offsetElementList.results.map((data) => new DataCardInstructorModel(data));
      });
    }

    return offsetElementList.totalCount;
  }

  @action
  async findPivotDatas(): Promise<number> {
    const offsetElementList = await this.cardInstructorApi.findCardInstructor(
      new DataCardInstructorRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.pivotCardInstructors = offsetElementList.results.map((data) => new DataCardInstructorModel(data));
    });

    return offsetElementList.totalCount;
  }

  @action
  async findExcelDatas(): Promise<number> {
    const offsetElementList = await this.cardInstructorApi.findCardInstructor(
      new DataCardInstructorRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.cardInstructorExcelDatas = offsetElementList.results.map(
        (excelData) => new DataCardInstructorModel(excelData)
      );
    });

    return offsetElementList.totalCount;
  }

  @action
  setCardInstructorQuery(data: DataCardInstructorModel) {
    this.cardInstructor = data;
  }

  @action
  clearCardInstructorQuery() {
    this.cardInstructor = new DataCardInstructorModel();
  }
}

export function excelDownLoad(wbList: DataCardInstructorExcelModel[], sheetName: string, fileName: string) {
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

DataCardInstructorService.instance = new DataCardInstructorService(DataCardInstructorApi.instance);
export default DataCardInstructorService;
