import { action, observable, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import moment from 'moment';
import _ from 'lodash';

import { PageModel } from 'shared/model';
import DataChannelApi from '../apiclient/DataChannelApi';
import { DataChannelModel } from '../../model/DataChannelModel';
import DataChannelRdo from '../../model/DataChannelRdo';
import XLSX from 'xlsx';
import { DataChannelQueryModel } from '../../model/DataChannelQueryModel';
import DataChannelExcelModel from '../../model/DataChannelExcelModel';

@autobind
export class DataChannelService {
  //
  static instance: DataChannelService;

  channelApi: DataChannelApi;

  @observable
  searchQueryModel: DataChannelQueryModel = new DataChannelQueryModel();

  @observable
  channel: DataChannelModel = new DataChannelModel();

  @observable
  channels: DataChannelModel[] = [];

  @observable
  channelsExcel: DataChannelModel[] = [];

  constructor(channelApi: DataChannelApi) {
    //
    this.channelApi = channelApi;
  }

  @action
  changeChannelQueryProp(name: string, value: any) {
    //
    this.searchQueryModel = _.set(this.searchQueryModel, name, value);
  }

  @action
  changeChannelProp(name: string, value: any) {
    //
    this.channel = _.set(this.channel, name, value);
  }

  @action
  changeChannelModalQueryProp(name: string, value: any) {
    //
    if (name == 'College' || name == 'Channel') {
      //강제로 비워지지 않도록
      // console.log("Modal=>"+name +"::"+ value);
    } else {
      this.searchQueryModel = _.set(this.searchQueryModel, name, value);
    }
  }

  @action
  async findChannels(pageModel: PageModel): Promise<number> {
    //
    const offsetElementList = await this.channelApi.findChannel(new DataChannelRdo(this.searchQueryModel, pageModel));

    if (offsetElementList.results) {
      runInAction(() => {
        this.channels = offsetElementList.results.map((channels) => new DataChannelModel(channels));
      });
    }

    return offsetElementList.totalCount;
  }

  @action
  async findExcelDataChannels(): Promise<number> {
    //
    const offsetElementList = await this.channelApi.findChannel(
      new DataChannelRdo(this.searchQueryModel, new PageModel(0, 99999999))
    );

    runInAction(() => {
      this.channelsExcel = offsetElementList.results.map((channelsExcel) => new DataChannelModel(channelsExcel));
    });

    return offsetElementList.totalCount;
  }

  @action
  setChannelQuery(channel: DataChannelModel) {
    //
    this.channel = channel;
  }

  @action
  clearChannelQuery() {
    this.channel = new DataChannelModel();
  }
}

export function excelDownLoad(wbList: DataChannelExcelModel[], sheetName: string, fileName: string) {
  //
  const sheet = XLSX.utils.json_to_sheet(wbList);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, sheet, sheetName);

  const date = moment().format('YYYY-MM-DD_HH:mm:ss');
  fileName = `${fileName} -.${date}.xlsx`;
  XLSX.writeFile(wb, fileName, { compression: true });
  return fileName;
}

DataChannelService.instance = new DataChannelService(DataChannelApi.instance);
export default DataChannelService;
