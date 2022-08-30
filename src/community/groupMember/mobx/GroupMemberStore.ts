import { observable, action, computed } from 'mobx';
import { Moment } from 'moment';
import _ from 'lodash';
import { NaOffsetElementList, getEmptyNaOffsetElementList } from 'shared/model';
import GroupMember, { getEmptyGroupMember } from '../model/GroupMember';
import { GroupMemberQueryModel } from '../model/GroupMemberQueryModel';
import GroupMemberCdoModel from '../model/GroupMemberCdoModel';

class GroupMemberStore {
  static instance: GroupMemberStore;

  constructor() {
    this.clearGroupMemberCdo = this.clearGroupMemberCdo.bind(this);
  }

  @observable
  innerGroupMemberList: NaOffsetElementList<GroupMember> = getEmptyNaOffsetElementList();

  @action
  setGroupMemberList(next: NaOffsetElementList<GroupMember>) {
    this.innerGroupMemberList = next;
  }

  @computed
  get groupMemberList() {
    return this.innerGroupMemberList;
  }

  @observable
  innerSelected: GroupMember = getEmptyGroupMember();

  @action
  select(next: GroupMember) {
    this.innerSelected = next;
  }

  @computed
  get selected() {
    return this.innerSelected;
  }

  @observable
  groupMemberQuery: GroupMemberQueryModel = new GroupMemberQueryModel();

  @action
  clearGroupMemberQuery() {
    this.groupMemberQuery = new GroupMemberQueryModel();
  }

  @action
  setGroupMemberQuery(query: GroupMemberQueryModel, name: string, value: string | Moment | number | undefined) {
    this.groupMemberQuery = _.set(query, name, value);
  }

  @computed
  get selectedGroupMemberQuery() {
    return this.groupMemberQuery;
  }

  @observable
  groupMemberCdo: GroupMemberCdoModel = new GroupMemberCdoModel();

  @action
  clearGroupMemberCdo() {
    this.groupMemberCdo = new GroupMemberCdoModel();
  }

  @action
  setGroupMemberCdo(query: GroupMemberCdoModel, name: string, value: string | Moment | number | undefined) {
    this.groupMemberCdo = _.set(query, name, value);
  }

  @action
  selectGroupMemberCdo(next: GroupMemberCdoModel) {
    this.groupMemberCdo = next;
  }

  @computed
  get selectedGroupMemberCdo() {
    return this.groupMemberCdo;
  }

  // @action
  // changeGroupMemberQueryProps(
  //   name: string,
  //   value: string | Moment | number | undefined
  // ) {
  //   //
  //   // if (name === 'college' && value === '전체') {
  //   //   this.groupMemberQuery = _.set(this.groupMemberQuery, name, '');
  //   //   this.groupMemberQuery = _.set(this.groupMemberQuery, 'channel', '');
  //   // }
  //   if (value === '전체') value = '';
  //   //this.groupMemberQuery = _.set(this.groupMemberQuery, name, value);
  //   console.log(this.selected);
  // }
}

GroupMemberStore.instance = new GroupMemberStore();

export default GroupMemberStore;
