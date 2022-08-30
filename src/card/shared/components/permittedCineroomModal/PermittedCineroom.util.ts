import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { UserWorkSpace } from '_data/user/useWorkspaces/model/UserWorkSpace';
import { PermittedCineroom } from '_data/lecture/cards/model/vo';
import { getUserWorkSpaceName } from 'userworkspace/userWorkSpace.util';
import { MYSUNI_CINEROOMID } from '../../../../shared/model';

/**
 * 선택한 관계사 ( 핵인싸 ) 이름 불러오기
 * @param userWorkSpaces
 * @param permittedCinerooms
 * @param cineroomId
 * @param required
 */
export const getPermittedCineroomsText = (
  userWorkSpaces: UserWorkSpace[],
  permittedCinerooms: PermittedCineroom[],
  cineroomId: string = MYSUNI_CINEROOMID,
  required?: boolean
): string => {
  //
  const currentCineroom = permittedCinerooms.find((permittedCineroom) => permittedCineroom.cineroomId === cineroomId);
  const isMySUNI = currentCineroom?.cineroomId === MYSUNI_CINEROOMID;

  // 핵인싸 Text
  if (required) {
    //
    if (currentCineroom) {
      // MYSUNI
      if (currentCineroom.required && isMySUNI) {
        return userWorkSpaces.map((userWorkSpace) => getPolyglotToAnyString(userWorkSpace.name)).join(', ');
      } else if (currentCineroom.required) {
        // 현재 자기 관계사가 있는경우
        return userWorkSpaces
          .filter((userWorkSpace) => userWorkSpace.id === cineroomId || userWorkSpace.parentId === cineroomId)
          .map((userWorkSpace) => getPolyglotToAnyString(userWorkSpace.name))
          .join(', ');
      } else {
        // 일부 관계사 핵인싸
        return permittedCinerooms
          .filter((permittedCineroom) => permittedCineroom.required)
          .map((permittedCineroom) => getUserWorkSpaceName(userWorkSpaces, permittedCineroom.cineroomId))
          .join(', ');
      }
    } else {
      // 일부 관계사
      // 일부 관계사 중에서 하위의 관계사가 있는 경우 ( ex: SK 이노베이션 공통 )
      // 그 하위의 관계사 까지 Text 로 볼 수 있도록
      return getPermittedCineroomWithChildrenTexts(
        permittedCinerooms
          .filter((permittedCineroom) => permittedCineroom.required)
          .map((permittedCineroom) => permittedCineroom),
        userWorkSpaces,
        required
      );
    }
  } else {
    // 관계사 Text
    // MYSUNI
    if (isMySUNI) {
      return userWorkSpaces.map((userWorkSpace) => getPolyglotToAnyString(userWorkSpace.name)).join(', ');
    } else if (currentCineroom) {
      // 현재 자기 관계사가 있는경우
      return userWorkSpaces
        .filter((userWorkSpace) => userWorkSpace.id === cineroomId || userWorkSpace.parentId === cineroomId)
        .map((userWorkSpace) => getPolyglotToAnyString(userWorkSpace.name))
        .join(', ');
    } else {
      // 일부 관계사
      return getPermittedCineroomWithChildrenTexts(permittedCinerooms, userWorkSpaces, required);
    }
  }
};

const getPermittedCineroomWithChildrenTexts = (
  permittedCinerooms: PermittedCineroom[],
  userWorkSpaces: UserWorkSpace[],
  required: boolean = false
) => {
  //
  // 일부 관계사 중에서 하위의 관계사가 있는 경우 ( ex: SK 이노베이션 공통 )
  // 그 하위의 관계사 까지 Text 로 볼 수 있도록
  const permittedCineroomsWithChildrens: PermittedCineroom[] = [];

  permittedCinerooms.forEach((permittedCineroom) => {
    !permittedCineroomsWithChildrens.some(
      (permittedCineroomWithChildren) => permittedCineroomWithChildren.cineroomId === permittedCineroom.cineroomId
    ) && permittedCineroomsWithChildrens.push(permittedCineroom);

    userWorkSpaces.forEach((userWorkSpace) => {
      if (userWorkSpace.parentId === permittedCineroom.cineroomId) {
        !permittedCineroomsWithChildrens.some(
          (permittedCineroomWithChildren) => permittedCineroomWithChildren.cineroomId === userWorkSpace.id
        ) &&
          permittedCineroomsWithChildrens.push({
            cineroomId: userWorkSpace.id,
            required,
          } as PermittedCineroom);
      }
    });
  });

  return permittedCineroomsWithChildrens
    .map((permittedCineroom: PermittedCineroom) => getUserWorkSpaceName(userWorkSpaces, permittedCineroom.cineroomId))
    .join(', ');
};
