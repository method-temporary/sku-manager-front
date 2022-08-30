import { action, observable, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import moment from 'moment';
import _ from 'lodash';

import { PageModel } from 'shared/model';
import DataBadgeApi from '../apiclient/DataBadgeApi';
import { DataBadgeModel } from '../../model/DataBadgeModel';
import DataBadgeRdo from '../../model/DataBadgeRdo';
import XLSX from 'xlsx';
import { DataBadgeQueryModel } from '../../model/DataBadgeQueryModel';
import DataBadgeExcelModel from '../../model/DataBadgeExcelModel';

@autobind
export class DataBadgeService {
  //
  static instance: DataBadgeService;

  badgeApi: DataBadgeApi;

  @observable
  searchQueryModel: DataBadgeQueryModel = new DataBadgeQueryModel();

  @observable
  badge: DataBadgeModel = new DataBadgeModel();

  @observable
  badges: DataBadgeModel[] = [];

  @observable
  badgesExcel: DataBadgeModel[] = [];

  constructor(badgeApi: DataBadgeApi) {
    //
    this.badgeApi = badgeApi;
  }

  @action
  changeBadgeQueryProp(name: string, value: any) {
    //
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  changeBadgeProp(name: string, value: any) {
    //
    this.badge = _.set(this.badge, name, value);
  }

  @action
  changeBadgeModalQueryProp(name: string, value: any) {
    //
    // console.log('===>' + name + ':' + value);
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  async findBadges(pageModel: PageModel): Promise<number> {
    //
    const offsetElementList = await this.badgeApi.findBadges(new DataBadgeRdo(this.searchQueryModel, pageModel));

    if (offsetElementList.results) {
      runInAction(() => {
        this.badges = offsetElementList.results.map((badges) => new DataBadgeModel(badges));
      });
    }

    return offsetElementList.totalCount;
  }

  @action
  async findExcelDataBadges(): Promise<number> {
    //
    const offsetElementList = await this.badgeApi.findBadges(
      new DataBadgeRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.badgesExcel = offsetElementList.results.map((badgesExcel) => new DataBadgeModel(badgesExcel));
    });

    return offsetElementList.totalCount;
  }

  @action
  setBadgeQuery(badge: DataBadgeModel) {
    //
    this.badge = badge;
  }

  @action
  clearBadgeQuery() {
    this.badge = new DataBadgeModel();
  }
}

export function excelDownLoad(wbList: DataBadgeExcelModel[], sheetName: string, fileName: string) {
  //
  const sheet = XLSX.utils.json_to_sheet(wbList);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, sheet, sheetName);

  const date = moment().format('YYYY-MM-DD_HH:mm:ss');
  fileName = `${fileName} - .${date}.xlsx`;
  XLSX.writeFile(wb, fileName, { compression: true });
  return fileName;
}

DataBadgeService.instance = new DataBadgeService(DataBadgeApi.instance);
export default DataBadgeService;
