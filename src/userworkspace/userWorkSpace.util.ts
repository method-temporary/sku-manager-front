import { UserWorkSpace } from '_data/user/useWorkspaces/model/UserWorkSpace';
import { getPolyglotToAnyString } from '../shared/components/Polyglot';
import { MYSUNI_CINEROOMID } from '../shared/model';
import { PermittedCineroom } from '../_data/lecture/cards/model/vo';

export const getUserWorkSpaceName = (userWorkSpaces: UserWorkSpace[], cineroomId: string) => {
  //
  const userWorkSpace = userWorkSpaces.find((userWorkSpaces) => userWorkSpaces.id === cineroomId);

  if (userWorkSpace) return getPolyglotToAnyString(userWorkSpace.name);

  return 'ALL';
};

export const getUserWorkSpaceByCineroomId = (cineroomId: string, userWorkSpaces?: UserWorkSpace[]): UserWorkSpace[] => {
  //
  if (!userWorkSpaces) return [];

  // MYSUNI 일 경우
  if (cineroomId === MYSUNI_CINEROOMID) return userWorkSpaces;

  // 다른 관계사 일 경우
  const userWorkspace: UserWorkSpace[] = [];
  userWorkSpaces?.forEach((userWorkSpaceValue) => {
    //
    if (userWorkSpaceValue.id === cineroomId || userWorkSpaceValue.parentId === cineroomId) {
      userWorkspace.push(userWorkSpaceValue);
    }
  });

  return userWorkspace;
};
