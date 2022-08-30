import { observable, action, computed } from 'mobx';
import { Moment } from 'moment';
import _ from 'lodash';
import { NaOffsetElementList, getEmptyNaOffsetElementList } from 'shared/model';
import Member, { getEmptyMember } from '../model/Member';
import { MemberQueryModel } from '../model/MemberQueryModel';
import MemberCdoModel from '../model/MemberCdoModel';

class MemberStore {
  static instance: MemberStore;

  constructor() {
    this.clearMemberCdo = this.clearMemberCdo.bind(this);
  }

  @observable
  innerMemberList: NaOffsetElementList<Member> = getEmptyNaOffsetElementList();

  @action
  setMemberList(next: NaOffsetElementList<Member>) {
    this.innerMemberList = next;
  }

  @computed
  get memberList() {
    return this.innerMemberList;
  }

  @observable
  innerSelectedMemberList: (string | undefined)[] = [];

  @action
  setSelectedMemeberList(next: (string | undefined)[]) {
    this.innerSelectedMemberList = next;
  }

  @computed
  get selectedMemberList() {
    return this.innerSelectedMemberList;
  }

  @observable
  innerSelected: Member = getEmptyMember();

  @action
  select(next: Member) {
    this.innerSelected = next;
  }

  @computed
  get selected() {
    return this.innerSelected;
  }

  @observable
  memberQuery: MemberQueryModel = new MemberQueryModel();

  @action
  clearMemberQuery() {
    this.memberQuery = new MemberQueryModel();
  }

  @action
  setMemberQuery(query: MemberQueryModel, name: string, value: string | Moment | number | undefined) {
    this.memberQuery = _.set(query, name, value);
  }

  @computed
  get selectedMemberQuery() {
    return this.memberQuery;
  }

  @observable
  memberCdo: MemberCdoModel = new MemberCdoModel();

  @action
  clearMemberCdo() {
    this.memberCdo = new MemberCdoModel();
  }

  @action
  setMemberCdo(query: MemberCdoModel, name: string, value: string | Moment | number | undefined) {
    this.memberCdo = _.set(query, name, value);
  }

  @action
  selectMemberCdo(next: MemberCdoModel) {
    this.memberCdo = next;
  }

  @computed
  get selectedMemberCdo() {
    return this.memberCdo;
  }

  // @action
  // changeMemberQueryProps(
  //   name: string,
  //   value: string | Moment | number | undefined
  // ) {
  //   //
  //   // if (name === 'college' && value === '전체') {
  //   //   this.memberQuery = _.set(this.memberQuery, name, '');
  //   //   this.memberQuery = _.set(this.memberQuery, 'channel', '');
  //   // }
  //   if (value === '전체') value = '';
  //   //this.memberQuery = _.set(this.memberQuery, name, value);
  //   console.log(this.selected);
  // }
}

MemberStore.instance = new MemberStore();

export default MemberStore;
