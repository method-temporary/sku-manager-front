import { decorate, observable } from 'mobx';
import { NameValueList } from 'shared/model';

export class ResultMailRdoModel {
  startDate: number = 0;
  endDate: number = 0;
  offset: number = 0; // currentPage
  limit: number = 0; // 조회건수
  // 타이틀, 발신자, 발신자 이메일 셋중에 하나만 채워져 있어야 함. filter 없는 대신
  mailTitle: string = ''; // 타이틀
  dispatcherName: string = ''; // 발신자 이름
  dispatcherEmail: string = ''; // 발신자 이메일
  type: string = ''; // 검색구분

  constructor(resultMailRdo?: ResultMailRdoModel) {
    if (resultMailRdo) {
      Object.assign(this, { resultMailRdo });
    }
  }

  static asNameValueList(resultMailRdo: ResultMailRdoModel): NameValueList {
    // const period = new NewDatePeriod();
    // period.startDate = resultMailRdo.startDateMoment.format('YYYY-MM-DD');
    // period.endDate = post.period.endDateMoment.format('YYYY-MM-DD');
    const asNameValues = {
      nameValues: [
        {
          name: 'startDate',
          value: String(resultMailRdo.startDate),
        },
        {
          name: 'endDate',
          value: String(resultMailRdo.endDate),
        },
        {
          name: 'offset',
          value: String(resultMailRdo.offset),
        },
        {
          name: 'limit',
          value: String(resultMailRdo.limit),
        },
        {
          name: 'mailTitle',
          value: resultMailRdo.mailTitle,
        },
        {
          name: 'dispatcherName',
          value: resultMailRdo.dispatcherName,
        },
        {
          name: 'dispatcherEmail',
          value: resultMailRdo.dispatcherEmail,
        },
        {
          name: 'type',
          value: resultMailRdo.type,
        },
      ],
    };
    return asNameValues;
  }
}
decorate(ResultMailRdoModel, {
  startDate: observable,
  endDate: observable,
  offset: observable,
  limit: observable,
  mailTitle: observable,
  dispatcherName: observable,
  dispatcherEmail: observable,
  type: observable,
});
