import { computed, decorate, observable } from 'mobx';
import moment from 'moment';
import { DramaEntity, PatronKey } from '@nara.platform/accent';
import { AppliedResult } from './AppliedResult';

export class LinkedInTempModel implements DramaEntity {
  id: string = '';
  entityVersion: number = 0;
  patronKey: PatronKey = {} as PatronKey;

  name: string = ''; //성명
  email: string = ''; //e-mail
  cubeName: string = ''; //강의명(학습카드명)
  completedTime: number = 0; //학습완료시간
  result: string = 'Fail'; //학습처리상태(Fail, Success)
  detail: AppliedResult = AppliedResult.Blank;
  appliedTime: number = 0; //학습완료처리 업데이트 시간

  constructor(linkedInTemp?: LinkedInTempModel) {
    if (linkedInTemp) {
      Object.assign(this, { ...linkedInTemp });
    }
  }

  // static asCdo(linkedInTemp: LinkedInTempModel): LinkedInTempCdoModel {
  //   //
  //   return {
  //     name: linkedInTemp.name,
  //     email: linkedInTemp.email,
  //     cubeName: linkedInTemp.cubeName,
  //     completedTime: linkedInTemp.completedTime,
  //     result: linkedInTemp.result,
  //   };
  // }

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

decorate(LinkedInTempModel, {
  id: observable,
  entityVersion: observable,
  patronKey: observable,
  name: observable,
  email: observable,
  cubeName: observable,
  completedTime: observable,
  result: observable,
  appliedTime: observable,
});
