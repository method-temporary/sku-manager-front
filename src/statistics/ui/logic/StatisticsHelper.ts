import XLSX, { Sheet } from 'xlsx';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { UserGroupCategoryService } from 'usergroup';
import { PassedStudentExcelModel } from '../../model/PassedStudentExcelModel';

export async function getExcelHeader(userGroupCategoryService: UserGroupCategoryService, cineroomId: string) {
  //
  const groupHeader: string[] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  const header: string[] = [
    '성명',
    '이메일',
    '회사명',
    '소속부서',
    '멤버십 그룹',
    '학습 구분',
    'College명',
    'Channel명',
    'Card명',
    'Cube명',
    '학습시간(분)',
    '복습시간(초)',
    '유료과정 여부',
    '메인 카테고리 여부',
    '공개 여부',
    '완료일자',
    '사용자 그룹',
  ];
  const merge: any[] = [];

  let cIndex = header.length - 1; // setExcelUserGroupInfo()의 cellIndex와 같은 값을 설정해야함.

  await userGroupCategoryService.findUserGroupCategoriesWithUserGroupsByUserWorkspaceId(cineroomId);

  const userGroupCategoryList = userGroupCategoryService.userGroupCategoryList;

  userGroupCategoryList &&
    userGroupCategoryList.forEach((userGroupCategory) => {
      if (userGroupCategory.userGroups && userGroupCategory.userGroups.length > 0) {
        merge.push({
          s: { r: 0, c: cIndex + 1 },
          e: {
            r: 0,
            c: cIndex + userGroupCategory.userGroups.length,
          },
        });

        cIndex += userGroupCategory.userGroups.length;

        userGroupCategory.userGroups.forEach((userGroup, index) => {
          if (index === 0) groupHeader.push(getPolyglotToAnyString(userGroupCategory.name));
          else groupHeader.push('');
          header.push(getPolyglotToAnyString(userGroup.name));
        });
      }
    });

  return {
    groupHeader,
    header,
    merge,
  };
}

export function setExcelUserGroupInfo(
  sheet: Sheet,
  wbList: PassedStudentExcelModel[],
  userGroupCategoryService: UserGroupCategoryService,
  cineroomId: string
) {
  //
  const userGroupCategoryList = userGroupCategoryService.userGroupCategoryList;

  // sheet[XLSX.utils.encode_cell({ r: 1, c: 7 })] = { t: 's', v: 1 };

  let rowIndex = 1;

  wbList &&
    wbList.forEach((skProfile) => {
      const { '사용자 그룹': userGroupText } = skProfile;
      let cellIndex = 16; // getExcelHeader()의 cIndex와 같은 값을 설정해야함.

      rowIndex++;

      userGroupCategoryList &&
        userGroupCategoryList.forEach((userGroupCategory) => {
          const { userGroups } = userGroupCategory;

          userGroups &&
            userGroups.forEach((userGroup) => {
              cellIndex++;
              if (userGroupText.indexOf(getPolyglotToAnyString(userGroup.name)) > -1) {
                sheet[XLSX.utils.encode_cell({ r: rowIndex, c: cellIndex })] = { t: 'n', v: 1 };
              }
            });
        });
    });
}
