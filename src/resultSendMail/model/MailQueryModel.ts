import { decorate, observable } from 'mobx';
import { QueryModel } from 'shared/model';
import { ResultMailRdoModel } from './ResultMailRdoModel';

export class MailQueryModel extends QueryModel {
  //
  searchFilter: string = '';
  currentPage: number = 0;
  type: string = ''; // Cube_learning, Course_learning, Cube_approve, Course_approve

  static asRdo(cubeQuery: MailQueryModel): ResultMailRdoModel {
    let isTitle = false;
    let isSender = false;
    let isEmail = false;
    if (cubeQuery.searchPart === '타이틀') isTitle = true;
    if (cubeQuery.searchPart === '발신자') isSender = true;
    if (cubeQuery.searchPart === '발신자 이메일') isEmail = true;

    return {
      startDate: cubeQuery && cubeQuery.period && cubeQuery.period.startDateLong,
      endDate: cubeQuery && cubeQuery.period && cubeQuery.period.endDateLong,
      mailTitle:
        // (isTitle && cubeQuery && encodeURIComponent(cubeQuery.searchWord)) ||
        (isTitle && cubeQuery && cubeQuery.searchWord) || '',
      dispatcherName:
        // (isSender && cubeQuery && encodeURIComponent(cubeQuery.searchWord)) ||
        (isSender && cubeQuery && cubeQuery.searchWord) || '',
      dispatcherEmail: (isEmail && cubeQuery.searchWord) || '',
      offset: cubeQuery && cubeQuery.offset,
      limit: cubeQuery && cubeQuery.limit,
      type: cubeQuery && cubeQuery.type,
    };
  }
}

decorate(MailQueryModel, {
  searchFilter: observable,
  currentPage: observable,
  type: observable,
});
