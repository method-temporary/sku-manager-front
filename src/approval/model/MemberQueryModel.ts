import { decorate, observable } from 'mobx';
import { PageModel, QueryModel } from 'shared/model';
import { MemberSearchType } from './vo';
import MemberSearchFormModel from './MemberSearchFormModel';

export default class MemberQueryModel extends QueryModel {
  //
  companyCode: string = '';
  searchType: MemberSearchType = MemberSearchType.Default;

  constructor(memberQuery?: MemberQueryModel) {
    super();
    if (memberQuery) {
      Object.assign(this, { ...memberQuery });
    }
  }

  static asSkProfileRdo(companyCode: string, memberSearchForm: MemberSearchFormModel, pageModel: PageModel) {
    //
    return {
      companyCode,
      startDate: memberSearchForm.startDate,
      endDate: memberSearchForm.endDate,
      name: memberSearchForm.searchPart === MemberSearchType.Name ? memberSearchForm.searchWord : '',
      email: memberSearchForm.searchPart === MemberSearchType.Email ? memberSearchForm.searchWord : '',
      departmentName: memberSearchForm.searchPart === MemberSearchType.Department ? memberSearchForm.searchWord : '',

      limit: pageModel.limit,
      offset: pageModel.offset,
    };
  }
}

decorate(MemberQueryModel, {
  companyCode: observable,
  searchType: observable,
});
