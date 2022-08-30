import { computed, decorate, observable } from 'mobx';
import moment, { Moment } from 'moment';

export class NewDatePeriod {
  //
  DEFAULT_FORMAT = 'YYYY-MM-DD';

  zoneId: string = '';
  startDateMoment: Moment = moment();
  endDateMoment: Moment = moment();
  startDate: string = this.startDateMoment.format(this.DEFAULT_FORMAT);
  endDate: string = this.endDateMoment.format(this.DEFAULT_FORMAT);

  constructor(datePeriod?: NewDatePeriod) {
    if (datePeriod) {
      Object.assign(this, { ...datePeriod });
      if (datePeriod.endDate && datePeriod.endDate.includes('-')) {
        this.startDateMoment = (datePeriod.startDate && moment(datePeriod.startDate)) || moment();
        this.endDateMoment = (datePeriod.endDate && moment(datePeriod.endDate)) || moment();
      } else {
        this.startDateMoment = (datePeriod.startDate && moment(Number(datePeriod.startDate))) || moment();
        this.endDateMoment = (datePeriod.endDate && moment(Number(datePeriod.endDate))) || moment();
      }
    }
  }

  static syncDatePeriod(datePeriod: NewDatePeriod): NewDatePeriod {
    //
    const returnValue = new NewDatePeriod();
    returnValue.DEFAULT_FORMAT = datePeriod.DEFAULT_FORMAT;
    returnValue.zoneId = datePeriod.zoneId;
    returnValue.startDateMoment = datePeriod.startDateMoment;
    returnValue.endDateMoment = datePeriod.endDateMoment;
    returnValue.startDate = datePeriod.startDateDash;
    returnValue.endDate = datePeriod.endDateDash;

    return returnValue;
  }

  setStartDateObj(date: Date) {
    //
    const momentDate = moment(date);

    this.startDateMoment = momentDate;
    this.startDate = momentDate.format(this.DEFAULT_FORMAT);
  }

  setEndDateObj(date: Date) {
    //
    const momentDate = moment(date);

    this.endDateMoment = momentDate;
    this.endDate = momentDate.format(this.DEFAULT_FORMAT);
  }

  setEndOfYearFrom(date: Date) {
    const startMomentDate = moment(date);
    const endMomentDate = moment(date);

    this.startDateMoment = startMomentDate;
    this.startDate = startMomentDate.format(this.DEFAULT_FORMAT);
    this.endDateMoment = endMomentDate.endOf('year');
    this.endDate = endMomentDate.format(this.DEFAULT_FORMAT);
  }

  @computed
  get startDateObj() {
    return this.startDateMoment && this.startDateMoment.toDate();
  }

  @computed
  get startDateDot() {
    return this.startDateMoment && this.startDateMoment.format('YYYY.MM.DD');
  }

  @computed
  get startDateDash() {
    return this.startDateMoment && this.startDateMoment.format('YYYY-MM-DD');
  }

  @computed
  get startDateLong() {
    return this.startDateMoment && this.startDateMoment.toDate().getTime();
  }

  @computed
  get endDateObj() {
    return this.endDateMoment && this.endDateMoment.toDate();
  }

  @computed
  get endDateDot() {
    return this.endDateMoment && this.endDateMoment.format('YYYY.MM.DD');
  }

  @computed
  get endDateDash() {
    return this.endDateMoment && this.endDateMoment.format('YYYY-MM-DD');
  }

  @computed
  get endDateLong() {
    return this.endDateMoment && this.endDateMoment.toDate().getTime();
  }

  @computed
  get startDateDotWithTime() {
    return this.startDateMoment && this.startDateMoment.format('YYYY.MM.DD HH:mm');
  }

  @computed
  get endDateDotWithTime() {
    return this.startDateMoment && this.startDateMoment.format('YYYY.MM.DD HH:mm');
  }
}

decorate(NewDatePeriod, {
  zoneId: observable,
  startDateMoment: observable,
  startDate: observable,
  endDateMoment: observable,
  endDate: observable,
});
