import { BadgeApproverQueryModel } from './BadgeApproverQueryModel';
import { PageModel } from 'shared/model';

export class BadgeApproverRdo {
  //
  name: string = '';
  email: string = '';
  cineroomId: string = '';
  offset: number = 0;
  limit: number = 20;

  roleKeys: string[] = [];

  constructor(badgeApproverQueryModel?: BadgeApproverQueryModel, pageModel?: PageModel) {
    //
    if (badgeApproverQueryModel && pageModel) {
      Object.assign(this, {
        offset: pageModel.offset,
        limit: pageModel.limit,
        name:
          badgeApproverQueryModel.searchPart === '성명' ? encodeURIComponent(badgeApproverQueryModel.searchWord) : '',
        email:
          badgeApproverQueryModel.searchPart === 'Email' ? encodeURIComponent(badgeApproverQueryModel.searchWord) : '',
        cineroomId: badgeApproverQueryModel.approvingCineroomId,
        roleKeys: badgeApproverQueryModel.roles,
      });
    }
  }
}
