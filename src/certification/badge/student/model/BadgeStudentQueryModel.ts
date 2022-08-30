import { decorate, observable } from 'mobx';
import { PageModel, NewDatePeriod } from 'shared/model';

import { BadgeIssueState } from './BadgeIssueState';
import { BadgeStudentRdoModel } from './BadgeStudentRdoModel';
import { BadgeStudentState } from './BadgeStudentState';

export class BadgeStudentQueryModel {
  //
  badgeId: string = '';
  period: NewDatePeriod = new NewDatePeriod();
  badgeIssueState: BadgeIssueState | '' = '';
  badgeStudentState: BadgeStudentState | '' = '';
  employed: boolean | undefined;

  searchPart: any = '';
  searchWord: any;

  offset: number = 0;
  limit: number = 20;

  static asRdo(studentQuery: BadgeStudentQueryModel, pageModel: PageModel): BadgeStudentRdoModel {
    //
    let company = false;
    let department = false;
    let name = false;
    let email = false;
    if (studentQuery.searchPart === '소속사') company = true;
    if (studentQuery.searchPart === '소속조직') department = true;
    if (studentQuery.searchPart === '성명') name = true;
    if (studentQuery.searchPart === 'Email') email = true;

    return {
      badgeId: studentQuery.badgeId,
      startDate: studentQuery && studentQuery.period && studentQuery.period.startDateLong,
      endDate: studentQuery && studentQuery.period && studentQuery.period.endDateLong,
      badgeIssueState: (studentQuery && studentQuery.badgeIssueState) || '',
      badgeStudentState: (studentQuery && studentQuery.badgeStudentState) || '',
      company: (company && studentQuery && studentQuery.searchWord) || '',
      department: (department && studentQuery && studentQuery.searchWord) || '',
      name: (name && studentQuery && studentQuery.searchWord) || '',
      email: (email && studentQuery && studentQuery.searchWord) || '',
      employed: studentQuery.employed,
      offset: pageModel.offset,
      limit: pageModel.limit,
    };
  }

  static asRdoForExcel(studentQuery: BadgeStudentQueryModel): BadgeStudentRdoModel {
    const rdo = BadgeStudentQueryModel.asRdo(studentQuery, new PageModel(0, 99999999));
    rdo.startDate = 964945217000;
    rdo.endDate = 4120618817000;
    return rdo;
  }

  static isBlank(studentQuery: BadgeStudentQueryModel): string {
    //
    if (studentQuery && studentQuery.searchPart !== '' && !studentQuery.searchWord) {
      return '검색어';
    }
    return 'success';
  }
}

decorate(BadgeStudentQueryModel, {
  badgeId: observable,
  period: observable,
  badgeIssueState: observable,
  badgeStudentState: observable,
  searchPart: observable,
  searchWord: observable,
  employed: observable,
  offset: observable,
  limit: observable,
});
