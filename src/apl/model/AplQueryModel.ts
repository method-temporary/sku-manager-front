import { decorate, observable } from 'mobx';

import { QueryModel, PageModel } from 'shared/model';

import { AplRdoModel } from './AplRdoModel';

export class AplQueryModel extends QueryModel {
  //
  searchFilter: string = '';
  name: string = '';
  currentPage: number = 0;

  static asAplRdo(aplQuery: AplQueryModel, pageModel: PageModel): AplRdoModel {
    let isTitle = false;
    let isWord = false;
    if (aplQuery.searchPart === '교육명') isTitle = true;
    if (aplQuery.searchPart === '생성자') isWord = true;
    return {
      startDate: aplQuery && aplQuery.period && aplQuery.period.startDateLong,
      endDate: aplQuery && aplQuery.period && aplQuery.period.endDateLong,
      college: aplQuery && aplQuery.college,
      channel: aplQuery && aplQuery.channel,
      searchFilter: aplQuery && aplQuery.searchFilter,
      title: (isTitle && aplQuery && aplQuery.searchWord) || '',
      registrantName: (isWord && aplQuery && aplQuery.searchWord) || '',
      limit: pageModel.limit,
      offset: pageModel.offset,
    };
  }
}

decorate(AplQueryModel, {
  searchFilter: observable,
  name: observable,
  limit: observable,
  offset: observable,
});
