import * as React from 'react';
import moment, { Moment } from 'moment';

import depot from '@nara.drama/depot';

import { CubeType, CardCategory } from 'shared/model';
import { alert, AlertModel } from 'shared/components';
import { isDefaultPolyglotBlank } from 'shared/components/Polyglot';
import { LoaderService } from 'shared/components/Loader';

import CubeService from '../../present/logic/CubeService';
import { CubeModel } from '../../model/CubeModel';
import Community from '../../../../community/community/model/Community';
import { OperatorModel } from '../../../../community/community/model/OperatorModel';
import { OfficeWebModel, OfficeWebService, CubeDiscussionService } from '../../../../cubetype';
import { MediaModel } from '../../../media/model/MediaModel';
import { MediaType } from '../../../media/model/vo/MediaType';
import { ClassroomGroupService, ClassroomModel } from '../../../classroom';
import { MediaService } from '../../../media';
import { CubeDiscussionModel } from 'cube/cubeDiscussion/model/CubeDiscussionModel';
import { CollegeService } from '../../../../college';
import { divisionCategories } from '../../../../card/card/ui/logic/CardHelper';
import { BoardModel } from 'cube/board/board/model/BoardModel';
import CommunityStore from '../../../../community/community/mobx/CommunityStore';
import { BoardService } from '../../../board/board';
import { Instructor } from '../../model/vo/Instructor';
import CubeInstructorModel from '../../CubeInstructorModel';
import { InstructorService } from '../../../../instructor/instructor';
import { MemberService } from '../../../../approval';
import { CardService } from '../../../../card';
import CommentApi from '../../../../feedback/comment/present/apiclient/CommentApi';
import { CommentFeedbackModel } from '../../../../feedback/comment/model/CommentFeedbackModel';
import { SurveyCaseService, SurveyFormService } from '../../../../survey';

export function basicInfoValidationCheck(cubeService: CubeService, cube: CubeModel, cubeCommunity: Community): boolean {
  //
  // const { cubeService } = this.injected;
  // const { cube, cubeCommunity } = cubeService;

  //기본정보 입력항목 체크(노출정보의 아이콘 항목 포함)
  let cubeValidation = CubeModel.isBlank(cube);

  const cubeMessage = '"' + cubeValidation + '" 은(는) 필수 입력 항목입니다. 해당 정보를 입력하신 후 저장해주세요.';
  if (cubeValidation !== 'success') {
    // console.log('cubeMessage : ', cubeMessage);
    alert(AlertModel.getCustomAlert(false, '필수 입력 정보 안내', cubeMessage, '확인', () => {}));
    return false;
  }

  if (cube.type === CubeType.Cohort) {
    if (cubeCommunity.communityId) {
      cubeValidation = 'success';
    } else {
      cubeValidation = 'community';
    }
  }

  const cohortMessage = '"' + cubeValidation + '" 은(는) 필수 입력 항목입니다. 해당 정보를 입력하신 후 저장해주세요.';
  if (cubeValidation !== 'success') {
    alert(AlertModel.getCustomAlert(false, '필수 입력 정보 안내', cohortMessage, '확인', () => {}));
    return false;
  }
  return true;
}

export function descriptionValidationCheck(
  cubeService: CubeService,
  cube: CubeModel,
  cubeOperator: OperatorModel
): boolean {
  //교육정보 입력항목 체크
  let cubeObject: string = 'success';
  if (cube.type === CubeType.ClassRoomLecture || cube.type === CubeType.ELearning) {
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.goal)) cubeObject = '교육목표';
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.applicants)) cubeObject = '교육대상';
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.description)) cubeObject = '교육내용';
    // if (!cube.learningTime) cubeObject = '교육시간';
    if (!cube.cubeContents.organizerId) cubeObject = '교육기관/출처';
    if (!cubeOperator.patronKey.keyString) cubeObject = '담당자 정보';
    // if (cube.learningTime == 0) cubeObject = '교육시간';
  }

  if (cube.type === CubeType.Video || cube.type === CubeType.Audio) {
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.goal)) cubeObject = '교육목표';
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.applicants)) cubeObject = '교육대상';
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.description)) cubeObject = '교육내용';
    if (!cube.cubeContents.organizerId) cubeObject = '교육기관/출처';
    // if (!cubeInstructors.some((target) => target.representative)) cubeObject = '대표 강사';
    if (!cubeOperator.patronKey.keyString) cubeObject = '담당자 정보';
    // if (cube.learningTime == 0) cubeObject = '교육시간';
  }
  if (cube.type === CubeType.WebPage) {
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.goal)) cubeObject = '교육목표';
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.applicants)) cubeObject = '교육대상';
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.description)) cubeObject = '교육내용';
    if (!cube.cubeContents.organizerId) cubeObject = '교육기관/출처';
    // if (!cubeInstructors.some((target) => target.representative)) cubeObject = '대표 강사';
    if (!cubeOperator.patronKey.keyString) cubeObject = '담당자 정보';
    //if (cube.learningTime == 0) cubeObject = '교육시간';
  }
  if (cube.type === CubeType.Cohort) {
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.goal)) cubeObject = '교육목표';
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.applicants)) cubeObject = '교육대상';
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.description)) cubeObject = '교육내용';
    if (!cubeOperator.patronKey) cubeObject = '담당자 정보';
    // if (cube.learningTime == 0) cubeObject = '교육시간';
  }
  if (cube.type === CubeType.Documents) {
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.goal)) cubeObject = '교육목표';
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.applicants)) cubeObject = '교육대상';
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.description)) cubeObject = '교육내용';
    if (!cube.cubeContents.organizerId) cubeObject = '교육기관/출처';
    // if (!cubeInstructors.some((target) => target.representative)) cubeObject = '대표 강사';
    if (!cubeOperator.patronKey.keyString) cubeObject = '담당자 정보';
    // if (cube.learningTime == 0) cubeObject = '교육시간';
  }
  if (cube.type === CubeType.Experiential) {
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.goal)) cubeObject = '교육목표';
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.applicants)) cubeObject = '교육대상';
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.description)) cubeObject = '교육내용';
    if (!cube.cubeContents.organizerId) cubeObject = '교육기관/출처';
    // if (!cubeInstructors.some((target) => target.representative)) cubeObject = '대표 강사';
    if (!cubeOperator.patronKey.keyString) cubeObject = '담당자 정보';
    // if (cube.learningTime == 0) cubeObject = '교육시간';
  }
  if (cube.type === CubeType.Task || cube.type === CubeType.Community || cube.type === CubeType.Discussion) {
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.goal)) cubeObject = '교육목표';
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.applicants)) cubeObject = '교육대상';
    // if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.description)) cubeObject = '교육내용';
    if (!cube.cubeContents.organizerId) cubeObject = '교육기관/출처';
    // if (!cubeInstructors.some((target) => target.representative)) cubeObject = '대표 강사';
    if (!cubeOperator.patronKey.keyString) cubeObject = '담당자 정보';
    // if (cube.learningTime == 0) cubeObject = '교육시간';
  }

  const cubeIntroMessage = '"' + cubeObject + '" 은(는) 필수 입력 항목입니다. 해당 정보를 입력하신 후 저장해주세요.';
  if (cubeObject !== 'success') {
    alert(AlertModel.getCustomAlert(false, '필수 입력 정보 안내', cubeIntroMessage, '확인', () => {}));
    return false;
  }
  return true;
}

export function descriptionValidationCheckForUserCube(
  cubeService: CubeService,
  cube: CubeModel,
  cubeOperator: OperatorModel
): boolean {
  //교육정보 입력항목 체크
  let cubeIntroObject: string = 'success';

  if (cube.type === CubeType.Video || cube.type === CubeType.Audio) {
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.goal)) cubeIntroObject = '교육목표';
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.applicants))
      cubeIntroObject = '교육대상';
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.description))
      cubeIntroObject = '교육내용';
    if (!cube.cubeContents.organizerId) cubeIntroObject = '교육기관/출처';
    // if (!cubeInstructors.some((target) => target.representative)) cubeIntroObject = '대표 강사';
    if (!cubeOperator.patronKey) cubeIntroObject = '담당자 정보';
  }
  if (cube.type === CubeType.WebPage) {
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.goal)) cubeIntroObject = '교육목표';
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.applicants))
      cubeIntroObject = '교육대상';
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.description))
      cubeIntroObject = '교육내용';
    if (!cube.cubeContents.organizerId) cubeIntroObject = '교육기관/출처';
    // if (!cubeInstructors.some((target) => target.representative)) cubeIntroObject = '대표 강사';
    if (!cubeOperator.patronKey) cubeIntroObject = '담당자 정보';
  }
  if (cube.type === CubeType.Documents) {
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.goal)) cubeIntroObject = '교육목표';
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.applicants))
      cubeIntroObject = '교육대상';
    if (isDefaultPolyglotBlank(cube.langSupports, cube.cubeContents.description.description))
      cubeIntroObject = '교육내용';
    if (!cube.cubeContents.organizerId) cubeIntroObject = '교육기관/출처';
    // if (!cubeInstructors.some((target) => target.representative)) cubeIntroObject = '대표 강사';
    if (!cubeOperator.patronKey) cubeIntroObject = '담당자 정보';
  }

  const cubeIntroMessage =
    '"' + cubeIntroObject + '" 은(는) 필수 입력 항목입니다. 해당 정보를 입력하신 후 저장해주세요.';
  if (cubeIntroObject !== 'success') {
    alert(AlertModel.getCustomAlert(false, '필수 입력 정보 안내', cubeIntroMessage, '확인', () => {}));
    return false;
  }
  return true;
}

export const classroomTypeInfoValidationCheck = async (
  cubeService: CubeService,
  officeWebService: OfficeWebService,
  classroomGroupService: ClassroomGroupService,
  mediaService: MediaService,
  cube: CubeModel,
  officeWeb: OfficeWebModel
): Promise<boolean> => {
  //부가정보 입력항목 체크
  let additionalObject: string = 'success';
  if (cube.type === CubeType.ClassRoomLecture || cube.type === CubeType.ELearning) {
    const { cubeClassrooms } = classroomGroupService;
    const { cubeInstructors } = cubeService;

    const roundCnt = cubeInstructors.length;
    const roundArr = [];
    for (let i = 0; i < roundCnt; i++) {
      roundArr.push(cubeInstructors.filter((instructor) => instructor.round === i + 1));
    }
    let instructorRoundCnt = 0;
    let representativeCnt = 0;
    for (let i = 0; i < roundArr.length; i++) {
      instructorRoundCnt += roundArr[i].length > 0 ? 1 : 0;
      roundArr[i].forEach((item) => {
        if (item.representative === true) {
          representativeCnt += 1;
        }
      });
    }
    if (representativeCnt < instructorRoundCnt) {
      alert(
        AlertModel.getCustomAlert(false, '필수 정보 입력  안내', '차수별 대표강사를 선택해주세요', '확인', () => {})
      );
      return false;
    }

    const isBlankClassroomMessage: string[] = cubeClassrooms.map((classroom) => {
      if (!classroom.capacity) return `Batch ${classroom.round} 차수 정원`;
      if (!classroom.operation.location) return `Batch ${classroom.round} 차수 교육장소`;
      if (!classroom.operation.operatorInfo.email) return `Batch ${classroom.round} 차수 담당자`;
      return 'success';
    });

    let message = 'success';
    isBlankClassroomMessage.forEach((blankMessage) => {
      if (blankMessage !== 'success') message = blankMessage;
    });
    additionalObject = message;

    if (additionalObject !== 'success') {
      alert(AlertModel.getCustomAlert(false, '필수 입력 정보 안내', additionalObject, '확인', () => {}));
      return false;
    }

    let requiredChargeAmount = false;
    cubeClassrooms.forEach((classroom) => {
      if (!classroom.freeOfCharge.freeOfCharge && classroom.freeOfCharge.chargeAmount <= 0) {
        requiredChargeAmount = true;
      }
    });

    if (requiredChargeAmount) {
      alert(
        AlertModel.getCustomAlert(
          false,
          '필수 입력 정보 안내',
          '유료 학습일 경우 교육비를 입력해주세요.',
          '확인',
          () => {}
        )
      );
      return false;
    }
  }

  if (cube.type === CubeType.Video) {
    const { media } = mediaService;
    additionalObject = MediaModel.isBlank(media);
  }

  if (cube.type === CubeType.Audio) {
    const { media } = mediaService;
    if (!media.mediaContents) {
      additionalObject = 'success';
    }
    if (!media.mediaType) additionalObject = '교육자료를 선택해주세요.';
    if (media.mediaType === MediaType.LinkMedia) {
      if (!media.mediaContents.linkMediaUrl) {
        additionalObject = '외부 오디오 url 을 입력해주세요';
      } else if (
        !media.mediaContents.linkMediaUrl.includes('http://') &&
        !media.mediaContents.linkMediaUrl.includes('https://')
      ) {
        additionalObject = '정확한 url 을 입력해주세요(http:// or https://)';
      }
    }
    if (media.mediaType === MediaType.ContentsProviderMedia) {
      if (media.mediaContents.contentsProvider.contentsProviderType.id === 'PVD000w') {
        if (!media.mediaContents.contentProviderContentId) {
          additionalObject = 'Coursera 컨텐츠를 선택해주세요';
        }
      } else if (media.mediaContents.contentsProvider.contentsProviderType.id === 'PVD0010') {
        if (!media.mediaContents.contentProviderContentId) {
          additionalObject = 'LinkedIn 컨텐츠를 선택해주세요';
        }
      }
      if (!media.mediaContents.contentsProvider.url) {
        additionalObject = 'cp 오디오 url 을 입력해주세요';
      } else if (
        !media.mediaContents.contentsProvider.url.includes('http://') &&
        !media.mediaContents.contentsProvider.url.includes('https://')
      ) {
        additionalObject = '정확한 url 을 입력해주세요';
      }
    }
    if (media.mediaType === MediaType.InternalMedia && !media.mediaContents.internalMedias.length) {
      additionalObject = '내부 오디오을 선택해주세요';
    }
    if (media.mediaContents.linkMediaUrl && media.mediaContents.linkMediaUrl.indexOf('sku.ap.panopto.com') !== -1) {
      additionalObject =
        'sku.ap.panopto.com 오디오은 “교육자료” 항목에서 “내부 오디오”을 선택하여 “오디오 선택” 버튼을 통해 등록해주시기 바랍니다.';
    }
    if (
      media.mediaContents.contentsProvider &&
      media.mediaContents.contentsProvider.url.indexOf('sku.ap.panopto.com') !== -1
    ) {
      additionalObject =
        'sku.ap.panopto.com 오디오은 “교육자료” 항목에서 “내부 오디오”을 선택하여 “오디오 선택” 버튼을 통해 등록해주시기 바랍니다.';
    }

    additionalObject = 'success';

    // 2021-06-11 긴급 배포로 인한 롤백
    if (
      media.mediaType === MediaType.InternalMedia &&
      media.mediaContents.internalMedias.filter((media) => media.duration === 0).length > 0
    ) {
      additionalObject = '동영상 재생시간이 없습니다.  새로고침 후 다시 등록해주세요.';
    }
  }

  if (cube.type === CubeType.WebPage) {
    if (!officeWeb.webPageUrl) additionalObject = '교육자료(URL)';
  }
  if (cube.type === CubeType.Documents) {
    additionalObject = await documentsAdditionalInfoIsBlank(officeWebService, officeWeb);
  }
  if (cube.type === 'Experiential') {
    if (!officeWeb.webPageUrl) additionalObject = '교육자료(URL)';
  }

  const additionalMessage =
    '"' + additionalObject + '" 은(는) 필수 입력 항목입니다. 해당 정보를 입력하신 후 저장해주세요.';
  if (additionalObject !== 'success') {
    if (cube.type === CubeType.Video || cube.type === CubeType.Audio) {
      alert(AlertModel.getCustomAlert(false, '필수 입력 정보 안내', additionalObject, '확인', () => {}));
      return false;
    } else {
      alert(AlertModel.getCustomAlert(false, '필수 입력 정보 안내', additionalMessage, '확인', () => {}));
      return false;
    }
  }
  return true;
};

export const documentsAdditionalInfoIsBlank = async (
  officeWebService: OfficeWebService,
  officeWeb: OfficeWebModel
): Promise<string> => {
  // console.log('officeWeb : ', officeWeb);
  if (!officeWeb.fileBoxId) {
    return '교육자료';
  } else {
    //officeWeb.fileBoxId 가 존재하더라도 실제 depot biz 에 파일목록이 존재하는 체크함.
    const fileBoxId = officeWeb.fileBoxId;

    //교육자료 FileBox 에 파일이 존재해야 officeWebService.officeWeb.fileBoxId 값 지정함.
    const depotFile: any = await depot.getDepotFiles(fileBoxId, true);

    if (depotFile) {
      if (officeWebService) {
        officeWebService.changeOfficeWebProps('fileBoxId', fileBoxId);
      }
      return 'success';
    } else {
      if (officeWebService) {
        officeWebService.changeOfficeWebProps('fileBoxId', '');
      }
      return '교육자료';
    }
  }
};

export function additionalInfoValidationCheck(cubeService: CubeService, cube: CubeModel): boolean {
  //
  if (
    cube.type === CubeType.Video ||
    cube.type === CubeType.Audio ||
    cube.type === CubeType.WebPage ||
    cube.type === CubeType.Task ||
    cube.type === CubeType.Documents ||
    cube.type === CubeType.Experiential ||
    cube.type === CubeType.Discussion
  ) {
    let additionalObject: string = 'success';

    if (!cube.cubeContents.reportFileBox.reportName) {
      if (cube.cubeContents.reportFileBox.fileBoxId || cube.cubeContents.reportFileBox.reportQuestion) {
        additionalObject = 'Report 명';
      }
    }

    const reportMessage =
      'Report 출제시 "' + additionalObject + '" 은(는) 필수 입력 항목입니다. 해당 정보를 입력하신 후 저장해주세요.';
    if (additionalObject !== 'success') {
      alert(AlertModel.getCustomAlert(false, '필수 입력 정보 안내', reportMessage, '확인', () => {}));
      return false;
    }
  }
  return true;
}

export function addDateValue(date: Moment, day: number) {
  return moment(date).add(day, 'day');
}

export function completionConditionVaildationCheck(
  cube: CubeModel,
  cubeDiscussion: CubeDiscussionModel,
  board: BoardModel
) {
  if (cube.type === CubeType.Task) {
    let isValidate = true;
    if (board.automaticCompletion) {
      if (board.completionCondition.postCount === 0 && board.completionCondition.commentCount === 0) {
        alert(AlertModel.getCustomAlert(false, '안내', 'Post/Comment 이수 조건을 입력해주세요.', '확인', () => {}));
        isValidate = false;
      }
    }

    return isValidate;
  } else if (cube.type === CubeType.Discussion) {
    let isValidate = true;
    if (cubeDiscussion.automaticCompletion) {
      if (
        !cubeDiscussion.privateComment &&
        cubeDiscussion.completionCondition.commentCount === 0 &&
        cubeDiscussion.completionCondition.subCommentCount === 0
      ) {
        alert(
          AlertModel.getCustomAlert(false, '안내', 'Comment/Comment Reply 이수 조건을 입력해주세요.', '확인', () => {})
        );
        isValidate = false;
      } else if (cubeDiscussion.privateComment && cubeDiscussion.completionCondition.commentCount === 0) {
        alert(AlertModel.getCustomAlert(false, '안내', 'Comment 이수 조건을 입력해주세요.', '확인', () => {}));
        isValidate = false;
      }
    }

    return isValidate;
  } else {
    return true;
  }
}

export function relatedUrlVaildationCheck(cube: CubeModel, cubeDiscussion: CubeDiscussionModel) {
  if (cube.type === CubeType.Discussion) {
    let isValidate = true;
    if (cubeDiscussion.relatedUrlList && cubeDiscussion.relatedUrlList.length > 0) {
      cubeDiscussion.relatedUrlList.forEach((relatedUrl, index) => {
        if (
          (relatedUrl.title !== '' || relatedUrl.url !== '') &&
          !relatedUrl.url?.includes('http://') &&
          !relatedUrl.url?.includes('https://')
        ) {
          alert(
            AlertModel.getCustomAlert(
              false,
              '안내',
              '관련 URL 링크는 http:// 또는 https:// 으로 시작되어야 합니다.',
              '확인',
              () => {}
            )
          );
          isValidate = false;
        }
      });
    }
    return isValidate;
  } else {
    return true;
  }
}

export function getMainCollegeAndChannelText(cubeService: CubeService, collegeService: CollegeService) {
  //
  const { cube } = cubeService;
  const { collegesMap, channelMap } = collegeService;

  if (cube.getMainCategory !== undefined) {
    const { collegeId, channelId, twoDepthChannelId } = cube.getMainCategory();

    if (collegeId && channelId) {
      return `${collegesMap.get(collegeId)} > ${
        (twoDepthChannelId && channelMap.get(twoDepthChannelId)) || channelMap.get(channelId)
      }`;
    }

    return '';
  } else {
    const { mainCategory } = divisionCategories(cube.categories);

    return `${collegesMap.get(mainCategory.collegeId) || ''} > ${
      (mainCategory.twoDepthChannelId && channelMap.get(mainCategory.twoDepthChannelId)) ||
      channelMap.get(mainCategory.channelId) ||
      ''
    }`;
  }
}

export function getSubCollegeAndChannelText(cubeService: CubeService, collegeService: CollegeService): JSX.Element {
  //
  const subCategories = cubeService.cube.categories.filter((category) => !category.mainCategory);
  const { collegesMap, channelMap } = collegeService;

  const subColleges: string[] = [];
  const subCollegesTexts: string[] = [];
  const copiedCategorys: CardCategory[] = [];

  subCategories.forEach((category) => {
    subColleges.indexOf(category.collegeId) === -1 && subColleges.push(category.collegeId);
  });

  subCategories.forEach((category) => {
    const hasChild = subCategories.some(
      (subCategory) => subCategory.twoDepthChannelId && subCategory.channelId === category.channelId
    );
    const isSeconCategory = (category.twoDepthChannelId && true) || false;

    (!hasChild || isSeconCategory) && copiedCategorys.push(category);
  });

  subColleges.forEach((collegeId) => {
    let text = '';
    copiedCategorys
      .filter((category) => category.collegeId === collegeId)
      .forEach((category, cIndex) => {
        cIndex === 0
          ? (text = `${collegesMap.get(category.collegeId) || ''} > ${
              (category.twoDepthChannelId && channelMap.get(category.twoDepthChannelId)) ||
              channelMap.get(category.channelId) ||
              ''
            }`)
          : (text += `, ${
              (category.twoDepthChannelId && channelMap.get(category.twoDepthChannelId)) ||
              channelMap.get(category.channelId) ||
              ''
            }`);
      });

    subCollegesTexts.push(text);
  });

  return (
    <>
      {subCollegesTexts.map((text, index) => (
        <p key={index}>{text}</p>
      ))}
    </>
  );
}

export function setCategories(categories: CardCategory[]): void {
  //
  const cubeService = CubeService.instance;
  const mainCategory = categories.find((target) => target.mainCategory);

  cubeService.setSubCategories(categories.filter((target) => !target.mainCategory));
  if (mainCategory) {
    cubeService.changeMainCategoryProps('collegeId', mainCategory.collegeId);
    cubeService.changeMainCategoryProps('channelId', mainCategory.channelId);
    cubeService.changeMainCategoryProps('mainCategory', true);
  }
}

export async function setCubeCommunity(communityId: string): Promise<void> {
  //
  const communityStore = CommunityStore.instance;
  const cubeService = CubeService.instance;
  const loaderService = LoaderService.instance;

  if (communityId) {
    // await this.requestAllCommunities();
    // const community = communityStore.communityList.results.find((target) => target.communityId === communityId);
    await communityStore.findCommunityAdmin(communityId);
    const community = communityStore.community;
    if (community) {
      cubeService.setCubeCommunity(community);
    }
  }
  loaderService.closeLoader(true, 'info');
}

export function setBoard(board: BoardModel) {
  //
  const boardService = BoardService.instance;
  if (board) {
    boardService.setBoard(board);
  } else {
    boardService.clearBoard();
  }
}

export async function setCubeInstructors(instructors: Instructor[]) {
  //
  const cubeService = CubeService.instance;
  const instructorService = InstructorService.instance;

  if (instructors && instructors.length !== 0) {
    const cubeInstructors = await instructorService
      .findInstructorsByIds(instructors.map((instructor) => instructor.instructorId))
      .then((instructorWiths) =>
        instructorWiths.map((instructorWiths) => CubeInstructorModel.asCubeInstructorByInstructorWiths(instructorWiths))
      );
    cubeService.setCubeInstructors([]);
    instructors.forEach((instructor) => {
      const targetInstructor = cubeInstructors.find((target) => target.id === instructor.instructorId);

      if (targetInstructor) {
        const targetInstructorModel = new CubeInstructorModel({
          ...targetInstructor,
          representative: instructor.representative,
          round: instructor.round,
          lectureTime: instructor.lectureTime,
          instructorLearningTime: instructor.instructorLearningTime,
        });
        cubeService.addCubeInstructors(targetInstructorModel);
      }
    });
  } else {
    cubeService.clearCubeInstructors();
  }
}

export async function setCubeOperator(id: string): Promise<void> {
  //
  const memberService = MemberService.instance;
  const cubeService = CubeService.instance;
  const loaderService = LoaderService.instance;

  if (id) {
    await memberService.findMemberById(id);
    cubeService.setCubeOperator(OperatorModel.fromMemberModel(memberService.member));
  }

  loaderService.closeLoader(true, 'description');
}

export async function findCardsByCubeId(cubeId: string): Promise<void> {
  //
  const cardService = CardService.instance;
  const loaderService = LoaderService.instance;
  await cardService.findByCubeId(cubeId);

  loaderService.closeLoader(true, 'cardMapping');
}

export async function setDetailByType(): Promise<void> {
  //
  const cubeService = CubeService.instance;
  const loaderService = LoaderService.instance;

  // 부가정보 - class rooms
  setCubeClassrooms(cubeService.cubeDetail.cubeMaterial.classrooms);
  // 부가정보 - media
  setCubeMedia(cubeService.cubeDetail.cubeMaterial.media);
  // 부가정보 - web
  setCubeOfficeWeb(cubeService.cubeDetail.cubeMaterial.officeWeb);
  // 부가정보 - Discussion
  await setCubeDiscussion(
    cubeService.cubeDetail.cubeMaterial.cubeDiscussion,
    cubeService.cubeDetail.cubeContents.commentFeedbackId
  );

  loaderService.closeLoader(true, 'detail');
}

export function setCubeClassrooms(cubeClassrooms: ClassroomModel[]) {
  //
  const classroomGroupService = ClassroomGroupService.instance;

  if (cubeClassrooms && cubeClassrooms.length !== 0) {
    classroomGroupService.setCubeClassrooms(
      cubeClassrooms.sort((current, next) => (current.round > next.round ? 1 : current.round < next.round ? -1 : 0))
    );

    cubeClassrooms.forEach((classroom, index) => {
      setClassroomOperator(index, classroom.operation.operator.keyString);
    });
  } else {
    classroomGroupService.clearCubeClassrooms();
  }
}

export async function setClassroomOperator(index: number, id: string) {
  //
  const memberService = MemberService.instance;
  const classroomGroupService = ClassroomGroupService.instance;
  if (id) {
    // FIXME: id null?
    await memberService.findMemberById(id);
    classroomGroupService.changeTargetCubeClassroomProps(
      index,
      'operation.operatorInfo',
      OperatorModel.fromMemberModel(memberService.member)
    );
  }
}

export function setCubeMedia(media: MediaModel): void {
  //
  const mediaService = MediaService.instance;
  if (media) {
    mediaService.setMedia(media);
  } else {
    mediaService.clearMedia();
  }
}

export function setCubeOfficeWeb(officeWeb: OfficeWebModel): void {
  //
  const officeWebService = OfficeWebService.instance;
  if (officeWeb) {
    officeWebService.setOfficeWeb(officeWeb);
  } else {
    officeWebService.clearOfficeWeb();
  }
}

export async function setCubeDiscussion(cubeDiscussion: CubeDiscussionModel, feedbackId: string): Promise<void> {
  //
  const cubeDiscussionService = CubeDiscussionService.instance;
  if (cubeDiscussion) {
    cubeDiscussionService.setMedia(cubeDiscussion);

    const commentFeedback = await setCommentFeedback(feedbackId);
    if (commentFeedback) {
      cubeDiscussionService.changeCubeDiscussionProps('privateComment', commentFeedback.config.privateComment);
    }
  } else {
    cubeDiscussionService.clearCubeDiscussion();
  }
}

export async function setCommentFeedback(feedbackId: string): Promise<CommentFeedbackModel> {
  //
  return CommentApi.instance.findCommentFeedback(feedbackId);
}

export async function setAdditional(): Promise<void> {
  //
  const cubeService = CubeService.instance;
  const loaderService = LoaderService.instance;

  // 추가 정보 - 설문
  await setSurveyForm(cubeService.cubeDetail.cubeContents.surveyId, cubeService.cubeDetail.cube.surveyCaseId);

  loaderService.closeLoader(true, 'additional');
}

export async function setSurveyForm(id: string, caseId: string): Promise<void> {
  //
  const surveyFormService = SurveyFormService.instance;
  const cubeService = CubeService.instance;
  const surveyCaseService = SurveyCaseService.instance;

  if (id) {
    await surveyFormService.findSurveyForm(id);
    cubeService.changeCubeProps('cubeContents.surveyTitle', surveyFormService.surveyForm.title);
    cubeService.changeCubeProps('cubeContents.surveyDesignerName', surveyFormService.surveyForm.formDesignerName);

    const surveyCommentId = await surveyCaseService.findSurveyCaseByFeedId(caseId);

    surveyFormService.setSurveyCommentId(surveyCommentId);
  }
}
