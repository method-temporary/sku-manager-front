import { decorate, observable } from 'mobx';
import moment from 'moment';

import { QueryModel } from 'shared/model';

import { CommunityMemberApprovedType } from './Member';
import MemberRdo from './MemberRdo';

export class MemberQueryModel extends QueryModel {
  searchFilter: string = '';

  currentPage: number = 0;
  page: number = 0;
  pageIndex: number = 0;
  arrangeType: string = '';

  // Master approved CardType 변경 --> adv: boolean
  approved: CommunityMemberApprovedType | null = null;

  communityId: string = '';
  companyName: string = '';
  teamName: string = '';
  nickName: string = '';
  name: string = '';
  email: string = '';
  groupId: string = '';
  companyCode: string = '';

  static asMemberRdo(memberQuery: MemberQueryModel): MemberRdo {
    //
    let isCompanyName = false;
    let isTeamName = false;
    let isName = false;
    let isNickName = false;
    let isEmail = false;
    if (memberQuery.searchPart === '소속사') isCompanyName = true;
    if (memberQuery.searchPart === '소속조직') isTeamName = true;
    if (memberQuery.searchPart === '성명') isName = true;
    if (memberQuery.searchPart === '닉네임') isNickName = true;
    if (memberQuery.searchPart === 'Email') isEmail = true;
    return {
      startDate: moment().startOf('day').subtract(1, 'y').toDate().getTime(),
      endDate: new Date().getTime(),
      companyName: (isCompanyName && memberQuery && encodeURIComponent(memberQuery.searchWord)) || '',
      name: (isName && memberQuery && encodeURIComponent(memberQuery.searchWord)) || '',
      teamName: (isTeamName && memberQuery && encodeURIComponent(memberQuery.searchWord)) || '',
      nickName: (isNickName && memberQuery && encodeURIComponent(memberQuery.searchWord)) || '',
      email: (isEmail && memberQuery && encodeURIComponent(memberQuery.searchWord)) || '',
      offset: memberQuery.offset,
      limit: memberQuery.limit,
      searchFilter: memberQuery.searchFilter,
      communityId: memberQuery.communityId,
      approved: memberQuery.approved,
      groupId: memberQuery.groupId,
    };
  }
}

decorate(MemberQueryModel, {
  // searchFilter: observable,
  // popup: observable,
  currentPage: observable,
  // precedence: observable,
  page: observable,
  pageIndex: observable,
  communityId: observable,
  approved: observable,
  companyName: observable,
  teamName: observable,
  name: observable,
  nickName: observable,
  email: observable,
  groupId: observable,
  companyCode: observable,
});
