import { action, observable, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import moment from 'moment';
import _ from 'lodash';

import DataCardMappingListModel from 'dataSearch/cardMappingList/model/DataCardMappingListModel';
import DataCardMappingListExcelModel from 'dataSearch/cardMappingList/model/DataCardMappingListExcelModel';
import DataCardMappingListRdo from 'dataSearch/cardMappingList/model/DataCardMappingListRdo';
import { DataCardMappingListQueryModel } from 'dataSearch/cardMappingList/model/DataCardMappingListQueryModel';

import DataCardMappingListApi from '../apiClient/DataCardMappingListApi';
import { PageModel } from 'shared/model';
import XLSX from 'xlsx';

@autobind
export class DataCardMappingListService {
  static instance: DataCardMappingListService;

  cardMappingListApi: DataCardMappingListApi;

  @observable
  searchQueryModel: DataCardMappingListQueryModel = new DataCardMappingListQueryModel();

  @observable
  cardMappingList: DataCardMappingListModel = new DataCardMappingListModel();

  @observable
  cardMappingLists: DataCardMappingListModel[] = [];

  @observable
  pivotCardMappingLists: DataCardMappingListModel[] = [];

  @observable
  cardMappingListExcelDatas: DataCardMappingListModel[] = [];

  constructor(api: DataCardMappingListApi) {
    this.cardMappingListApi = api;
  }

  @action
  changeDataQueryProp(name: string, value: any) {
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  changeDataProp(name: string, value: any) {
    this.cardMappingList = _.set(this.cardMappingList, name, value);
  }

  @action
  changeDataModalQueryProp(name: string, value: any) {
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  async findCardMappingLists(pageModel: PageModel): Promise<number> {
    const offsetElementList = await this.cardMappingListApi.findCardMappingList(
      new DataCardMappingListRdo(this.searchQueryModel, pageModel)
    );

    if (offsetElementList.results) {
      runInAction(() => {
        this.cardMappingLists = offsetElementList.results.map((data) => new DataCardMappingListModel(data));
      });
    }

    return offsetElementList.totalCount;
  }

  @action
  async findPivotDatas(): Promise<number> {
    const offsetElementList = await this.cardMappingListApi.findCardMappingList(
      new DataCardMappingListRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.pivotCardMappingLists = offsetElementList.results.map((data) => new DataCardMappingListModel(data));
    });

    return offsetElementList.totalCount;
  }

  @action
  async findExcelDatas(): Promise<number> {
    const offsetElementList = await this.cardMappingListApi.findCardMappingList(
      new DataCardMappingListRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.cardMappingListExcelDatas = offsetElementList.results.map(
        (excelData) => new DataCardMappingListModel(excelData)
      );
    });

    return offsetElementList.totalCount;
  }

  @action
  setCardMappingListQuery(data: DataCardMappingListModel) {
    this.cardMappingList = data;
  }

  @action
  clearCardMappingListQuery() {
    this.cardMappingList = new DataCardMappingListModel();
  }
}

export function excelDownLoad(wbList: DataCardMappingListExcelModel[], sheetName: string, fileName: string) {
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

DataCardMappingListService.instance = new DataCardMappingListService(DataCardMappingListApi.instance);
export default DataCardMappingListService;
