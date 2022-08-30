import { action, observable, runInAction } from 'mobx';
import { autobind } from '@nara.platform/accent';
import _ from 'lodash';

import DataSelectCallApi from '../apiclient/DataSelectCallApi';
import { DataSelectCallModel } from '../../model/DataSelectCallModel';

@autobind
export class DataSelectCallService {
  //
  static instance: DataSelectCallService;

  communityApi: DataSelectCallApi;

  @observable
  community: DataSelectCallModel = new DataSelectCallModel();

  @observable
  communitys: DataSelectCallModel[] = [];

  @observable
  communityOptions: any[] = [];

  constructor(communityApi: DataSelectCallApi) {
    //
    this.communityApi = communityApi;
  }

  @action
  changeCommunityProp(name: string, value: any) {
    //
    this.community = _.set(this.community, name, value);
  }

  @action
  async findCommunitys() {
    this.clearCommunityOptions();
    const selectData = await this.communityApi.findAllCommunity();
    // console.log('findAvailableCompany() companies=', companies);
    runInAction(() => {
      const loadCompanies = selectData.map((result) => new DataSelectCallModel(result)) || [];

      this.communitys = loadCompanies;
      this.makeCommunityOptions(loadCompanies);
    });
  }

  @action
  makeCommunityOptions(modal: DataSelectCallModel[]) {
    this.communityOptions.push({ key: '', text: '전체', value: '' });

    modal.map((community, index) => {
      this.communityOptions.push({ key: community.select_id, text: community.select_name, value: community.select_id });
    });

    return this.communityOptions;
  }

  clearCommunityOptions() {
    this.communityOptions = [];
  }

  @action
  setCommunityQuery(community: DataSelectCallModel) {
    //
    this.community = community;
  }

  @action
  clearCommunityQuery() {
    this.community = new DataSelectCallModel();
  }
}

DataSelectCallService.instance = new DataSelectCallService(DataSelectCallApi.instance);
export default DataSelectCallService;
