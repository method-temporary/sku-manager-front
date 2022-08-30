import { decorate, observable } from 'mobx';
import moment from 'moment';

export class LocalDateModel {
  year: string = moment(moment().toDate()).format('YYYY');
  month: string = moment(moment().toDate()).format('MM');
  day: string = moment(moment().toDate()).format('DD');

  constructor(localDateModel?: LocalDateModel) {
    if (localDateModel) {
      Object.assign(this, { ...localDateModel });
    }
  }
}

decorate(LocalDateModel, {
  year: observable,
  month: observable,
  day: observable,
});
