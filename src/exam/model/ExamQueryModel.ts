import { decorate, observable } from 'mobx';

export class ExamQueryModel {
  offset: number = 0;
  limit: number = 20;
  year: number = new Date().getFullYear();
  title: string = '';
  finalCopy: boolean = true;
  searchType: string = '';
  keyword: string = '';
}

decorate(ExamQueryModel, {
  offset: observable,
  limit: observable,
  year: observable,
  title: observable,
  finalCopy: observable,
  searchType: observable,
  keyword: observable,
});
