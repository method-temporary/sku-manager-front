import { computed, decorate, observable } from 'mobx';
import moment from 'moment';
import { DramaEntity, PatronKey } from '@nara.platform/accent';
import { AppliedResult } from './AppliedResult';
import { GroupMemberTempCdoModel } from './GroupMemberTempCdoModel';

export class GroupMemberTempModel implements DramaEntity {
  id: string = '';
  entityVersion: number = 0;
  patronKey: PatronKey = {} as PatronKey;

  name: string = ''; //성명
  email: string = ''; //e-mail
  cardName: string = ''; //강의명(학습카드명)
  completedTime: number = 0; //학습완료시간
  result: string = 'Fail'; //학습처리상태(Fail, Success)
  detail: AppliedResult = AppliedResult.Blank;
  appliedTime: number = 0; //학습완료처리 업데이트 시간

  registerTime: number = 0; //멤버 등록 시간

  company: string = ''; //소속사
  team: string = ''; //소속 조직(팀)
  nickName: string = ''; //닉네임

  groupMemberId: string = ''; //groupMemberId

  constructor(groupMemberTemp?: GroupMemberTempModel) {
    if (groupMemberTemp) {
      Object.assign(this, { ...groupMemberTemp });
    }
  }

  static asCdo(groupMemberTemp: GroupMemberTempModel): GroupMemberTempCdoModel {
    //
    return <GroupMemberTempCdoModel>{
      name: groupMemberTemp.name,
      email: groupMemberTemp.email,
      cardName: groupMemberTemp.cardName,
      completedTime: groupMemberTemp.completedTime,
      company: groupMemberTemp.company,
      team: groupMemberTemp.team,
      nickName: groupMemberTemp.nickName,
      groupMemberId: groupMemberTemp.groupMemberId,
    };
  }

  @computed
  get getCompletedTimeStr() {
    //
    return moment(this.completedTime).format('YYYY.MM.DD HH:mm');
  }

  @computed
  get getAppliedTimeStr() {
    //
    if (this.appliedTime > 0) {
      return moment(this.appliedTime).format('YYYY.MM.DD HH:mm');
    } else {
      return '';
    }
  }
}

decorate(GroupMemberTempModel, {
  id: observable,
  entityVersion: observable,
  patronKey: observable,
  name: observable,
  email: observable,
  cardName: observable,
  completedTime: observable,
  result: observable,
  appliedTime: observable,
  company: observable,
  team: observable,
  nickName: observable,
  groupMemberId: observable,
});
