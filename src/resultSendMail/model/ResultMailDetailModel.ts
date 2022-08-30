import { computed, decorate, observable } from 'mobx';
import moment from 'moment';
import { DramaEntity, PatronKey } from '@nara.platform/accent';
import { SelectType } from 'shared/model';

export class ResultMailDetailModel implements DramaEntity {
  id: string = '';
  entityVersion: number = 0;
  patronKey: PatronKey = {} as PatronKey;

  sendId: string = ''; // 상세조회 시 조건
  dispatcherName: string = ''; // 발신자 이름
  dispatcherEmail: string = ''; // 발신자 이메일
  receiverName: string = ''; // 수신자 이름
  receiverEmail: string = ''; // 수신자 이메일
  mailTitle: string = ''; // 타이틀
  cubeName: string = ''; // 과정명
  type: string = ''; // 검색구분
  typeName: string = '';
  sendStatus: boolean = true; // 전송결과
  createDate: number = 0; // 전송일

  constructor(resultMail?: ResultMailDetailModel) {
    Object.assign(this, {
      ...resultMail,
      typeName: SelectType.mailOptions.find((item) => {
        return resultMail?.type === item.value;
      })?.text,
    });
  }

  @computed
  get getCreateDate() {
    return (this.createDate && this.createDate !== 0 && moment(this.createDate).format('YYYY.MM.DD HH:mm:ss')) || '-';
  }
}

decorate(ResultMailDetailModel, {
  id: observable,
  entityVersion: observable,
  patronKey: observable,

  sendId: observable,
  dispatcherName: observable,
  dispatcherEmail: observable,
  receiverName: observable,
  receiverEmail: observable,
  mailTitle: observable,
  cubeName: observable,
  type: observable,
  typeName: observable,
  sendStatus: observable,
  createDate: observable,
});

export default ResultMailDetailModel;
