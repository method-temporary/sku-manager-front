import XLSX from 'xlsx';
import moment from 'moment';

import { GroupAccessRule, GroupBasedAccessRuleModel, UserGroupRuleModel, PageModel } from 'shared/model';
import { AccessRuleService } from 'shared/present';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { BadgeModel } from '_data/badge/badges/model';

import UserGroupService from 'usergroup/group/present/logic/UserGroupService';
import BadgeApprovalExcelModel from '../../../approval/model/BadgeApprovalExcelModel';
import { BadgeCategoryService } from '../../../category';
import { BadgeCategoryQueryModel } from '../../../category/model/BadgeCategoryQueryModel';
import { BadgeQueryModel } from '../../model/BadgeQueryModel';
import BadgeExcelModel from '../../model/BadgeExcelModel';

export async function findGroupBasedAccessRules(
  model: BadgeModel | BadgeQueryModel,
  accessRuleService: AccessRuleService,
  userGroupService: UserGroupService
) {
  //
  await userGroupService.findUserGroupMap();

  const accessRules: GroupAccessRule[] = model.groupBasedAccessRule.accessRules.map(
    (accessRule): GroupAccessRule =>
      new GroupAccessRule(
        accessRule.groupSequences
          .map((groupSequence): UserGroupRuleModel => {
            const userGroup = userGroupService.userGroupMap.get(groupSequence);
            return new UserGroupRuleModel(
              userGroup?.categoryId,
              userGroup?.categoryName,
              userGroup?.userGroupId,
              userGroup?.userGroupName,
              userGroup?.seq
            );
          })
          .filter((userGroupRuleModel) => userGroupRuleModel.categoryId !== null)
      )
  );
  const groupBasedAccessRuleModel = new GroupBasedAccessRuleModel();

  groupBasedAccessRuleModel.useWhitelistPolicy = model.groupBasedAccessRule.useWhitelistPolicy;
  groupBasedAccessRuleModel.accessRules = accessRules;

  accessRuleService.setGroupBasedAccessRule(groupBasedAccessRuleModel);
}

export function getBadgeCategoryMap(
  badgeCategoryService: BadgeCategoryService,
  cineroomId: string
): Map<string, string> {
  //
  const badgeCategoryMap: Map<string, string> = new Map<string, string>();

  if (!badgeCategoryService.emptyCategories && badgeCategoryService.badgeCategories.length === 0) {
    badgeCategoryService.findAllBadgeCategories(
      BadgeCategoryQueryModel.asBadgeCineroomCategoryRdo(cineroomId, new PageModel(0, 99999999))
    );
  }

  badgeCategoryService.badgeCategories?.forEach((badgeCategory) => {
    badgeCategoryMap.set(badgeCategory.id, getPolyglotToAnyString(badgeCategory.name));
  });

  return badgeCategoryMap;
}

export function getBooleanToString(value: boolean | string, trueStr?: string, falseStr?: string) {
  //
  if (typeof value === 'string') {
    return value;
  }

  if (value) {
    return trueStr || 'Yes';
  } else {
    return falseStr || 'No';
  }
}

export function getBadgeStateDisplay(state: string) {
  //
  if (state === 'OpenApproval') {
    return '승인대기';
  }

  if (state === 'Opened') {
    return '승인';
  }

  if (state === 'Rejected') {
    return '반려';
  }

  // state === 'Created'
  return '임시저장';
}

export function excelDownLoad(
  wbList: BadgeExcelModel[] | BadgeApprovalExcelModel[],
  sheetName: string,
  fileName: string
) {
  //
  const sheet = XLSX.utils.json_to_sheet(wbList);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, sheet, sheetName);

  const date = moment().format('YYYY-MM-DD_HH:mm:ss');
  fileName = `${fileName} -.${date}.xlsx`;
  XLSX.writeFile(wb, fileName, { compression: true });
  return fileName;
}
