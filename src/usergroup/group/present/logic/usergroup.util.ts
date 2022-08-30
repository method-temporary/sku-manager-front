import { useFindAllUserGroup } from './usergroup.hook';
import { UserGroupRuleModel } from '../../../../shared/model';
import { getPolyglotToAnyString } from '../../../../shared/components/Polyglot';
import { UserGroupQueryModel } from '../../model';

export function useUserGroupMap() {
  //
  const { data: userGroups } = useFindAllUserGroup();

  return getUserGroupMap(userGroups?.results || []);
}

export function getUserGroupMap(userGroups: UserGroupQueryModel[]) {
  //
  const userGroupMap = new Map<number, UserGroupRuleModel>();

  userGroups &&
    userGroups.forEach((userGroup) => {
      userGroupMap.set(
        userGroup.sequence,
        new UserGroupRuleModel(
          userGroup.userGroupCategory.id,
          getPolyglotToAnyString(userGroup.userGroupCategory.name),
          userGroup.id,
          getPolyglotToAnyString(userGroup.name),
          userGroup.sequence
        )
      );
    });

  return userGroupMap;
}
