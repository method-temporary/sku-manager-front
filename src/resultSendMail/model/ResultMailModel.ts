import { computed, decorate, observable } from 'mobx';
import moment from 'moment';
import { DramaEntity, PatronKey } from '@nara.platform/accent';
import { SelectType } from 'shared/model';

export class ResultMailModel implements DramaEntity {
  id: string = '';
  entityVersion: number = 0;
  patronKey: PatronKey = {} as PatronKey;
  sender: PatronKey = {} as PatronKey;
  senderEmail: string = '';
  senderName: string = '';

  sendId: string = ''; // 상세조회 시 조건
  dispatcherName: string = ''; // 발신자 이름
  dispatcherEmail: string = ''; // 발신자 이메일
  mailTitle: string = ''; // 타이틀
  cubeName: string = ''; // 과정명
  type: string = ''; // 검색구분
  typeName: string = '';
  createDate: number = 0; // 전송일
  trueCount: number = 0; // 전송성공 건수
  falseCount: number = 0; // 전송실패 건수
  receiverEmail: string = ''; // 수신자 이메일

  constructor(resultMail?: ResultMailModel) {
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

decorate(ResultMailModel, {
  id: observable,
  entityVersion: observable,
  patronKey: observable,
  sender: observable,

  sendId: observable,
  dispatcherName: observable,
  dispatcherEmail: observable,
  mailTitle: observable,
  cubeName: observable,
  type: observable,
  typeName: observable,
  createDate: observable,
  trueCount: observable,
  falseCount: observable,
  receiverEmail: observable,
});

export default ResultMailModel;
