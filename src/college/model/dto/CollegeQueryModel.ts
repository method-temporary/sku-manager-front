import { PageModel, QueryModel } from 'shared/model';
import { decorate, observable } from 'mobx';
import CollegeAdminRdo from './CollegeAdminRdo';
import { yesNoToBoolean } from 'shared/helper';
import { patronInfo } from '@nara.platform/dock';

export default class CollegeQueryModel extends QueryModel {
  //
  enabled: string = 'All';
  userWorkspace: string = '';
  name: string = '';

  constructor(collegeQuery?: CollegeQueryModel) {
    super();
    if (collegeQuery) {
      Object.assign(this, { ...collegeQuery });
    }
  }

  static asCollegeAdminRdo(collegeQuery: CollegeQueryModel, pageModel: PageModel): CollegeAdminRdo {
    //
    const userWorkspace = collegeQuery.userWorkspace === 'All' ? '' : collegeQuery.userWorkspace;

    return {
      enabled: collegeQuery.enabled === 'All' ? null : yesNoToBoolean(collegeQuery.enabled),
      userWorkspace,
      name: collegeQuery.name,
      includeChildrenUserWorkspace: true,

      offset: pageModel.offset,
      limit: pageModel.limit,
    };
  }

  static asCollegeAdminRdoBySequence(collegeQuery: CollegeQueryModel, pageModel: PageModel): CollegeAdminRdo {
    //
    const userWorkspace =
      collegeQuery.userWorkspace === '' ? patronInfo.getCineroomId() || '' : collegeQuery.userWorkspace;

    return {
      enabled: collegeQuery.enabled === 'All' ? null : yesNoToBoolean(collegeQuery.enabled),
      userWorkspace,
      name: collegeQuery.name,
      includeChildrenUserWorkspace: false,

      offset: pageModel.offset,
      limit: pageModel.limit,
    };
  }
}

decorate(CollegeQueryModel, {
  enabled: observable,
  userWorkspace: observable,
  name: observable,
});
