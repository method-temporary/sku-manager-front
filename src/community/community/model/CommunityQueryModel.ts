import { decorate, observable } from 'mobx';
import { QueryModel } from 'shared/model';
import CommunityRdo from './CommunityRdo';

export class CommunityQueryModel extends QueryModel {
  searchFilter: string = '';
  popup: boolean = false;
  precedence: boolean | undefined = false;

  currentPage: number = 0;
  page: number = 0;
  pageIndex: number = 0;
  arrangeType: string = '';

  ownCommunityId: string | undefined;

  type: string = '';
  field: string = '';
  isOpend: string = '';

  groupBasedAccessRule: number[] = [];
  ruleStrings: string = '';

  static asCommunityRdo(communityQuery: CommunityQueryModel): CommunityRdo {
    //
    let isName = false;
    let isWord = false;
    let isAdmin = false;
    if (communityQuery.searchPart === '커뮤니티명') isName = true;
    if (communityQuery.searchPart === '생성자') isWord = true;
    if (communityQuery.searchPart === '관리자') isAdmin = true;
    return {
      startDate: communityQuery.period.startDateLong,
      endDate: communityQuery.period.endDateLong,
      name: (isName && communityQuery && encodeURIComponent(communityQuery.searchWord)) || '',
      creatorName: (isWord && communityQuery && encodeURIComponent(communityQuery.searchWord)) || '',
      managerName: (isAdmin && communityQuery && encodeURIComponent(communityQuery.searchWord)) || '',
      offset: communityQuery.offset,
      limit: communityQuery.limit,
      searchFilter: communityQuery.searchFilter,
      type: communityQuery.type,
      field: communityQuery.field,
      visible: communityQuery.isOpend,

      userGroupSequences: communityQuery.groupBasedAccessRule.map((sequence) => sequence),
    };
  }
}

decorate(CommunityQueryModel, {
  searchFilter: observable,
  popup: observable,
  currentPage: observable,
  precedence: observable,
  isOpend: observable,
  type: observable,
  field: observable,
  page: observable,
  groupBasedAccessRule: observable,
  ruleStrings: observable,
});
