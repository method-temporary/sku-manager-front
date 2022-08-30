import { decorate, observable } from 'mobx';
import { NewDatePeriod } from './NewDatePeriod';

export default class QueryModel {
  period: NewDatePeriod = new NewDatePeriod();
  college: string = '';
  channel: string = '';
  searchPart: string = '';
  searchWord: string = '';

  offset: number = 0;
  limit: number = 20;
}

decorate(QueryModel, {
  period: observable,
  college: observable,
  channel: observable,
  searchPart: observable,
  searchWord: observable,

  offset: observable,
  limit: observable,
});
