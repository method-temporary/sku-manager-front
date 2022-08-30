import { autobind } from '@nara.platform/accent';
import { action, observable, runInAction } from 'mobx';

import MemberApi from '_data/approval/members/api/MemberApi';
import { MemberModel } from '_data/approval/members/model';

@autobind
class MemberService {
  //
  static instance: MemberService;

  memberApi: MemberApi;

  @observable
  member: MemberModel = new MemberModel();

  @observable
  members: MemberModel[] = [];

  constructor(memberApi: MemberApi) {
    //
    this.memberApi = memberApi;
  }

  @action
  async findMemberById(id: string) {
    //
    const member = await this.memberApi.findMemberById(id);

    return runInAction(() => (this.member = new MemberModel(member)));
  }

  @action
  async findMemberByIds(ids: string[]) {
    //
    const members = await this.memberApi.findMemberByIds(ids);

    return runInAction(() => (this.members = members && members.map((member) => new MemberModel(member))));
  }

  @action
  async findMemberByAudienceId(id: string) {
    //
    const member = await this.memberApi.findMemberByAudienceId(id);

    return runInAction(() => (this.member = new MemberModel(member)));
  }

  @action
  async findMemberByIdsExcel(ids: string[]) {
    const members = await this.memberApi.findMemberByIdsExcel(ids);

    return runInAction(() => (this.members = members && members.map((member) => new MemberModel(member))));
  }
}

MemberService.instance = new MemberService(MemberApi.instance);
export default MemberService;
