import { computed, decorate, observable } from 'mobx';
import moment from 'moment';
import { DramaEntity, PatronKey } from '@nara.platform/accent';
import { AppliedResult } from './AppliedResult';
import { MemberTempCdoModel } from './MemberTempCdoModel';

export class MemberTempModel implements DramaEntity {
  id: string = '';
  entityVersion: number = 0;
  patronKey: PatronKey = {} as PatronKey;

  name: string = ''; //성명
  email: string = ''; //e-mail
  cardName: string = ''; //강의명(학습카드명)
  completedTime: number = 0; //학습완료시간
  result: string = 'Fail'; //학습처리상태(Fail, Success)
  //detail: AppliedResult = AppliedResult.Blank;
  detail: string = '';
  appliedTime: number = 0; //학습완료처리 업데이트 시간

  registerTime: number = 0; //멤버 등록 시간

  company: string = ''; //소속사
  team: string = ''; //소속 조직(팀)
  nickName: string = ''; //닉네임

  memberId: string = ''; //memberId

  constructor(memberTemp?: MemberTempModel) {
    if (memberTemp) {
      Object.assign(this, { ...memberTemp });
    }
  }

  static asCdo(memberTemp: MemberTempModel): MemberTempCdoModel {
    //
    return <MemberTempCdoModel>{
      name: memberTemp.name,
      email: memberTemp.email,
      cardName: memberTemp.cardName,
      completedTime: memberTemp.completedTime,
      company: memberTemp.company,
      team: memberTemp.team,
      nickName: memberTemp.nickName,
      memberId: memberTemp.memberId,
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

decorate(MemberTempModel, {
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
  memberId: observable,
});
