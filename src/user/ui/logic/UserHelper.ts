import XLSX, { Sheet } from 'xlsx';
import moment from 'moment';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import CardService from '../../../card/card/present/logic/CardService';
import { CardWithContents } from '../../../card';
import { CubeService } from '../../../cube';
import { CubeWithContents } from '../../../cube/cube';
import { UserGroupCategoryService } from '../../../usergroup';
import { UserExcelModel } from '../../model/UserExcelModel';
import { UserExcelUploadModel } from '../../model/UserExcelUploadModel';
import { UserUploadResponse } from '../../model/UserUploadResponse';

export async function getCardMap(cardIds: string[], cardService: CardService): Promise<Map<string, CardWithContents>> {
  //
  const cardMap = new Map<string, CardWithContents>();
  if (cardIds.length > 0) {
    //
    const cards = await cardService.findCardsForAdminByIds(cardIds);

    cards &&
      cards.forEach((cardWithContents) => {
        cardMap.set(cardWithContents.card.id, cardWithContents);
      });
  }

  return cardMap;
}

export async function getCubeMap(cubeIds: string[], cubeService: CubeService): Promise<Map<string, CubeWithContents>> {
  //
  const cubeMap = new Map<string, CubeWithContents>();
  if (cubeIds.length > 0) {
    //
    const cubes = await cubeService.findCubeWithContentsByIds(cubeIds);

    cubes &&
      cubes.forEach((cubeWithContents) => {
        cubeMap.set(cubeWithContents.cube.id, cubeWithContents);
      });
  }

  return cubeMap;
}

export async function getExcelHeader(userGroupCategoryService: UserGroupCategoryService, cineroomId: string) {
  //
  const groupHeader: string[] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  const header: string[] = [
    '사번',
    '성명(Ko)',
    '성명(En)',
    '성명(Zh)',
    '성별(Male/Female)',
    '생년월일(YYYY-MM-DD)',
    'E-mail',
    '소속회사(Ko)',
    '소속회사(En)',
    '소속회사(Zh)',
    '소속부서명(Ko)',
    '소속부서명(En)',
    '소속부서명(Zh)',
    '동의일자',
    '등록일자',
    '사용자 그룹',
  ];
  const merge: any[] = [];

  let cIndex = 15;

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
  wbList: UserExcelModel[],
  userGroupCategoryService: UserGroupCategoryService
) {
  //
  const userGroupCategoryList = userGroupCategoryService.userGroupCategoryList;

  let rowIndex = 1;

  wbList &&
    wbList.forEach((skProfile) => {
      const { '사용자 그룹': userGroupText } = skProfile;
      let cellIndex = 15;

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

export async function setSkProfileUserGroupInfo(
  jsonArray: any[],
  userGroupCategoryService: UserGroupCategoryService
): Promise<UserUploadResponse> {
  //
  const uploadList: UserExcelUploadModel[] = [];
  const result = new UserUploadResponse();

  await userGroupCategoryService.findAllUserGroupCategory();

  const userGroupCategoryList = userGroupCategoryService.userGroupCategoryList;

  jsonArray &&
    jsonArray.forEach((json) => {
      const uploadModel: UserExcelUploadModel = new UserExcelUploadModel();
      const sequences: number[] = [];

      const name = '성명(Ko)';
      const email = json['E-mail'];
      const gender = json['성별(Male/Female)'];
      const birthDate = json['생년월일(YYYY-MM-DD)'];

      if (result.success) {
        if (email) {
          uploadModel.email = email;

          if (gender === '' || gender === undefined) {
            uploadModel.gender = undefined;
          } else if (gender !== '1' && gender !== '2') {
            result.setSuccess(false);
            result.setMessage(
              `${json[name]}(${email})님의 "성별" 엑셀 값이 잘못 되었습니다. 수정 후 다시 시도해 주세요.`
            );
          } else {
            uploadModel.gender = gender;
          }

          const birthDateFormat = checkBirthDateFormat(birthDate);

          if (birthDateFormat === '') {
            uploadModel.birthDate = undefined;
          } else if (birthDateFormat === 'Invalid date' || birthDateFormat === 'Error') {
            result.setSuccess(false);
            result.setMessage(
              `${json[name]}(${email})님의 "생년월일" 엑셀 값이 잘못 되었습니다. 수정 후 다시 시도해 주세요.`
            );
          } else if (birthDateFormat === 'Date') {
            result.setSuccess(false);
            result.setMessage(
              `${json[name]}(${email})님의 "생년월일" 값이 오늘보다 크게 입력되었습니다. 수정 후 다시 시도해 주세요.`
            );
          } else {
            uploadModel.birthDate = birthDateFormat;
          }

          userGroupCategoryList &&
            userGroupCategoryList.forEach((userGroupCategory) => {
              const { userGroups } = userGroupCategory;

              userGroups &&
                userGroups.forEach((userGroup) => {
                  if (json[getPolyglotToAnyString(userGroup.name)]) {
                    if (json[getPolyglotToAnyString(userGroup.name)].toString() === '1') {
                      sequences.push(userGroup.sequence);
                    } else {
                      result.setSuccess(false);
                      result.setMessage(
                        `${json[name]}(${email})님의 "${userGroup.name}" 엑셀 값이 잘못 되었습니다. 수정 후 다시 시도해 주세요.`
                      );
                    }
                  }
                });
            });

          uploadModel.userGroupSequences.sequences = sequences;

          uploadList.push(uploadModel);
        }
      }
    });

  result.setList(uploadList);

  return result;
}

function checkBirthDateFormat(birthDate: string): string {
  //
  if (birthDate === '' || birthDate === undefined) {
    return '';
  }

  try {
    const date = new Date(birthDate);

    if (date > moment().toDate()) {
      return 'Date';
    }

    return moment(date).format('yyyy-MM-DD');
  } catch (e) {
    return 'Error';
  }
}

export const isMale = (gender: string) => {
  const genderNum = Number(gender);
  const result = genderNum % 2;

  return result === 1 ? true : false;
};

export const getGenderValues = (gender: string) => {
  const genderNum = Number(gender);
  if (genderNum === 1 || genderNum === 2) {
    return [1, 2];
  } else if (genderNum === 3 || genderNum === 4) {
    return [3, 4];
  } else if (genderNum === 5 || genderNum === 6) {
    return [5, 6];
  } else if (genderNum === 7 || genderNum === 8) {
    return [7, 8];
  } else {
    return [1, 2];
  }
};
