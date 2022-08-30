import { PageModel, SortFilterState } from 'shared/model';

import { UserGroupCategoryQueryModel } from './UserGroupCategoryQueryModel';

export class UserGroupCategoryRdo {
  //
  offset: number = 0;
  limit: number = 0;

  startDate: number = 0; // 등록 일자
  endDate: number = 0; // 등록 일자
  name: string = ''; // 사용자 그룹 분류 명
  cineroomId: string = ''; // 사용처
  enabled: boolean = true; // Usage

  orderBy: SortFilterState = SortFilterState.TimeDesc;

  constructor(userGroupCategoryQuery?: UserGroupCategoryQueryModel, pageModel?: PageModel) {
    //
    if (userGroupCategoryQuery && pageModel) {
      Object.assign(this, {
        offset: pageModel.offset,
        limit: pageModel.limit,
        orderBy:
          pageModel.sortFilter === SortFilterState.TimeDesc
            ? // ? SortFilterState.RegisteredTimeDesc
              // : SortFilterState.RegisteredTimeAsc,
              // TODO 다국어 수정
              SortFilterState.CreationTimeDesc
            : SortFilterState.CreationTimeAsc,
        startDate: userGroupCategoryQuery.period.startDateLong,
        endDate: userGroupCategoryQuery.period.endDateLong,
        cineroomId: userGroupCategoryQuery.cineroomId,
        name: userGroupCategoryQuery.searchWord,
        enabled: userGroupCategoryQuery.searchEnabled === '전체' ? undefined : userGroupCategoryQuery.searchEnabled,
      });
    }
  }
}
