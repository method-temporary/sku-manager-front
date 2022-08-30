import { alert, AlertModel, confirm, ConfirmModel } from '../../../shared/components';

import { approvalCard, modifyCard, registerCard } from '../../../_data/lecture/cards/api/CardApi';
import { cardBasicInfoValidation, getCardCreateSdo } from '../CardCreate.util';
import { learningManagementUrl } from '../../../Routes';
import { History } from 'history';
import LearningContentsStore from '../../create/learning/learningPlan/LearningContents/LearningContents.store';
import LearningStore from '../../create/learning/Learning.store';
import { CardSdo } from '../../../_data/lecture/cards/model/CardSdo';
import { LearningContentSdo } from '../../../_data/lecture/cards/model/LearningContentSdo';
import { InstructorInCard } from '../../../_data/lecture/cards/model/vo';
import { LearningContentWithOptional } from './LearningContents/model/learningContentWithOptional';
import { InstructorWithOptional } from '../../../instructor/instructor/shared/components/instructorModal/model/InstructorWithOptional';
import { findInstructorsByIds } from '../../../_data/user/instructors/api/instructorApi';
import { validateCubesInCard } from './learningPlan/enrollmentCube/EnrollmentCube.util';
import { overLepCheck } from '../../shared/utiles';
import dayjs from 'dayjs';
import { DEFAULT_DATE_FORMAT } from '../../../_data/shared';
import CardCreateStore from '../CardCreate.store';
import CardDetailStore from '../../detail/CardDetail.store';

/**
 * Card 생성 로직
 */
export const registerCardLogic = async (cineroomId: string, history: History, cardId?: string) => {
  //
  const { setActiveIndex, setCreateLoading } = CardCreateStore.instance;
  // Card 기본정보 Validation
  const validation = await cardBasicInfoValidation();

  if (!validation) {
    setActiveIndex(0);
    return;
  }

  const validCube = await validateCubesInCard();
  if (!validCube) {
    setActiveIndex(1);
    return;
  }

  // 1) Card Learning 정보 Validation 체크
  const cardValidationCheck = await cardLearningInfoValidation(getCardCreateSdo(), cardId);

  if (!cardValidationCheck) {
    setActiveIndex(1);
    return;
  }

  confirm(
    ConfirmModel.getSaveAndApprovalConfirm(
      async () => {
        await ApprovalAndCreate(true, cineroomId, history);
      },
      async () => {
        await ApprovalAndCreate(false, cineroomId, history);
      }
    ),
    false
  );
};

/**
 * 생성 + 승인 요청
 * @param requestApproval
 * @param cineroomId
 * @param history
 * @constructor
 */
const ApprovalAndCreate = async (requestApproval: boolean, cineroomId: string, history: History) => {
  //
  const { setCreateLoading } = CardCreateStore.instance;

  setCreateLoading(true);
  const cardId = await registerCard(getCardCreateSdo(), requestApproval);

  setCreateLoading(false);
  if (cardId) {
    alert(
      AlertModel.getCustomAlert(false, '안내', '저장되었습니다.', '확인', () =>
        routeToCardDetail(cardId, cineroomId, history)
      )
    );
  } else {
    alert(AlertModel.getCustomAlert(false, '안내', 'Card 생성에 실패하였습니다.', '확인', () => null));
  }
};

/**
 * Card 생성 후 상세 페이지 이동
 * @param cardId
 * @param cineroomId
 * @param history
 */
const routeToCardDetail = (cardId: string, cineroomId: string, history: History) => {
  history.push(`/cineroom/${cineroomId}/${learningManagementUrl}/cards/card-detail/${cardId}`);
};

/*
 * Card 수정 로직
 */
export const modifyCardLogic = async (cardId: string, cineroomId: string, history: History) => {
  //
  // 기본 정보 Validation Check
  const { setActiveIndex } = CardDetailStore.instance;
  const validation = await cardBasicInfoValidation();

  if (!validation) {
    setActiveIndex(0);
    return;
  }

  // 1) Cube / Card Learning 정보 Validation 체크
  const validCube = await validateCubesInCard();
  if (!validCube) {
    setActiveIndex(1);
    return;
  }

  const cardValidationCheck = await cardLearningInfoValidation(getCardCreateSdo(), cardId);

  if (!cardValidationCheck) {
    setActiveIndex(1);
    return;
  }

  await modifyCard(cardId, getCardCreateSdo());

  alert(
    AlertModel.getCustomAlert(false, '안내', '수정되었습니다.', '확인', () =>
      routeToCardDetail(cardId, cineroomId, history)
    )
  );
};

/**
 * Card Learning 정보 Validation Check
 */
export const cardLearningInfoValidation = async (cardSdo: CardSdo, cardId?: string): Promise<boolean> => {
  //
  // 교육기간 문제
  const { learningPeriod, enrollmentCards, restrictLearningPeriod } = LearningStore.instance;
  const startCardLearningTime = dayjs(learningPeriod.startDate, DEFAULT_DATE_FORMAT).toDate().getTime();
  const endCardLearningTime = dayjs(learningPeriod.endDate, DEFAULT_DATE_FORMAT).toDate().getTime();

  if (cardSdo.studentEnrollmentType === 'Enrollment' && cardSdo.restrictLearningPeriod) {
    let roundIdx = -1;
    /* eslint-disable no-await-in-loop */
    for await (const round of enrollmentCards) {
      const startRoundLearningTime = dayjs(round.learningPeriod.startDate, DEFAULT_DATE_FORMAT).toDate().getTime();
      const endRoundLearningTime = dayjs(round.learningPeriod.endDate, DEFAULT_DATE_FORMAT).toDate().getTime();

      if (startCardLearningTime > startRoundLearningTime || endCardLearningTime < endRoundLearningTime) {
        roundIdx = round.round;
        break;
      }
    }

    if (roundIdx > -1) {
      alert(
        AlertModel.getCustomAlert(
          false,
          '안내',
          roundIdx + '차수의 학습 기간은 과정 교육기간에 포함되어야 합니다.',
          '확인'
        )
      );
      return false;
    }
  }

  // 1) 정원 누락
  const enrollmentCard = cardSdo.enrollmentCards.find((enrollmentCard) => enrollmentCard.capacity === 0);

  if (enrollmentCard) {
    alert(AlertModel.getRequiredInputAlert(`${enrollmentCard.round}차수의 정원`));
    return false;
  }

  const enrollmentCubes: LearningContentSdo[] = [];
  const cubes: LearningContentSdo[] = [];
  cardSdo.learningContents.forEach((content: LearningContentSdo) => {
    if (content.learningContentType === 'Chapter') {
      content.children &&
        content.children.length > 0 &&
        content.children.forEach((subContent) => {
          if (subContent.learningContentType === 'Cube') {
            cubes.push(subContent);
            (subContent.contentDetailType === 'ELearning' || subContent.contentDetailType === 'ClassRoomLecture') &&
              enrollmentCubes.push(subContent);
          }
        });
    } else if (content.learningContentType === 'Cube') {
      cubes.push(content);
      (content.contentDetailType === 'ELearning' || content.contentDetailType === 'ClassRoomLecture') &&
        enrollmentCubes.push(content);
    }
  });

  // 2) 수강신청형 Enrollment Cube 1개 이상 포함 여부
  if (cardSdo.studentEnrollmentType === 'Enrollment' && enrollmentCubes.length < 1) {
    alert(
      AlertModel.getCustomAlert(false, '안내', 'E-learning / Classroom 형 Cube가 1개 이상 포함되어야 합니다.', '확인')
    );
    return false;
  }

  // 3) Error : 상시형 Enrollment Cube 포함
  if (cardSdo.studentEnrollmentType === 'Anyone' && enrollmentCubes.length > 0) {
    alert(
      AlertModel.getCustomAlert(
        false,
        '안내',
        '상시형 Card는 E-learning / Classroom 형 카드를 포함 할 수 없습니다.',
        '확인'
      )
    );
    return false;
  }

  if (cubes.length < 1) {
    alert(AlertModel.getCustomAlert(false, '안내', 'Cube가 1개 이상 포함되어야 합니다.', '확인'));
    return false;
  }

  return overLepCheck(cardId);
};

export async function setCardInstructors() {
  //
  const { learningContents } = LearningContentsStore.instance;
  const { setInstructors } = LearningStore.instance;

  const instructorIds: string[] = [];
  learningContents.length > 0 &&
    learningContents.forEach((content: LearningContentWithOptional) => {
      if (content.learningContentType === 'Chapter') {
        content.children &&
          content.children.length > 0 &&
          content.children.forEach((subContent: LearningContentWithOptional) => {
            if (
              subContent.learningContentType === 'Cube' &&
              subContent.cubeWithMaterial &&
              subContent.cubeWithMaterial.cubeContents.instructors &&
              subContent.cubeWithMaterial.cubeContents.instructors.length > 0
            ) {
              subContent.cubeWithMaterial.cubeContents.instructors.forEach((instructor: InstructorInCard) => {
                const duplicateInstructor = instructorIds.find((id) => id === instructor.instructorId);
                !duplicateInstructor && instructorIds.push(instructor.instructorId);
              });
            }
          });
      } else if (
        content.learningContentType === 'Cube' &&
        content.cubeWithMaterial &&
        content.cubeWithMaterial.cubeContents.instructors &&
        content.cubeWithMaterial.cubeContents.instructors.length > 0
      ) {
        content.cubeWithMaterial.cubeContents.instructors.forEach((instructor: InstructorInCard) => {
          const duplicateInstructor = instructorIds.find((id) => id === instructor.instructorId);
          !duplicateInstructor && instructorIds.push(instructor.instructorId);
        });
      }
    });

  const cardInstructors: InstructorWithOptional[] =
    (instructorIds &&
      instructorIds.length > 0 &&
      (await findInstructorsByIds(instructorIds)
        .then((response) =>
          response.map(
            (data) =>
              ({
                instructor: { ...data.instructor },
                representative: false,
                instructorLearningTime: 0,
                lectureTime: 0,
                round: 1,
                user: { ...data.user },
              } as InstructorWithOptional)
          )
        )
        .catch((e) => []))) ||
    [];

  setInstructors(cardInstructors);
}

export function setCardLearningTime() {
  //
  const { learningContents } = LearningContentsStore.instance;
  const { setTotalLearningTime } = LearningStore.instance;

  let cubesLearningTime = 0;
  learningContents.length > 0 &&
    learningContents.forEach((content: LearningContentWithOptional) => {
      if (content.learningContentType === 'Chapter') {
        content.children &&
          content.children.length > 0 &&
          content.children.forEach((subContent: LearningContentWithOptional) => {
            if (subContent.learningContentType === 'Cube' && subContent.cubeWithMaterial) {
              cubesLearningTime += subContent.cubeWithMaterial.cube.learningTime;
            }
          });
      } else if (content.learningContentType === 'Cube' && content.cubeWithMaterial) {
        cubesLearningTime += content.cubeWithMaterial.cube.learningTime;
      }
    });

  setTotalLearningTime(cubesLearningTime);
}
