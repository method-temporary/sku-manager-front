import { action, observable, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import moment from 'moment';
import _ from 'lodash';
import XLSX from 'xlsx';
import { PageModel } from 'shared/model';

import DataMetaBadgeApi from '../apiClient/DataMetaBadgeApi';
import DataMetaBadgeModel from 'dataSearch/metaBadge/model/DataMetaBadgeModel';
import DataMetaBadgeExcelModel from 'dataSearch/metaBadge/model/DataMetaBadgeExcelModel';
import { DataMetaBadgeQueryModel } from 'dataSearch/metaBadge/model/DataMetaBadgeQueryModel';
import DataMetaBadgeRdo from 'dataSearch/metaBadge/model/DataMetaBadgeRdo';

@autobind
export class DataMetaBadgeService {
  static instance: DataMetaBadgeService;

  metaBadgeApi: DataMetaBadgeApi;

  @observable
  queryModel: DataMetaBadgeQueryModel = new DataMetaBadgeQueryModel();

  @observable
  metaBadge: DataMetaBadgeModel = new DataMetaBadgeModel();

  @observable
  metaBades: DataMetaBadgeModel[] = [];

  @observable
  metaBadeExcelDatas: DataMetaBadgeModel[] = [];

  constructor(api: DataMetaBadgeApi) {
    this.metaBadgeApi = api;
  }

  @action
  changeDataQueryProp(name: string, value: any) {
    this.queryModel = _.set(this.queryModel, name, value);
  }

  @action
  changeDataProp(name: string, value: any) {
    this.metaBadge = _.set(this.metaBadge, name, value);
  }

  @action
  changeDataModalQueryProp(name: string, value: any) {
    this.queryModel = _.set(this.queryModel, name, value);
  }

  @action
  async findMetaBadges(pageModel: PageModel): Promise<number> {
    const offsetElementList = await this.metaBadgeApi.findMetaBadge(new DataMetaBadgeRdo(this.queryModel, pageModel));

    if (offsetElementList.results) {
      runInAction(() => {
        this.metaBades = offsetElementList.results.map((data) => new DataMetaBadgeModel(data));
      });
    }

    return offsetElementList.totalCount;
  }

  @action
  async findExcelDatas(): Promise<number> {
    const offsetElementList = await this.metaBadgeApi.findMetaBadge(
      new DataMetaBadgeRdo(this.queryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.metaBadeExcelDatas = offsetElementList.results.map((data) => new DataMetaBadgeModel(data));
    });

    return offsetElementList.totalCount;
  }

  @action
  setMetaBadgeQuery(data: DataMetaBadgeModel) {
    this.metaBadge = data;
  }

  @action
  clearMetaBadgeQuery() {
    this.metaBadge = new DataMetaBadgeModel();
  }
}

export function excelDownLoad(wbList: DataMetaBadgeExcelModel[], sheetName: string, fileName: string) {
  const sheet = XLSX.utils.json_to_sheet(wbList);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, sheet, sheetName);

  const date = moment().format('YYYY-MM-DD_HH:mm:ss');
  fileName = `${fileName} -.${date}.xlsx`;
  XLSX.writeFile(wb, fileName, { compression: true });
  return fileName;
}

DataMetaBadgeService.instance = new DataMetaBadgeService(DataMetaBadgeApi.instance);
export default DataMetaBadgeService;
