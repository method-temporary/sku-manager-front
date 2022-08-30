import MemberSearchFormModel from '../model/MemberSearchFormModel';
import { PageModel } from '../../shared/model';
import { MemberRdo } from '../../_data/approval/members/model';
import { MemberSearchType } from '../model/vo';

export const getMemberRdo = (
  companyCode: string,
  memberSearchForm: MemberSearchFormModel,
  pageModel: PageModel
): MemberRdo => {
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
};
