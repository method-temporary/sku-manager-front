import { UserGroupMemberQueryModel } from './UserGroupMemberQueryModel';
import { PageModel } from 'shared/model';

export class UserGroupMemberRdo {
  limit: number = 0;
  offset: number = 20;
  groupSequences: string = '';

  // 검색 조건
  endDate: number = 0;
  startDate: number = 0;
  email: string = ''; // 이메일
  name: string = ''; // 이름
  companyCode: string = '';

  constructor(userGroupMemberQuery?: UserGroupMemberQueryModel, pageModel?: PageModel) {
    //
    if (userGroupMemberQuery && pageModel) {
      Object.assign(this, {
        offset: pageModel.offset,
        limit: pageModel.limit,
        groupSequences: userGroupMemberQuery.groupSequence,
        startDate: userGroupMemberQuery.period.startDateLong,
        endDate: userGroupMemberQuery.period.endDateLong,
        name: userGroupMemberQuery.searchPart === '성명' ? userGroupMemberQuery.searchWord : '',
        email: userGroupMemberQuery.searchPart === 'Email' ? userGroupMemberQuery.searchWord : '',
        companyCode: userGroupMemberQuery.companyCode === '전체' ? '' : userGroupMemberQuery.companyCode,
      });
    }
  }
}
