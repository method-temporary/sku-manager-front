import { PageModel, SortFilterState } from 'shared/model';

import { UserGroupQueryModel } from './UserGroupQueryModel';

export class UserGroupRdo {
  //
  offset: number = 0;
  limit: number = 0;

  startDate: number = 0; // 등록 일자
  endDate: number = 0; // 등록 일자
  name: string = ''; // 사용자 그룹명

  sequence: number = 0;
  cineroomId: string = '';

  categoryId: string = '';

  orderBy: SortFilterState = SortFilterState.RegisteredTimeDesc;

  constructor(userGroupQuery?: UserGroupQueryModel, pageModel?: PageModel) {
    if (userGroupQuery && pageModel) {
      Object.assign(this, {
        offset: pageModel.offset,
        limit: pageModel.limit,
        orderBy:
          pageModel.sortFilter === SortFilterState.TimeDesc
            ? // ? SortFilterState.RegisteredTimeDesc
              // : SortFilterState.RegisteredTimeAsc,
              SortFilterState.CreationTimeDesc
            : SortFilterState.CreationTimeAsc,
        categoryId: userGroupQuery.categoryId,
        startDate: userGroupQuery.period.startDateLong,
        endDate: userGroupQuery.period.endDateLong,
        name: userGroupQuery.searchWord,
        sequence: userGroupQuery.sequence,
        cineroomId: userGroupQuery.cineroomId,
      });
    }
  }

  // static makeUserGroupRdo(userGroupModel: UserGroupModel): UserGroupRdo {
  //   //
  //   return {
  //     offset: 0,
  //     limit: 0,
  //     orderBy: SortFilterState.CreationTimeAsc,
  //     categoryId: userGroupModel.categoryId,
  //     startDate: 0,
  //     endDate: 0,
  //     name: userGroupModel.name,
  //     sequence: userGroupModel.sequence,
  //   };
  // }
}
