import { observable, action, computed } from 'mobx';
import { Moment } from 'moment';
import _ from 'lodash';
import { NaOffsetElementList, getEmptyNaOffsetElementList } from 'shared/model';
import Group, { getEmptyGroup } from '../model/Group';
import { GroupQueryModel } from '../model/GroupQueryModel';
import GroupCdoModel from '../model/GroupCdoModel';

class GroupStore {
  static instance: GroupStore;

  constructor() {
    this.clearGroupCdo = this.clearGroupCdo.bind(this);
  }

  @observable
  innerGroupList: NaOffsetElementList<Group> = getEmptyNaOffsetElementList();

  @action
  setGroupList(next: NaOffsetElementList<Group>) {
    this.innerGroupList = next;
  }

  @computed
  get groupList() {
    return this.innerGroupList;
  }

  @observable
  innerSelected: Group = getEmptyGroup();

  @action
  select(next: Group) {
    this.innerSelected = next;
  }

  @computed
  get selected() {
    return this.innerSelected;
  }

  @observable
  groupQuery: GroupQueryModel = new GroupQueryModel();

  @action
  clearGroupQuery() {
    this.groupQuery = new GroupQueryModel();
  }

  @action
  setGroupQuery(query: GroupQueryModel, name: string, value: string | Moment | number | undefined) {
    this.groupQuery = _.set(query, name, value);
  }

  @computed
  get selectedGroupQuery() {
    return this.groupQuery;
  }

  @observable
  groupCdo: GroupCdoModel = new GroupCdoModel();

  @action
  clearGroupCdo() {
    this.groupCdo = new GroupCdoModel();
  }

  @action
  setGroupCdo(query: GroupCdoModel, name: string, value: string | Moment | number | undefined) {
    this.groupCdo = _.set(query, name, value);
  }

  @action
  selectGroupCdo(next: GroupCdoModel) {
    this.groupCdo = next;
  }

  @computed
  get selectedGroupCdo() {
    return this.groupCdo;
  }

  // @action
  // changeGroupQueryProps(
  //   name: string,
  //   value: string | Moment | number | undefined
  // ) {
  //   //
  //   // if (name === 'college' && value === 'All') {
  //   //   this.groupQuery = _.set(this.groupQuery, name, '');
  //   //   this.groupQuery = _.set(this.groupQuery, 'channel', '');
  //   // }
  //   if (value === 'All') value = '';
  //   //this.groupQuery = _.set(this.groupQuery, name, value);
  //   console.log(this.selected);
  // }
}

GroupStore.instance = new GroupStore();

export default GroupStore;
