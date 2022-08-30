import depot from '@nara.drama/depot';

import { CardCategory, GroupAccessRule, GroupBasedAccessRuleModel, UserGroupRuleModel } from 'shared/model';
import { AccessRuleService } from 'shared/present';
import { LoaderService } from 'shared/components/Loader';

import { CollegeService } from '../../../../college';
import UserGroupService from '../../../../usergroup/group/present/logic/UserGroupService';

import { LearningContentType } from '../../model/vo/LearningContentType';

import { CardQueryModel } from '../../model/CardQueryModel';
import { CardState } from '../../../../_data/lecture/cards/model/vo';

export function cardStateDisplay(state: CardState) {
  //
  if (state === 'Created') {
    return '임시저장';
  }
  if (state === 'Closed') {
    return '폐강';
  }
  if (state === 'OpenApproval') {
    return '승인요청';
  }
  if (state === 'Opened') {
    return '승인';
  }
  if (state === 'Rejected') {
    return '반려';
  }
  return '';
}

export function learningContentsTypeDisplay(type: LearningContentType) {
  //
  if (type === LearningContentType.Cube) {
    return 'Cube';
  }
  if (type === LearningContentType.Chapter) {
    return 'Chapter';
  }
  if (type === LearningContentType.Discussion) {
    return 'Talk';
  }
  return '';
}

export function displayChannel(categories: CardCategory[]) {
  //
  const { collegesMap, channelMap } = CollegeService.instance;
  const filterCategories = categories.filter((category) => category.mainCategory && category);

  if (filterCategories.length > 0) {
    const mainCategory = filterCategories[0];

    return `${collegesMap?.get(mainCategory.collegeId)} > ${channelMap?.get(
      mainCategory.twoDepthChannelId || mainCategory.channelId
    )}`;
  }

  return '';
}

export function arrayToString(arr: string[]) {
  //
  let result: string = '';
  arr &&
    arr.forEach((value, index) => {
      index === 0 ? (result = result.concat(value)) : (result = result.concat(`,${value}`));
    });

  return result;
}

export function yesNoToBoolean(yesNo: string) {
  //
  return yesNo === 'Yes' || yesNo === 'YES';
}

export function booleanToYesNo(boolean: boolean) {
  //
  if (boolean) {
    return 'Yes';
  }
  return 'No';
}

export function divisionCategories(categories: CardCategory[]) {
  //
  let mainCategory: CardCategory = new CardCategory();
  const subCategories: CardCategory[] = [];

  categories &&
    categories.forEach((category) => {
      if (category.mainCategory) {
        mainCategory = category;
      } else {
        subCategories.push(category);
      }
    });

  return { mainCategory, subCategories };
}

export async function findGroupBasedAccessRules(
  model: CardQueryModel,
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

  LoaderService.instance.closeLoader(true, 'accessRule');
}

export function findFiles(fileBoxId: string) {
  //
  return depot.getDepotFiles(fileBoxId).then((files) => files);
}
