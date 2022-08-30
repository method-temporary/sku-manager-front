import moment from 'moment';
import { decorate, observable } from 'mobx';
import QueryModel from '../../model/QueryModel';

export class SearchBoxExampleQueryModel extends QueryModel {
  //
  // DatePicker
  singleStartDate: number = moment().toDate().getTime();

  startDate: number = moment().toDate().getTime();
  endDate: number = moment().toDate().getTime();

  // Select
  singleSelect: string = '';

  MultiSelectFirst: string = '';
  MultiSelectSecond: string = '';

  firstSelect: string = '';
  secondSelect: string = '';

  // input
  singleInput: string = '';

  selectInputSelect: string = '';
  selectInputInput: string = '';

  input: string = '';
}

decorate(SearchBoxExampleQueryModel, {
  //
  singleStartDate: observable,
  startDate: observable,
  endDate: observable,
  singleSelect: observable,
  MultiSelectFirst: observable,
  MultiSelectSecond: observable,
  firstSelect: observable,
  secondSelect: observable,
  singleInput: observable,
  selectInputSelect: observable,
  selectInputInput: observable,
  input: observable,
});
