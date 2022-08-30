import { action, observable, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import moment from 'moment';
import _ from 'lodash';

import { PageModel } from 'shared/model';
import DataCommunityApi from '../apiclient/DataCommunityApi';
import { DataCommunityModel } from '../../model/DataCommunityModel';
import DataCommunityRdo from '../../model/DataCommunityRdo';
import XLSX from 'xlsx';
import { DataCommunityQueryModel } from '../../model/DataCommunityQueryModel';
import DataCommunityExcelModel from '../../model/DataCommunityExcelModel';

@autobind
export class DataCommunityService {
  //
  static instance: DataCommunityService;

  communityApi: DataCommunityApi;

  @observable
  searchQueryModel: DataCommunityQueryModel = new DataCommunityQueryModel();

  @observable
  community: DataCommunityModel = new DataCommunityModel();

  @observable
  communitys: DataCommunityModel[] = [];

  @observable
  communitysExcel: DataCommunityModel[] = [];

  constructor(communityApi: DataCommunityApi) {
    //
    this.communityApi = communityApi;
  }

  @action
  changeCommunityQueryProp(name: string, value: any) {
    //
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  changeCommunityProp(name: string, value: any) {
    //
    this.community = _.set(this.community, name, value);
  }

  @action
  changeCommunityModalQueryProp(name: string, value: any) {
    //
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  async findCommunitys(pageModel: PageModel): Promise<number> {
    //
    const offsetElementList = await this.communityApi.findCommunity(
      new DataCommunityRdo(this.searchQueryModel, pageModel)
    );

    if (offsetElementList.results) {
      runInAction(() => {
        this.communitys = offsetElementList.results.map((communitys) => new DataCommunityModel(communitys));
      });
    }

    return offsetElementList.totalCount;
  }

  @action
  async findExcelDataCommunitys(): Promise<number> {
    //
    const offsetElementList = await this.communityApi.findCommunity(
      new DataCommunityRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.communitysExcel = offsetElementList.results.map(
        (communitysExcel) => new DataCommunityModel(communitysExcel)
      );
    });

    return offsetElementList.totalCount;
  }

  @action
  setCommunityQuery(community: DataCommunityModel) {
    //
    this.community = community;
  }

  @action
  clearCommunityQuery() {
    this.community = new DataCommunityModel();
  }
}

export function excelDownLoad(wbList: DataCommunityExcelModel[], sheetName: string, fileName: string) {
  //
  const sheet = XLSX.utils.json_to_sheet(wbList);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, sheet, sheetName);

  const date = moment().format('YYYY-MM-DD_HH:mm:ss');
  fileName = `${fileName} -.${date}.xlsx`;
  XLSX.writeFile(wb, fileName, { compression: true });
  return fileName;
}

DataCommunityService.instance = new DataCommunityService(DataCommunityApi.instance);
export default DataCommunityService;
