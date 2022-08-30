import { PatronType } from '@nara.platform/accent';

import { PolyglotModel } from 'shared/model';
import { yesNoToBoolean } from 'shared/helper';
import { alert, AlertModel } from 'shared/components';
import {
  getPolyglotToAnyString,
  isDefaultPolyglotBlank,
  LangSupport,
  langSupportCdo,
} from 'shared/components/Polyglot';

import { CubeDetail } from '_data/cube/model/CubeDetail';
import { CubeSdo, CubeSdoFunc } from '_data/cube/model/CubeSdo';
import { InstructorInCubeFunc } from '_data/cube/model/InstructorInCube';
import { ClassroomSdo } from '_data/cube/model/material';
import {
  existDuplicateCubeNameCheck,
  findCubeDetailsById,
  modifyCubeSdo,
  registerCubeSdo,
} from '_data/cube/api/cubeApis';

import CardCreateStore from '../../../CardCreate.store';
import LearningStore from '../../Learning.store';
import { LearningContentWithOptional } from '../../LearningContents/model/learningContentWithOptional';
import LearningContentsStore from '../LearningContents/LearningContents.store';
import EnrollmentCubeStore from './EnrollmentCube.store';
import { ETC_PROVIDER_ID } from './components/CubeOrganizerRow';
import dayjs from 'dayjs';
import { DEFAULT_DATE_FORMAT } from '../../../../../_data/shared';

/**
 * Enrollment Cube 생성을 위한 로직
 */
export async function registerCube(): Promise<boolean> {
  //
  const { learningContents, setLearningContents } = LearningContentsStore.instance;

  const newCube = getCubeSdo();

  // Cube Validation 체크
  const validCheck = await validateCube(newCube);

  if (!validCheck) {
    return false;
  }

  // Cube 생성 -> Id 반환
  const newCubeId = await registerCubeSdo(newCube);
  if (!newCubeId) {
    alert(AlertModel.getCustomAlert(false, '안내', 'Cube 등록에 실패하였습니다.', 'OK'));
    return false;
  }

  const newLearningContent = await getNewLearningContent(newCubeId, newCube);

  // learningContent 등록
  const newList = [...learningContents, newLearningContent];
  await setLearningContents(newList);

  alert(AlertModel.getCustomAlert(false, '안내', 'Cube가 등록되었습니다.', 'OK'));

  return true;
}

/**
 * Store에 있는 정보로 CubeSdo 모델 생성
 */
export function getCubeSdo(): CubeSdo {
  const { langSupports } = CardCreateStore.instance;
  const { enrollmentCards, approvalProcess, sendingMail, cancellationPenalty } = LearningStore.instance;
  const {
    type,
    mainCategory,
    sharingCineroomIds,
    name,
    goal,
    applicants,
    description,
    completionTerms,
    guide,
    tags,
    learningTime,
    difficultyLevel,
    organizerId,
    otherOrganizerName,
    instructors,
    operator,
    classroomSdos,
  } = EnrollmentCubeStore.instance;

  const langSupportCdos: LangSupport[] = langSupportCdo(langSupports);

  const newInstructor =
    (instructors.length > 0 &&
      instructors.map((instructor) => InstructorInCubeFunc.fromInstructorWithOptional(instructor))) ||
    [];

  const newClassrooms: ClassroomSdo[] =
    (classroomSdos.length > 0 &&
      classroomSdos.map((classroom) => {
        //
        const targetRound = enrollmentCards.find((round) => round.round === classroom.round);

        return {
          ...classroom,
          capacity: (targetRound && targetRound.capacity) || classroom.capacity || 0,
          enrolling: {
            ...classroom.enrolling,
            applyingPeriod: (targetRound && targetRound.applyingPeriod) || classroom.enrolling.applyingPeriod,
            cancellablePeriod: (targetRound && targetRound.cancellablePeriod) || classroom.enrolling.cancellablePeriod,
            cancellationPenalty: cancellationPenalty || '',
          },
          freeOfCharge: {
            ...classroom.freeOfCharge,
            approvalProcess: yesNoToBoolean(approvalProcess),
            sendingMail: yesNoToBoolean(sendingMail),
          },
          operation: {
            ...classroom.operation,
          },
        };
      })) ||
    [];

  // Cube 객체 생성
  const newCube: CubeSdo = {
    langSupports: langSupportCdos,
    type,
    categories: [{ ...mainCategory }],
    sharingCineroomIds: [...sharingCineroomIds],
    name,
    description: {
      goal,
      applicants,
      description,
      completionTerms: new PolyglotModel(completionTerms),
      guide,
    },
    tags,
    learningTime,
    difficultyLevel,
    instructors: newInstructor,
    operator: { keyString: operator?.id, patronType: PatronType.Denizen },
    materialSdo: {
      classroomSdos: newClassrooms,
    },
    organizerId,
    otherOrganizerName,
    fileBoxId: '',
  };

  return newCube;
}

/**
 * 신규 생성된 Cube 정보를 LearningContent 생성
 * @param cubeId
 * @param cube
 */
async function getNewLearningContent(cubeId: string, cube: CubeSdo): Promise<LearningContentWithOptional> {
  // Cube 조회
  // learningContent + Cube 객체 생성
  const cubeDetail: CubeDetail | undefined = (cubeId && (await findCubeDetailsById(cubeId))) || undefined;

  return {
    chapter: false,
    contentDetailType: cube.type,
    contentId: cubeId,
    description: null,
    enrollmentRequired: true,
    learningContentType: 'Cube',
    name: cube.name,
    parentId: '',
    cubeWithMaterial: cubeDetail,
    inChapter: false,
    selected: false,
  };
}

/**
 * Enrollment Cube 정보 수정
 */
export async function updateCube(): Promise<boolean> {
  //
  const { learningContents, setLearningContents } = LearningContentsStore.instance;
  const { selectedCubeId } = EnrollmentCubeStore.instance;

  const newCube = getCubeSdo();

  // Cube Validation 체크
  const validCheck = await validateCube(newCube, selectedCubeId);

  if (!validCheck) {
    return false;
  }

  // Cube 수정
  await modifyCubeSdo(selectedCubeId, newCube);

  const newLearningContent = await getNewLearningContent(selectedCubeId, newCube);

  // learningContent 등록
  let findIndex: {
    pIndex: number;
    cIndex?: number;
  };

  learningContents.forEach((content, pIndex) => {
    if (content.learningContentType === 'Chapter') {
      content.children &&
        content.children.length > 0 &&
        content.children.forEach((subContent, cIndex) => {
          if (subContent.contentId === selectedCubeId) {
            findIndex = { pIndex, cIndex };
          }
        });
    } else if (content.learningContentType === 'Cube') {
      if (content.contentId === selectedCubeId) {
        findIndex = { pIndex };
      }
    }
  });

  const newList = learningContents.map((content, pIndex) => {
    if (pIndex !== findIndex.pIndex) {
      return { ...content };
    } else {
      if (content.learningContentType === 'Chapter') {
        const childList: LearningContentWithOptional[] =
          (content.children &&
            content.children.length > 0 &&
            content.children.map((subContent, cIndex) => {
              if (cIndex !== findIndex.cIndex) {
                return { ...subContent };
              } else {
                return newLearningContent;
              }
            })) ||
          [];
        return { ...content, children: [...childList] };
      } else {
        return newLearningContent;
      }
    }
  });

  await setLearningContents(newList);

  alert(AlertModel.getCustomAlert(false, '안내', 'Cube가 수정되었습니다.', 'OK'));

  return true;
}

/**
 * Card 안에 모든 Enrollment Cube의 유효성 검사
 */
export async function validateCubesInCard(): Promise<boolean> {
  //
  const { learningContents } = LearningContentsStore.instance;

  const enrollmentCubes: { cube: CubeDetail; pIndex?: number; cIndex?: number }[] = [];

  learningContents.forEach((content, pIndex) => {
    if (content.learningContentType === 'Chapter') {
      content.children &&
        content.children.length > 0 &&
        content.children.forEach((subContent, cIndex) => {
          if (
            subContent.learningContentType === 'Cube' &&
            (subContent.contentDetailType === 'ELearning' || subContent.contentDetailType === 'ClassRoomLecture') &&
            subContent.cubeWithMaterial
          ) {
            enrollmentCubes.push({ cube: subContent.cubeWithMaterial, pIndex, cIndex });
          }
        });
    } else if (
      content.learningContentType === 'Cube' &&
      (content.contentDetailType === 'ELearning' || content.contentDetailType === 'ClassRoomLecture')
    ) {
      content.cubeWithMaterial && enrollmentCubes.push({ cube: content.cubeWithMaterial, pIndex });
    }
  });

  let result = true;

  /* eslint-disable no-await-in-loop */
  for await (const obj of enrollmentCubes) {
    const valid = await validateCube(CubeSdoFunc.fromCubeDetail(obj.cube), obj.cube.cube.id, true);
    if (!valid) {
      result = false;
      break;
    }
  }

  return result;
}

/**
 * Enrollment Cube의 유효성 검사
 * @param cube 유효성 검사 대상 Cube
 * @param cubeId
 * @param pIndex 전체 LearningContents 내 포함된 Cube / Talk / Chapter번째 확인
 * @param cIndex Chapter에 포함된 경우 하위 번호
 */
export async function validateCube(cube: CubeSdo, cubeId?: string, isInLearningContents?: boolean): Promise<boolean> {
  //
  let prefix = '';
  if (isInLearningContents !== undefined) {
    prefix += getPolyglotToAnyString(cube.name) + ' 학습 ';
  }

  if (
    !cube.langSupports ||
    cube.langSupports.length < 1 ||
    cube.langSupports.filter((lang) => lang.defaultLang).length !== 1
  ) {
    alert(AlertModel.getRequiredChoiceAlert(prefix + '(Error) 지원 언어 오류'));
    return false;
  }

  if (cube.type !== 'ELearning' && cube.type !== 'ClassRoomLecture') {
    alert(AlertModel.getRequiredChoiceAlert(prefix + '(Error) 학습 유형 오류'));
    return false;
  }

  if (cube.categories.length < 1 || cube.categories.filter((category) => category.mainCategory).length !== 1) {
    alert(AlertModel.getRequiredChoiceAlert(prefix + '메인 채널'));
    return false;
  }

  if (isDefaultPolyglotBlank(cube.langSupports, cube.name)) {
    alert(AlertModel.getRequiredInputAlert(prefix + 'Cube 명'));
    return false;
  }

  if (!cube.description || isDefaultPolyglotBlank(cube.langSupports, cube.description.goal)) {
    alert(AlertModel.getRequiredInputAlert(prefix + '교육목표'));
    return false;
  }

  if (!cube.description || isDefaultPolyglotBlank(cube.langSupports, cube.description.applicants)) {
    alert(AlertModel.getRequiredInputAlert(prefix + '교육대상'));
    return false;
  }

  if (!cube.description || isDefaultPolyglotBlank(cube.langSupports, cube.description.description)) {
    alert(AlertModel.getRequiredInputAlert(prefix + '교육내용'));
    return false;
  }

  // if (cube.learningTime <= 0) {
  //   alert(AlertModel.getRequiredInputAlert(prefix + '교육시간'));
  //   return false;
  // }

  if (!cube.difficultyLevel) {
    alert(AlertModel.getRequiredInputAlert(prefix + '난이도'));
    return false;
  }

  if (!cube.organizerId || (cube.organizerId === ETC_PROVIDER_ID && !cube.otherOrganizerName)) {
    alert(AlertModel.getRequiredInputAlert(prefix + '교육기관/출처'));
    return false;
  }

  // 차수 검증
  if (!cube.materialSdo.classroomSdos || cube.materialSdo.classroomSdos.length <= 0) {
    alert(AlertModel.getRequiredInputAlert(prefix + '(error) 차수 정보 사이즈 0'));
    return false;
  }

  if (cube.materialSdo.classroomSdos.filter((classroom) => !classroom.operation).length > 0) {
    alert(AlertModel.getRequiredInputAlert(prefix + '(error) classroom operation 누락'));
    return false;
  }

  if (cube.materialSdo.classroomSdos.filter((classroom) => !classroom.freeOfCharge).length > 0) {
    alert(AlertModel.getRequiredInputAlert(prefix + '(error) classroom freeOfCharge 누락'));
    return false;
  }
  //

  const { isInstructorNullCheck } = EnrollmentCubeStore.instance;
  if (!isInLearningContents && cube.instructors.length < 1 && !isInstructorNullCheck) {
    alert(AlertModel.getCustomAlert(true, '안내', prefix + '강사를 선택해주세요.', '확인'));
    return false;
  }

  if (
    cube.instructors &&
    cube.instructors.length > 0 &&
    cube.instructors.filter((instructor) => instructor.representative).length !== 1
  ) {
    alert(AlertModel.getRequiredChoiceAlert(prefix + '대표 강사'));
    return false;
  }

  if (!cube.operator || !cube.operator.keyString) {
    alert(AlertModel.getRequiredChoiceAlert('담당자 정보'));
    return false;
  }

  let notExistLocation = false;
  let notExistSiteUrl = false;
  let notExistCharge = false;
  let errLearningTime = false;
  let isZeroCapacity = false;
  let roundIdx = -1;

  const { enrollmentCards } = LearningStore.instance;

  for (const classroom of cube.materialSdo.classroomSdos) {
    roundIdx = classroom.round;
    if (!classroom.operation || !classroom.operation.location) {
      notExistLocation = true;
      break;
    }
    // E-learning의 경우에만 필수
    if (cube.type === 'ELearning' && (!classroom.operation || !classroom.operation.siteUrl)) {
      notExistSiteUrl = true;
      break;
    }
    if (!classroom.freeOfCharge || (!classroom.freeOfCharge.freeOfCharge && !classroom.freeOfCharge.chargeAmount)) {
      notExistCharge = true;
      break;
    }
    if (!classroom.capacity || classroom.capacity < 1) {
      isZeroCapacity = true;
      break;
    }

    const targetRound = enrollmentCards.find((roundInfo) => roundInfo.round === classroom.round);
    const roundStartLearningTime =
      (targetRound &&
        targetRound.learningPeriod &&
        dayjs(targetRound.learningPeriod.startDate, DEFAULT_DATE_FORMAT).toDate().getTime()) ||
      undefined;
    const cubeStartLearningTime =
      (classroom &&
        classroom.enrolling &&
        classroom.enrolling.learningPeriod &&
        dayjs(classroom.enrolling.learningPeriod.startDate).toDate().getTime()) ||
      undefined;

    if (!roundStartLearningTime || !cubeStartLearningTime || roundStartLearningTime > cubeStartLearningTime) {
      errLearningTime = true;
      roundIdx = classroom.round;
      break;
    }

    const roundEndLearningTime =
      (targetRound &&
        targetRound.learningPeriod &&
        dayjs(targetRound.learningPeriod.endDate, DEFAULT_DATE_FORMAT).toDate().getTime()) ||
      undefined;
    const cubeEndLearningTime =
      (classroom &&
        classroom.enrolling &&
        classroom.enrolling.learningPeriod &&
        dayjs(classroom.enrolling.learningPeriod.endDate).toDate().getTime()) ||
      undefined;

    if (!roundEndLearningTime || !cubeEndLearningTime || roundEndLearningTime < cubeEndLearningTime) {
      errLearningTime = true;
      roundIdx = classroom.round;
      break;
    }
  }

  const roundPrefix = prefix + ((roundIdx >= 0 && `${roundIdx}차수의 `) || '');

  if (errLearningTime) {
    alert(
      AlertModel.getCustomAlert(
        true,
        '안내',
        roundPrefix + '교육기간은 Card 차수의 교육 기간 내로 설정하여야 합니다.',
        '확인'
      )
    );
    return false;
  }

  // if (isZeroCapacity) {
  //   alert(AlertModel.getRequiredInputAlert(`${roundIdx}차수의 정원을 입력해주세요.`));
  //   return false;
  // }

  if (notExistLocation) {
    alert(AlertModel.getRequiredInputAlert(roundPrefix + '교육장소'));
    return false;
  }

  if (notExistSiteUrl) {
    alert(AlertModel.getRequiredInputAlert(roundPrefix + '외부과정 URL'));
    return false;
  }

  if (notExistCharge) {
    alert(AlertModel.getRequiredInputAlert(roundPrefix + '유/무료 여부'));
    return false;
  }

  const duplicatedNameCount = await existDuplicateCubeNameCheck((cubeId && cubeId) || '', cube.name);

  if (duplicatedNameCount > 0) {
    alert(AlertModel.getCustomAlert(true, '안내', '중복된 Cube명이 이미 존재합니다.', '확인'));
    return false;
  }

  return true;
}

/**
 * cube의 차수 정보 중 location 정보가 전부 동일한지 확인
 * @param cube
 */
export function checkAllApplyLocation(cube: CubeDetail): boolean {
  const classrooms: ClassroomSdo[] = cube.cubeMaterial.classrooms;

  if (!classrooms || classrooms.length < 2) {
    return true;
  }

  return classrooms.every((classroom) => classroom.operation.location === classrooms[0].operation.location);
}

/**
 * cube의 차수 정보 중 siteUrl 정보가 전부 동일한지 확인
 * @param cube
 */
export function checkAllApplySiteUrl(cube: CubeDetail): boolean {
  const classrooms: ClassroomSdo[] = cube.cubeMaterial.classrooms;

  if (!classrooms || classrooms.length < 2) {
    return true;
  }

  return classrooms.every((classroom) => classroom.operation.siteUrl === classrooms[0].operation.siteUrl);
}

/**
 * cube의 차수 정보 중 유/무료(+유료 금액) 정보가 전부 동일한지 확인
 * @param cube
 */
export function checkAllApplyCharge(cube: CubeDetail): boolean {
  const classrooms: ClassroomSdo[] = cube.cubeMaterial.classrooms;

  if (!classrooms || classrooms.length < 2) {
    return true;
  }

  return classrooms.every(
    (classroom) =>
      classroom.freeOfCharge.freeOfCharge === classrooms[0].freeOfCharge.freeOfCharge &&
      classroom.freeOfCharge.chargeAmount === classrooms[0].freeOfCharge.chargeAmount
  );
}
