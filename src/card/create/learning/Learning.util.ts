import { EnrollmentCard } from '../../../_data/lecture/cards/model/EnrollmentCard';
import dayjs from 'dayjs';
import { DEFAULT_DATE_FORMAT } from '../../../_data/shared';
import { ClassroomFunc, ClassroomSdo, Enrolling, FreeOfCharge } from '../../../_data/cube/model/material';
import LearningStore from './Learning.store';
import { PatronType } from '@nara.platform/accent';
import { CubeDetail } from '../../../_data/cube/model/CubeDetail';
import LearningContentsStore from './learningPlan/LearningContents/LearningContents.store';
import {
  checkAllApplyCharge,
  checkAllApplyLocation,
  checkAllApplySiteUrl,
} from './learningPlan/enrollmentCube/EnrollmentCube.util';
import { Operation } from '../../../_data/cube/model/Operation';
import EnrollmentCubeStore from './learningPlan/enrollmentCube/EnrollmentCube.store';
import { InstructorWithUserRdo } from '../../../_data/user/instructors/model/InstructorWithUserRdo';
import { findInstructorsByIds } from '../../../_data/user/instructors/api/instructorApi';
import {
  InstructorWithOptional,
  InstructorWithOptionalFunc,
} from '../../../instructor/instructor/shared/components/instructorModal/model/InstructorWithOptional';
import MemberApi from '../../../_data/approval/members/api/MemberApi';
import { PolyglotModel } from '../../../shared/model';
import { LearningContentWithOptional } from './LearningContents/model/learningContentWithOptional';
import { Category } from '../../../_data/college/model';
import { InstructorInCube } from '../../../_data/cube/model/InstructorInCube';

/**
 * 차수 정보의 Validation 체크
 * @param enrollmentCard
 */
export function checkAndChangeRoundDateValidation(enrollmentCard: EnrollmentCard): EnrollmentCard {
  //
  const next = { ...enrollmentCard };

  /**
   * - 일부 validation 미동작 처리
   * 사유 : 명확한 조건 미정의
   * 일시 : 2022-04-25
   * 작업자 : 김민준
   */

  // 신청기간 startDate 가 신청기간 endDate 보다 뒤일 경우
  // 신청기간 endDate 를  신청기간 startDate 의 한 달 뒤로 수정
  if (dayjs(next.applyingPeriod.startDate).isAfter(dayjs(next.applyingPeriod.endDate))) {
    next.applyingPeriod.endDate = dayjs(next.applyingPeriod.startDate).add(1, 'M').format(DEFAULT_DATE_FORMAT);
  }

  // 신청기간 startDate 가 취소가능기간 startDate 보다 뒤일 경우
  // 취소가능기간 startDate 을 신청기간 startDate 와 같은 날로 수정
  // if (dayjs(next.applyingPeriod.startDate).isAfter(next.cancellablePeriod.startDate)) {
  //   next.cancellablePeriod.startDate = dayjs(next.applyingPeriod.startDate).format(DEFAULT_DATE_FORMAT);
  // }

  // 신청기간 endDate 가 취소가능기간 endDate 보다 뒤일 경우
  // 취소가능기간 endDate 를 신청기간 endDate 와 같은 날로 수정
  // if (dayjs(next.applyingPeriod.endDate).isAfter(next.cancellablePeriod.endDate)) {
  //   next.cancellablePeriod.endDate = dayjs(next.applyingPeriod.endDate).format(DEFAULT_DATE_FORMAT);
  // }

  // 취소가능기간 startDate 가 취소가능기간 endDate 보다 뒤일 경우
  // 취소가능기간 endDate 를  취소가능기간 startDate 한 달 뒤로 수정
  if (dayjs(next.cancellablePeriod.startDate).isAfter(next.cancellablePeriod.endDate)) {
    next.cancellablePeriod.endDate = dayjs(next.cancellablePeriod.startDate).add(1, 'M').format(DEFAULT_DATE_FORMAT);
  }

  // 신청기간 startDate 가 교육기간 startDate 보다 뒤일 경우
  // 교육기간 startDate 를 취소가능기간 endDate 하루 뒤로 수정
  // if (dayjs(next.applyingPeriod.startDate).isAfter(dayjs(next.learningPeriod.startDate))) {
  //   next.learningPeriod.startDate = dayjs(next.cancellablePeriod.endDate).add(1, 'd').format(DEFAULT_DATE_FORMAT);
  // }

  // 취소가능기간 startDate 가 교육기간 startDate 보다 뒤일 경우
  // 교육기간 startDate 를 취소가능기간 endDate 하루 뒤로 수정
  // if (dayjs(next.cancellablePeriod.startDate).isAfter(dayjs(next.learningPeriod.startDate))) {
  //   next.learningPeriod.startDate = dayjs(next.cancellablePeriod.endDate).add(1, 'd').format(DEFAULT_DATE_FORMAT);
  // }

  // 취소가능기간 endDate 가 교육기간 startDate 보다 뒤일 경우
  // 교육기간 startDate 를 취소가능기간 endDate 하루 뒤로 수정
  // if (dayjs(next.cancellablePeriod.endDate).isAfter(next.learningPeriod.startDate)) {
  //   next.learningPeriod.startDate = dayjs(next.cancellablePeriod.endDate).add(1, 'd').format(DEFAULT_DATE_FORMAT);
  // }

  // 교육기간 startDate 가 교육기간 endDate 보다 뒤일 경우
  // 교육기간 endDate 를 교육기간 startDate 의 한 달 뒤로 수정
  if (dayjs(next.learningPeriod.startDate).isAfter(next.learningPeriod.endDate)) {
    next.learningPeriod.endDate = dayjs(next.learningPeriod.startDate).add(1, 'M').format(DEFAULT_DATE_FORMAT);
  }

  return next;
}

/**
 * Card 내 Enrollment Cube의 차수 정보 갱신
 */
export function settingRoundInfoInAllEnrollmentCubes() {
  //

  const { setLearningContents } = LearningContentsStore.instance;

  // 1) 차수 기본 정보 생성
  const baseRoundInfos = makeDefaultClassrooms();

  // 2) 갱신 대상 큐브 확인
  const enrollmentCubes = getEnrollmentCubes();

  // 3) 각 Cube 신규 정보 생성
  const newEnrollmentCube =
    (enrollmentCubes &&
      enrollmentCubes.length > 0 &&
      enrollmentCubes.map((cube) => compareAndRemakeCubeDetail(cube, baseRoundInfos))) ||
    [];

  // 4) Learning Contents 재구성
  const newLearningContents = settingLearningContents(newEnrollmentCube);

  setLearningContents(newLearningContents);
}

/**
 * Card의 EnrollmentCards(차수정보)로 기본 베이스 정보 생성
 */
function makeDefaultClassrooms(): ClassroomSdo[] {
  //
  const { enrollmentCards } = LearningStore.instance;

  const newClassrooms: ClassroomSdo[] =
    enrollmentCards.map((roundInfo, index) => ({
      round: roundInfo.round,
      waitingCapacity: 0,
      capacity: roundInfo.capacity,
      operation: {
        location: '',
        siteUrl: '',
        operator: {
          keyString: '',
          patronType: PatronType.Denizen,
        },
      },
      freeOfCharge: {
        approvalProcess: false,
        chargeAmount: 0,
        freeOfCharge: true,
        sendingMail: false,
      },
      enrolling: {
        applyingPeriod: roundInfo.applyingPeriod,
        cancellablePeriod: roundInfo.cancellablePeriod,
        cancellationPenalty: '',
        enrollingAvailable: false,
        learningPeriod: roundInfo.learningPeriod,
      },
      capacityClosed: false,
    })) || [];

  return newClassrooms;
}

/**
 * Card의 LearningContent 중에서 차수를 가진 CubeDetail 목록 조회
 */
function getEnrollmentCubes(): CubeDetail[] {
  //
  const { learningContents } = LearningContentsStore.instance;

  const enrollmentCubes: CubeDetail[] = [];

  learningContents.forEach((content) => {
    if (content.learningContentType === 'Chapter') {
      content.children &&
        content.children.length > 0 &&
        content.children.forEach((subContent: LearningContentWithOptional) => {
          if (isEnrollmentCube(subContent) && subContent.cubeWithMaterial) {
            enrollmentCubes.push(subContent.cubeWithMaterial);
          }
        });
    } else if (isEnrollmentCube(content) && content.cubeWithMaterial) {
      enrollmentCubes.push(content.cubeWithMaterial);
    }
  });

  return enrollmentCubes;
}

/**
 * 해당 LearningContent가 enrollmentCube의 차수 정보를 가질 수 있는지 확인
 * @param content
 */
function isEnrollmentCube(content: LearningContentWithOptional): boolean {
  //
  if (content.learningContentType !== 'Cube') {
    return false;
  }

  if (!content.cubeWithMaterial) {
    return false;
  }

  if (content.contentDetailType !== 'ClassRoomLecture' && content.contentDetailType !== 'ELearning') {
    return false;
  }

  return true;
}

/**
 * 각 상태값을 확인하여 CbueDetail 차수 정보 재구성
 * @param cube
 * @param roundBaseInfo
 */
function compareAndRemakeCubeDetail(cube: CubeDetail, roundBaseInfo: ClassroomSdo[]): CubeDetail {
  //
  // 1) 설정 기준 확인
  // 1.1) location 일괄 적용 여부 확인
  // 1.2) siteUrl 일괄 적용 여부 확인
  // 1.3) 유/무료 + 금액 일괄 적용 여부 확인
  const isAllApplyLocation = checkAllApplyLocation(cube);
  const isAllApplyUrl = checkAllApplySiteUrl(cube);
  const isAllApplyCharge = checkAllApplyCharge(cube);

  // 2) enrolling 정보 생성
  const enrollingMap: Map<number, Enrolling> = new Map();

  roundBaseInfo.length > 0 &&
    roundBaseInfo.forEach((baseInfo, index) => {
      const targetRoundInCube =
        (cube.cubeMaterial.classrooms &&
          cube.cubeMaterial.classrooms.length > 0 &&
          cube.cubeMaterial.classrooms.find((classroom, idx) => index === idx)) ||
        undefined;

      enrollingMap.set(index, {
        applyingPeriod: baseInfo.enrolling.applyingPeriod,
        cancellablePeriod: baseInfo.enrolling.cancellablePeriod,
        cancellationPenalty: '',
        learningPeriod:
          (targetRoundInCube && targetRoundInCube.enrolling.learningPeriod) || baseInfo.enrolling.learningPeriod,
        enrollingAvailable: false,
      });
    });

  // 3) operation 정보 생성
  const operationMap: Map<number, Operation> = new Map();

  roundBaseInfo.forEach((baseInfo, index) => {
    const firstData = cube.cubeMaterial.classrooms[0].operation;
    const beforeData = (cube.cubeMaterial.classrooms[index] && cube.cubeMaterial.classrooms[index].operation) || null;
    const newOperation: Operation = {
      location:
        (isAllApplyLocation && firstData.location) ||
        (beforeData && beforeData.location) ||
        baseInfo.operation.location ||
        '',
      siteUrl:
        (isAllApplyUrl && firstData.siteUrl) || (beforeData && beforeData.siteUrl) || baseInfo.operation.siteUrl || '',
      operator: {
        keyString: '',
        patronType: PatronType.Denizen,
      },
    };
    operationMap.set(index, newOperation);
  });

  // 3) charge 정보 생성
  const chargeMap: Map<number, FreeOfCharge> = new Map();

  roundBaseInfo.forEach((baseInfo, index) => {
    const firstData = cube.cubeMaterial.classrooms[0].freeOfCharge;
    const beforeData =
      (cube.cubeMaterial.classrooms[index] && cube.cubeMaterial.classrooms[index].freeOfCharge) || null;
    const newOperation: FreeOfCharge = {
      freeOfCharge: isAllApplyCharge ? firstData.freeOfCharge : beforeData ? beforeData.freeOfCharge : true,
      sendingMail: false,
      chargeAmount: isAllApplyCharge ? firstData.chargeAmount : beforeData ? beforeData.chargeAmount : 0,
      approvalProcess: false,
    };
    chargeMap.set(index, newOperation);
  });

  // 4) classroom 정보 생성
  const newClassrooms: ClassroomSdo[] =
    roundBaseInfo.map((baseInfo, index) => {
      return {
        round: index + 1,
        capacity: baseInfo.capacity,
        enrolling: enrollingMap.get(index) || baseInfo.enrolling,
        freeOfCharge: chargeMap.get(index) || baseInfo.freeOfCharge,
        operation: operationMap.get(index) || baseInfo.operation,
        capacityClosed: false,
        waitingCapacity: 0,
      };
    }) || [];

  return {
    ...cube,
    cubeMaterial: {
      ...cube.cubeMaterial,
      classrooms: newClassrooms.map((classroom) => ClassroomFunc.fromClassroomSdo(cube.cube.id, classroom)),
    },
  };
}

/**
 * LearningContents Detail을 수정하여 재구성
 * @param cubes
 */
function settingLearningContents(cubes: CubeDetail[]): LearningContentWithOptional[] {
  //
  const { learningContents } = LearningContentsStore.instance;

  const newLearningContent: LearningContentWithOptional[] = [];

  learningContents &&
    learningContents.map((content) => {
      if (content.learningContentType === 'Chapter') {
        const childList: LearningContentWithOptional[] = [];
        content.children &&
          content.children.length > 0 &&
          content.children.forEach((subContent: LearningContentWithOptional) => {
            const findDetail = cubes.find((cube) => cube.cube.id === subContent.contentId) || null;
            (findDetail && childList.push({ ...subContent, cubeWithMaterial: findDetail })) ||
              childList.push({ ...subContent });
          });
        newLearningContent.push({
          ...content,
          children: (childList && childList.length > 0 && [...childList]) || undefined,
        });
      } else {
        const findDetail = cubes.find((cube) => cube.cube.id === content.contentId);
        newLearningContent.push({ ...content, cubeWithMaterial: findDetail || content.cubeWithMaterial });
      }
    });

  return newLearningContent;
}

export function initRoundInfo() {
  //
  const { enrollmentCards } = LearningStore.instance;
  const { setClassroomSdos } = EnrollmentCubeStore.instance;

  const newClassrooms: ClassroomSdo[] =
    (enrollmentCards &&
      enrollmentCards.map((roundInfo, index) => {
        return {
          round: index + 1,
          operation: {
            operator: {
              keyString: '',
              patronType: PatronType.Denizen,
            },
            siteUrl: '',
            location: '',
          },
          waitingCapacity: 0,
          enrolling: {
            applyingPeriod: roundInfo.applyingPeriod,
            cancellablePeriod: roundInfo.cancellablePeriod,
            cancellationPenalty: '',
            enrollingAvailable: false,
            learningPeriod: roundInfo.learningPeriod,
          },
          freeOfCharge: {
            freeOfCharge: true,
            chargeAmount: 0,
            approvalProcess: false,
            sendingMail: false,
          },
          capacityClosed: false,
          capacity: roundInfo.capacity,
        };
      })) ||
    [];

  setClassroomSdos(newClassrooms);
}

/**
 * EnrollmentCube애 Detail 세팅
 * @param cubeId
 */
export async function setEnrollmentCubeDetail(cubeId: string) {
  //
  const { learningContents } = LearningContentsStore.instance;
  const {
    setType,
    setMainCategory,
    setSharingCineroomIds,
    setName,
    setGoal,
    setApplicants,
    setDescription,
    setCompletionTerms,
    setGuide,
    setTags,
    setLearningTime,
    setDifficultyLevel,
    setOrganizerId,
    setOtherOrganizerName,
    setInstructor,
    setOperator,
    setClassroomSdos,

    setIsApplyToAllCharge,
    setIsApplyToAllLocation,
    setIsInstructorNullCheck,
    setIsApplyToAllUrl,
  } = EnrollmentCubeStore.instance;

  let targetCube;
  if (learningContents.length < 1) {
    return;
  }

  targetCube = learningContents.find((content) => content.contentId === cubeId);
  if (!targetCube) {
    learningContents
      .filter((parent) => parent.learningContentType === 'Chapter')
      .forEach((parent) => {
        parent.children &&
          parent.children.length > 0 &&
          parent.children.forEach((child) => {
            if (child.contentId === cubeId) {
              targetCube = child;
            }
          });
      });
  }

  if (targetCube && targetCube.cubeWithMaterial) {
    const { cube, cubeContents, cubeMaterial } = targetCube.cubeWithMaterial;
    const { type, categories, sharingCineroomIds, name, learningTime } = cube;
    const {
      description: { goal, applicants, description, completionTerms, guide },
      tags,
      difficultyLevel,
      organizerId,
      otherOrganizerName,
      instructors,
      operator,
    } = cubeContents;
    const { classrooms } = cubeMaterial;

    type === 'ELearning' || (type === 'ClassRoomLecture' && setType(type));

    const mainCategory = categories.find((category: Category) => category.mainCategory);
    mainCategory && setMainCategory(mainCategory);

    setSharingCineroomIds(sharingCineroomIds);

    setName(name);

    setGoal(goal);
    setApplicants(applicants);
    setDescription(description);
    setCompletionTerms(new PolyglotModel(completionTerms));
    setGuide(guide);

    setTags(tags);
    setLearningTime(learningTime);
    setDifficultyLevel(difficultyLevel);
    setOrganizerId(organizerId);
    setOtherOrganizerName(otherOrganizerName);

    const instructorIds: string[] =
      (instructors && instructors.map((instructor: InstructorInCube) => instructor.instructorId)) || [];
    const instructorDetails: InstructorWithUserRdo[] =
      (instructorIds.length > 0 && (await findInstructorsByIds(instructorIds))) || [];
    const instructorOptionals: InstructorWithOptional[] =
      instructorDetails &&
      instructorDetails.map((instructor) => {
        const findInstructor = instructors.find(
          (cubeInstructor: InstructorInCube) => cubeInstructor.instructorId === instructor.instructor.id
        );

        return {
          ...InstructorWithOptionalFunc.fromInstructorWithUserRdo(instructor),
          lectureTime: (findInstructor && findInstructor.lectureTime) || 0,
          instructorLearningTime: (findInstructor && findInstructor.instructorLearningTime) || 0,
          representative: (findInstructor && findInstructor.representative) || false,
        };
      });
    setInstructor(instructorOptionals);
    setIsInstructorNullCheck(instructorOptionals.length < 1);

    const findOperator = await MemberApi.instance.findMemberById(operator.keyString);
    setOperator(findOperator);
    setClassroomSdos(classrooms);

    setIsApplyToAllCharge(checkAllApplyCharge(targetCube.cubeWithMaterial));
    setIsApplyToAllLocation(checkAllApplyLocation(targetCube.cubeWithMaterial));
    setIsApplyToAllUrl(checkAllApplySiteUrl(targetCube.cubeWithMaterial));
  }
}
