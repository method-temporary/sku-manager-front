import { action, observable, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import _ from 'lodash';

import { NameValueList, IdName } from 'shared/model';

import ChannelApi from '../apiclient/ChannelApi';
import { CollegeModel } from '../../model/CollegeModel';
import { ChannelModel } from '../../model/ChannelModel';

@autobind
export default class ChannelService {
  constructor(channelApi: ChannelApi) {
    //
    this.channelApi = channelApi;
  }

  static instance: ChannelService;

  channelApi: ChannelApi;

  @observable
  college: CollegeModel = new CollegeModel();

  @observable
  colleges: CollegeModel[] = [];

  @observable
  channel: ChannelModel = new ChannelModel();

  @observable
  channels: ChannelModel[] = [];

  @observable
  newChannels: ChannelModel[] = [];

  @observable
  postQuery: { name: string; value: any; text: string } = {
    name: '',
    value: '',
    text: '',
  };

  @action
  addNewChannel() {
    const addChannels = this.newChannels.concat(new ChannelModel());
    this.newChannels = addChannels;
  }

  @action
  removeNewChannel(index: number) {
    const removeChannels = this.newChannels.slice(0, index).concat(this.newChannels.slice(index + 1));
    this.newChannels = removeChannels;
  }

  @action
  onChangeNewChannel(index: number, name: string, value: string | {}) {
    //
    this.newChannels = _.set(this.newChannels, `[${index}].${name}`, value);
  }

  @action
  onChangeChannelProps(index: number, name: string, value: string | {}) {
    //
    this.newChannels = _.set(this.newChannels, `[${index}].${name}`, value);
  }

  @action
  changePostQueryProps(paramName: string, paramValues: string | number, paramText: string) {
    this.postQuery = {
      ...this.postQuery,
      name: paramName,
      value: paramValues,
      text: paramText,
    };
  }

  @action
  async getCollegeInfo() {
    const colleges = await this.channelApi.getCollegeInfo();
    // console.log(colleges);
    return runInAction(() => (this.colleges = colleges));
  }

  @action
  async getChannelInfo(collegeId: string) {
    const channels = await this.channelApi.getChannelInfo(collegeId);
    // console.log(channels);
    return runInAction(() => (this.channels = channels));
  }

  @action
  async registerChannel(newChannel: any) {
    const channelId = await this.channelApi.registerChannel(newChannel);
    return channelId;
  }

  @action
  async findChannelByChannelId(channelId: string) {
    const channel = await this.channelApi.findChannelByChannelId(channelId);
    return runInAction(() => (this.channel = new ChannelModel(channel)));
  }

  @action
  async modifyChannel(channelId: string, nameValues: NameValueList) {
    const rtn = await this.channelApi.modifyChannel(channelId, nameValues);
    return rtn;
  }

  orderSaveChannel(collegeId: string, idNames: IdName[]) {
    const rtn = this.channelApi.orderSaveChannel(collegeId, idNames);
    return runInAction(() => rtn);
  }

  removeChannel(channelId: string, nameValues: NameValueList) {
    //
    this.channelApi.removeChannel(channelId, nameValues);
  }
}

Object.defineProperty(ChannelService, 'instance', {
  value: new ChannelService(ChannelApi.instance),
  writable: false,
  configurable: false,
});
