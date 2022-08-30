import { decorate, observable } from 'mobx';
import { QueryModel } from 'shared/model';
import GroupRdo from './GroupRdo';

export class GroupQueryModel extends QueryModel {
  searchFilter: string = '';
  popup: boolean = false;
  precedence: boolean | undefined = false;

  currentPage: number = 0;
  page: number = 0;
  pageIndex: number = 0;
  communityId: string = '';

  static asGroupRdo(groupQuery: GroupQueryModel): GroupRdo {
    return {
      name: (groupQuery && groupQuery.searchWord) || '',
      offset: groupQuery.offset,
      limit: groupQuery.limit,
      searchFilter: groupQuery.searchFilter,
      communityId: groupQuery.communityId,
    };
  }
}

decorate(GroupQueryModel, {
  searchFilter: observable,
  popup: observable,
  currentPage: observable,
  precedence: observable,
  communityId: observable,
});
