import { observable, action, computed, runInAction } from 'mobx';
import { ObservableArray } from 'mobx/lib/internal';
import { Moment } from 'moment';
import _ from 'lodash';

import { reactAutobind } from '@nara.platform/accent';

import { NaOffsetElementList, getEmptyNaOffsetElementList, NameValueList } from 'shared/model';

import Community, { getEmptyCommunity } from '../model/Community';
import { CommunityQueryModel } from '../model/CommunityQueryModel';
import CommunityCdoModel from '../model/CommunityCdoModel';
import { findCommunityAdmin } from '../api/CommunityApi';
import { findAllCourseByCommunityId, updateCoursePlan } from '../api/CourseApi';
import { CommunityCourseMappingViewModel, parseCommunityCourse } from '../viewModel/CommunityCourseMappingViewModel';

@reactAutobind
class CommunityStore {
  static instance: CommunityStore;

  constructor() {
    this.clearCommunityCdo = this.clearCommunityCdo.bind(this);
  }

  @observable
  innerCommunityList: NaOffsetElementList<Community> = getEmptyNaOffsetElementList();

  @action
  setCommunityList(next: NaOffsetElementList<Community>) {
    this.innerCommunityList = next;
  }

  @computed
  get communityList() {
    return this.innerCommunityList;
  }

  @observable
  innerSelected: Community = getEmptyCommunity();

  @action
  select(next: Community) {
    this.innerSelected = next;
  }

  @action
  clear() {
    this.innerSelected = getEmptyCommunity();
  }

  @computed
  get selected() {
    return this.innerSelected;
  }

  @observable
  communityQuery: CommunityQueryModel = new CommunityQueryModel();

  @action
  clearCommunityQuery() {
    this.communityQuery = new CommunityQueryModel();
  }

  @action
  setCommunityQuery(query: CommunityQueryModel, name: string, value: string | Moment | number | undefined) {
    this.communityQuery = _.set(query, name, value);
  }

  @computed
  get selectedCommunityQuery() {
    return this.communityQuery;
  }

  @observable
  communityCdo: CommunityCdoModel = new CommunityCdoModel();

  @action
  clearCommunityCdo() {
    this.communityCdo = new CommunityCdoModel();
  }

  @action
  setCommunityCdo(query: CommunityCdoModel, name: string, value: string | Moment | number | undefined) {
    this.communityCdo = _.set(query, name, value);
  }

  @action
  selectComunityCdo(next: CommunityCdoModel) {
    this.communityCdo = next;
  }

  @computed
  get selectedCommunityCdo() {
    return this.communityCdo;
  }

  @observable
  innerCommunityCourseMappingViewModel: CommunityCourseMappingViewModel[] = [];

  @action
  setCommunityCourseMappingViewModel(communityCourseMappingViewModel: CommunityCourseMappingViewModel[]) {
    if (JSON.stringify([...this.communityCourseMappingViewModel]) === JSON.stringify(communityCourseMappingViewModel)) {
      return;
    }
    (this.innerCommunityCourseMappingViewModel as unknown as ObservableArray<CommunityCourseMappingViewModel>).clear();
    communityCourseMappingViewModel.forEach((c) => this.innerCommunityCourseMappingViewModel.push(c));
  }

  @computed
  get communityCourseMappingViewModel() {
    return this.innerCommunityCourseMappingViewModel;
  }

  async requestCommunityCourseMappingViewModel(communityId: string) {
    const communityCards = await findAllCourseByCommunityId(communityId);
    if (communityCards === undefined) {
      this.setCommunityCourseMappingViewModel([]);
      return;
    }
    const communityCourseMappingViewModel = communityCards.map(parseCommunityCourse);
    this.setCommunityCourseMappingViewModel(communityCourseMappingViewModel);
  }

  async deleteCommunityCourse(communityId: string, coursePlanId: string) {
    const nameValueList: NameValueList = new NameValueList();
    nameValueList.nameValues.push({ name: 'communityId', value: '' });
    await updateCoursePlan(coursePlanId, nameValueList);
    await this.requestCommunityCourseMappingViewModel(communityId);
  }

  // @action
  // changeCommunityQueryProps(
  //   name: string,
  //   value: string | Moment | number | undefined
  // ) {
  //   //
  //   // if (name === 'college' && value === 'All') {
  //   //   this.communityQuery = _.set(this.communityQuery, name, '');
  //   //   this.communityQuery = _.set(this.communityQuery, 'channel', '');
  //   // }
  //   if (value === 'All') value = '';
  //   //this.communityQuery = _.set(this.communityQuery, name, value);
  //   console.log(this.selected);
  // }
  @observable
  community: Community = {};

  @action
  async findCommunityAdmin(communityId: string): Promise<void> {
    //
    const community = await findCommunityAdmin(communityId);
    runInAction(() => {
      this.community = Object.assign(this.community, { ...community });
    });
  }
}

CommunityStore.instance = new CommunityStore();

export default CommunityStore;
