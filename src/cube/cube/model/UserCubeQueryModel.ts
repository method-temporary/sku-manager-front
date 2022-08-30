import { PageModel, QueryModel } from 'shared/model';
import { UserCubeAdminRdo } from './sdo/UserCubeAdminRdo';
import { UserCubeState } from './vo/UserCubeState';
import { ConditionDateType } from './vo/ConditionDateType';
import { decorate, observable } from 'mobx';

export class UserCubeQueryModel extends QueryModel {
  //
  cineroomId: string = '';
  state: UserCubeState = UserCubeState.DEFAULT;
  conditionDateType: ConditionDateType = ConditionDateType.CreationTime;

  static asUserCubeAdminRdo(userCubeQuery: UserCubeQueryModel, pageModel: PageModel): UserCubeAdminRdo {
    //
    return {
      name: userCubeQuery.searchPart === '과정명' ? userCubeQuery.searchWord : '',
      creatorName: userCubeQuery.searchPart === '신청자' ? userCubeQuery.searchWord : '',
      creatorEmail: userCubeQuery.searchPart === '신청자Email' ? userCubeQuery.searchWord : '',
      cineroomId: userCubeQuery.cineroomId,
      state: userCubeQuery.state,
      conditionDateType: userCubeQuery.conditionDateType,
      startDate: userCubeQuery.period.startDateLong,
      endDate: userCubeQuery.period.endDateLong,
      limit: pageModel.limit,
      offset: pageModel.offset,
    };
  }
}

decorate(UserCubeQueryModel, {
  cineroomId: observable,
  state: observable,
  conditionDateType: observable,
});
