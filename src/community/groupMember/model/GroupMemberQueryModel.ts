import { decorate, observable } from 'mobx';
import { QueryModel } from 'shared/model';
import GroupMemberRdo from './GroupMemberRdo';
import { CommunityMemberApprovedType } from 'community/member/model/Member';

export class GroupMemberQueryModel extends QueryModel {
  searchFilter: string = '';

  currentPage: number = 0;
  page: number = 0;
  pageIndex: number = 0;
  arrangeType: string = '';
  approved: CommunityMemberApprovedType | null = null;

  communityId: string = '';
  groupId: string = '';

  static asGroupMemberRdo(groupMemberQuery: GroupMemberQueryModel): GroupMemberRdo {
    //
    let isCompanyName = false;
    let isTeamName = false;
    let isName = false;
    let isNickName = false;
    let isEmail = false;
    if (groupMemberQuery.searchPart === '소속사') isCompanyName = true;
    if (groupMemberQuery.searchPart === '소속조직') isTeamName = true;
    if (groupMemberQuery.searchPart === '성명') isName = true;
    if (groupMemberQuery.searchPart === '닉네임') isNickName = true;
    if (groupMemberQuery.searchPart === 'Email') isEmail = true;
    return {
      startDate: groupMemberQuery.period.startDateLong,
      endDate: groupMemberQuery.period.endDateLong,
      companyName: (isCompanyName && groupMemberQuery && encodeURIComponent(groupMemberQuery.searchWord)) || '',
      name: (isName && groupMemberQuery && encodeURIComponent(groupMemberQuery.searchWord)) || '',
      teamName: (isTeamName && groupMemberQuery && encodeURIComponent(groupMemberQuery.searchWord)) || '',
      nickName: (isNickName && groupMemberQuery && encodeURIComponent(groupMemberQuery.searchWord)) || '',
      email: (isEmail && groupMemberQuery && encodeURIComponent(groupMemberQuery.searchWord)) || '',
      offset: groupMemberQuery.offset,
      limit: groupMemberQuery.limit,
      searchFilter: groupMemberQuery.searchFilter,
      communityId: groupMemberQuery.communityId,
      approved: groupMemberQuery.approved,
      groupId: groupMemberQuery.groupId,
    };
  }
}

decorate(GroupMemberQueryModel, {
  currentPage: observable,
  page: observable,
  communityId: observable,
  approved: observable,
  groupId: observable,
});
