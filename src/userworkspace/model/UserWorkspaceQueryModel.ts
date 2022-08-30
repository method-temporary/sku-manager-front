import { decorate, observable } from 'mobx';
import { QueryModel, PageModel } from 'shared/model';
import { yesNoToBoolean } from 'shared/helper';
import UserWorkspaceRdo from './dto/UserWorkspaceRdo';

export default class UserWorkspaceQueryModel extends QueryModel {
  //
  skGroup: string | null = null;
  parentId: string = '';

  constructor(userWorkspaceQueryModel?: UserWorkspaceQueryModel) {
    super();
    if (userWorkspaceQueryModel) {
      Object.assign(this, { ...userWorkspaceQueryModel });
    }
  }

  static asUserWorkspaceRdo(queryModel: UserWorkspaceQueryModel, pageModel: PageModel): UserWorkspaceRdo {
    //
    return {
      startTime: queryModel.period.startDateLong,
      endTime: queryModel.period.endDateLong,
      skGroup: queryModel.skGroup !== null ? yesNoToBoolean(queryModel.skGroup) : null,
      parentId: queryModel.parentId,
      name: queryModel.searchWord !== '' ? queryModel.searchWord : null,

      limit: pageModel.limit,
      offset: pageModel.offset,
    };
  }
}

decorate(UserWorkspaceQueryModel, {
  skGroup: observable,
  parentId: observable,
});
