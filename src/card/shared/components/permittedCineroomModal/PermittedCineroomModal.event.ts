import { PermittedCineroom } from '_data/lecture/cards/model/vo';
import { UserWorkSpace } from '_data/user/useWorkspaces/model/UserWorkSpace';
import PermittedCineroomModalStore from './PermittedCineroomModal.store';

/**
 * 관계사 ( 핵인싸 ) 가 ALL 인지 판단 하는 함수
 * @param permittedCinerooms
 * @param cineroomId
 * @param userWorkspacesLength
 * @return { isAll: boolean, isRequiredAll: boolean}
 */
export const isAllPermittedCineroom = (
  permittedCinerooms: PermittedCineroom[],
  cineroomId: string,
  userWorkspacesLength: number
) => {
  //
  const result = {
    isAll: false,
    isRequiredAll: false,
  };

  if (permittedCinerooms && permittedCinerooms.length > 1 && permittedCinerooms.length === userWorkspacesLength)
    result.isAll = true;
  if (
    permittedCinerooms &&
    permittedCinerooms.length > 1 &&
    permittedCinerooms.filter((permittedCineroom) => permittedCineroom.required).length === userWorkspacesLength
  )
    result.isRequiredAll = true;

  permittedCinerooms.forEach((permittedCineroom) => {
    if (permittedCineroom.cineroomId === cineroomId) {
      result.isAll = true;

      if (permittedCineroom.required) {
        result.isRequiredAll = true;
      }
    }
  });

  return result;
};

/**
 * 관계사 체크 여부 boolean
 * @param userWorkSpace
 */
export const isPermittedCineroomChecked = (userWorkSpace: UserWorkSpace): boolean => {
  //
  const { isAll, selectPermittedCinerooms } = PermittedCineroomModalStore.instance;

  const permittedCineroom = selectPermittedCinerooms.find(
    (permittedCineroom) =>
      permittedCineroom.cineroomId === userWorkSpace.id || permittedCineroom.cineroomId === userWorkSpace.parentId
  );

  return !!(isAll || permittedCineroom);
};

/**
 * 관계사 Disabled 여부 boolean
 * @param userWorkSpace
 */
export const isPermittedCineroomDisabled = (userWorkSpace: UserWorkSpace): boolean => {
  //
  const { isAll, selectPermittedCinerooms } = PermittedCineroomModalStore.instance;

  const permittedCineroom = selectPermittedCinerooms.find(
    (permittedCineroom) => permittedCineroom.cineroomId === userWorkSpace.parentId
  );

  return !!(isAll || permittedCineroom);
};

/**
 * 핵인싸 체크 여부 boolean
 * @param cineroomId
 * @param parentId
 */
export const isRequiredChecked = (cineroomId: string, parentId: string): boolean => {
  //
  const { isRequireAll, selectPermittedCinerooms } = PermittedCineroomModalStore.instance;

  const permittedCineroom = selectPermittedCinerooms.find(
    (permittedCineroom) =>
      (permittedCineroom.cineroomId === cineroomId && permittedCineroom.required) ||
      (permittedCineroom.cineroomId === parentId && permittedCineroom.required)
  );

  return !!(isRequireAll || permittedCineroom);
};

/**
 * 관계사 Disabled 여부 boolean
 * @param userWorkSpace
 */
export const isRequiredDisabled = (userWorkSpace: UserWorkSpace): boolean => {
  //
  const { isRequireAll, selectPermittedCinerooms } = PermittedCineroomModalStore.instance;

  const permittedCineroom = selectPermittedCinerooms.find(
    (permittedCineroom) => permittedCineroom.required && permittedCineroom.cineroomId === userWorkSpace.parentId
  );

  return !!(isRequireAll || permittedCineroom);
};

/**
 * 관계사 ( 핵인싸 ) ALL 선택 Event 함수
 * @param check
 * @param cineroomId
 * @param required 핵인싸 여부
 */
export const onCheckCineroomAll = (check: boolean, cineroomId: string, required: boolean = false) => {
  //
  const { setIsAll, setIsRequireAll, setSelectPermittedCinerooms } = PermittedCineroomModalStore.instance;

  if (check) {
    //
    // 관계사 ALL 선택시에는 핵인사 ALL 선택 초기화
    if (required) {
      setIsRequireAll(true);
    } else {
      setIsAll(true);
      setIsRequireAll(false);
    }

    setSelectPermittedCinerooms([{ cineroomId, required, parentId: '' }]);
  } else {
    //
    if (required) {
      // 핵인사 ALL 선택 해제시에는 관계서 설정은 남겨둬야 하기 때문에 required 만 false 로 수정
      setIsRequireAll(false);
      setSelectPermittedCinerooms([{ cineroomId, required: false, parentId: '' }]);
    } else {
      // 관계사 ALL 선택 해제시는 아무것도 남기지 않고 빈 배열로 수정
      setIsAll(false);
      setSelectPermittedCinerooms([]);
    }
  }
};

/**
 * 단일 관계사 ( 핵인싸 ) 선택 여부
 * @param check
 * @param selectCineroomId
 * @param isPermittedAll 관계사 전체 선택 여부
 * @param isRequiredAll 핵인싸 전체 선택 여부
 * @param required 핵인싸 여부
 * @param cineroomId
 * @param parentId
 */
export const onClickCineroomOne = (
  check: boolean,
  selectCineroomId: string,
  isPermittedAll: boolean,
  isRequiredAll: boolean,
  required: boolean = false,
  cineroomId: string,
  parentId: string
) => {
  //
  const { isAll, selectPermittedCinerooms, setSelectPermittedCinerooms } = PermittedCineroomModalStore.instance;

  let next = selectPermittedCinerooms.slice();

  if (required) {
    // 핵인싸 선택시
    if (isAll) {
      // 핵인싸 선택시 관계사가 ALL 체크 되어 있으면, 추가하거나 삭제
      if (check) {
        //
        if (isRequiredAll) {
          onCheckCineroomAll(check, cineroomId, true);
          return;
        }

        // 선택한 관계사를 부모로 가지고 있는 관셰사 제거 ( 부모 관계사 적용시 자식 관계사는 같이 적용 되기 때문 )
        next = next
          .filter((permittedCineroom) => permittedCineroom.parentId !== selectCineroomId)
          .map((permittedCineroom) => permittedCineroom);

        next.push({ cineroomId: selectCineroomId, required, parentId });
      } else {
        //
        next = next
          .filter((permittedCineroom) => permittedCineroom.cineroomId !== selectCineroomId)
          .map((permittedCineroom) => permittedCineroom);
      }
    } else {
      // 핵인싸 선택시 관계사가 ALL 체크 안되어 있으면, 해당 관계사 required 수정
      next = next.map((permittedCineroom) =>
        permittedCineroom.cineroomId === selectCineroomId
          ? { cineroomId: selectCineroomId, required: check, parentId: permittedCineroom.parentId }
          : permittedCineroom
      );
    }
  } else {
    // 관계사 선택시
    if (check) {
      //
      if (isPermittedAll) {
        onCheckCineroomAll(check, cineroomId);
        return;
      }

      // 선택한 관계사를 부모로 가지고 있는 관셰사 제거 ( 부모 관계사 적용시 자식 관계사는 같이 적용 되기 때문 )
      next = next
        .filter((permittedCineroom) => permittedCineroom.parentId !== selectCineroomId)
        .map((permittedCineroom) => permittedCineroom);

      next.push({ cineroomId: selectCineroomId, required: false, parentId });
    } else {
      //
      next = next
        .filter((permittedCineroom) => permittedCineroom.cineroomId !== selectCineroomId)
        .map((permittedCineroom) => permittedCineroom);
    }
  }
  setSelectPermittedCinerooms(next);
};
