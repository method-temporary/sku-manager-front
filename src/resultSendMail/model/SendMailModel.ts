import { computed, decorate, observable } from 'mobx';
import moment from 'moment';
import { DramaEntity, PatronKey } from '@nara.platform/accent';
import { SelectType } from 'shared/model';

export class SendMailModel implements DramaEntity {
  id: string = '';
  entityVersion: number = 0;
  patronKey: PatronKey = {} as PatronKey;

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

  constructor(sendMail?: SendMailModel) {
    Object.assign(this, {
      ...sendMail,
      typeName: SelectType.mailOptions.find((item) => {
        return sendMail?.type === item.value;
      })?.text,
    });
  }

  @computed
  get getCreateDate() {
    return (this.createDate && this.createDate !== 0 && moment(this.createDate).format('YYYY.MM.DD HH:mm:ss')) || '-';
  }
}

decorate(SendMailModel, {
  id: observable,
  entityVersion: observable,
  patronKey: observable,

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
});

export default SendMailModel;
