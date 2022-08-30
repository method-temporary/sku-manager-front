import React from 'react';
import { Table } from 'semantic-ui-react';

import {
  GroupBasedAccessRule,
  GroupBasedAccessRuleModel,
  PatronKey,
  PolyglotModel,
  UserGroupRuleModel,
} from 'shared/model';
import { alert, AlertModel } from 'shared/components';
import {
  getPolyglotToAnyString,
  isDefaultPolyglotBlank,
  LangSupport,
  langSupportCdo,
} from 'shared/components/Polyglot';
import { AccessRuleService } from 'shared/present';
import { isAccessible } from 'shared/components/AccessRuleSettings/AccessRuleSetting.util';

import { CardSdo } from '_data/lecture/cards/model/CardSdo';
import { getInitCard } from '_data/lecture/cards/model/Card';
import { CardDiscussion } from '_data/lecture/cards/model/CardDiscussion';
import { InstructorInCard, ReportFileBox } from '_data/lecture/cards/model/vo';
import { CollegeModel } from '_data/college/colleges/model/CollegeModel';
import { getInitCardContents } from '_data/lecture/cards/model/CardContents';

import { SurveyFormModel, SurveyFormService } from '../../survey';
import { ExamPaperModel, getInitExamPaperModel } from '../../exam/model/ExamPaperModel';
import { ChannelWithAnotherInfo } from '../../college/shared/components/collegeSelectedModal/model/ChannelWithAnotherInfo';
import { CardWithAccessAndOptional } from '../shared/components/cardSelectModal/model/CardWithAccessAndOptional';

import { setAccessRule } from '../detail/CardDetail.util';

import CardCreateStore from './CardCreate.store';
import { TestWithViewInfo } from './basic/model/TestWithViewInfo';
import { RelatedCardWithInfo } from './basic/model/RelatedCardWithInfo';
import { CardCategoryWithInfo } from './basic/model/CardCategoryWithInfo';
import { PreRequisiteCardWithInfo } from './basic/model/PreRequisiteCardWithInfo';
import LearningContentsStore from './learning/learningPlan/LearningContents/LearningContents.store';
import LearningStore from './learning/Learning.store';
import { yesNoToBoolean } from '../../shared/helper';
import EnrollmentCubeStore from './learning/learningPlan/enrollmentCube/EnrollmentCube.store';
import { LearningContentWithOptional } from './learning/LearningContents/model/learningContentWithOptional';

/**
 * Polyglot 값 변경을 위한 함수
 * @param name
 * @param value
 */
export const onChangeCardCreatePolyglot = (name: string, value: any) => {
  //
  const {
    setLangSupports,
    setName,
    setSimpleDescription,
    setDescription,
    setTags,
    setPisAgreementTitle,
    setPisAgreementDepotId,
  } = CardCreateStore.instance;

  if (name === 'langSupports') {
    // 지원 언어, 기본 언어
    setLangSupports(value as LangSupport[]);
  } else if (name === 'name') {
    // 카드명
    setName(value as PolyglotModel);
  } else if (name === 'simpleDescription') {
    // 카드 표시 문구
    setSimpleDescription(value as PolyglotModel);
  } else if (name === 'description') {
    // 카드 소개
    setDescription(value as PolyglotModel);
  } else if (name === 'tags') {
    // Tag 정보
    setTags(value as PolyglotModel);
  } else if (name === 'pisAgreementTitle') {
    // 서약 제목
    setPisAgreementTitle(value as PolyglotModel);
  } else if (name === 'pisAgreementDepotId') {
    // 서약 Deport Id
    setPisAgreementDepotId(value as PolyglotModel);
  }
};

/**
 * 선수 카드 Model 을  카드선택 모달에 적용할 수 있도록 Convert 해주는 함수
 * @param prerequisiteCard
 */
export const convertPreRequisiteCards = (prerequisiteCard: PreRequisiteCardWithInfo): CardWithAccessAndOptional => {
  //
  const card = getInitCard();
  const cardContents = getInitCardContents();

  card.id = prerequisiteCard.prerequisiteCardId;
  card.name = prerequisiteCard.prerequisiteCardName;
  card.groupBasedAccessRule = prerequisiteCard.groupBasedAccessRule;
  card.learningTime = prerequisiteCard.learningTime;
  card.stampCount = prerequisiteCard.hasStamp ? 1 : 0;
  card.mainCategory = prerequisiteCard.mainCategory;
  cardContents.registeredTime = prerequisiteCard.registeredTime;

  return {
    accessible: prerequisiteCard.accessible,
    cardWithContents: {
      card,
      cardContents,
    },
    required: prerequisiteCard.required,
  };
};

/**
 * 관련 카드 model 을 카드선택 모달에 적용할 수 있도록 Convert 해주는 함수
 * @param relatedCardWithInfo
 */
export const convertRelatedCards = (relatedCardWithInfo: RelatedCardWithInfo): CardWithAccessAndOptional => {
  //
  const { groupBasedAccessRule } = AccessRuleService.instance;

  const card = getInitCard();
  const cardContents = getInitCardContents();
  const accessible = GroupBasedAccessRuleModel.asRuleModelForRule(
    relatedCardWithInfo.card.groupBasedAccessRule
  ).isAccessible(new GroupBasedAccessRule(relatedCardWithInfo.card.groupBasedAccessRule), groupBasedAccessRule);

  card.id = relatedCardWithInfo.card.id;
  card.name = relatedCardWithInfo.card.name;
  card.groupBasedAccessRule = relatedCardWithInfo.card.groupBasedAccessRule;
  card.learningTime = relatedCardWithInfo.card.learningTime;
  card.stampCount = relatedCardWithInfo.card.stampCount;
  card.mainCategory = relatedCardWithInfo.card.mainCategory;
  cardContents.registeredTime = relatedCardWithInfo.cardContents.registeredTime;

  return {
    accessible,
    cardWithContents: {
      card,
      cardContents,
    },
    relatedCardId: card.id,
  };
};

/**
 * Report Modal 에서 넘어온 ReportFileBox 를 Store 에 Setting
 * @param reportFileBox
 */
export const setReportFileBox = (reportFileBox: ReportFileBox) => {
  //
  const { setReport, setReportName, setReportQuestion, setReportFileBoxId } = CardCreateStore.instance;
  setReport(reportFileBox.report);
  setReportName(reportFileBox.reportName);
  setReportQuestion(reportFileBox.reportQuestion);
  setReportFileBoxId(reportFileBox.fileBoxId);
};

/**
 * CardCreateStore 에 있는 값으로 ReportFileBox 만들기
 */
export const getReportFileBox = (): ReportFileBox => {
  //
  const { report, reportName, reportQuestion, reportFileBoxId } = CardCreateStore.instance;

  return {
    report,
    reportName,
    reportQuestion,
    fileBoxId: reportFileBoxId,
  };
};

/**
 * Survey Modal 에서 넘어온 SurveyFormModel 을 Store 에 Setting
 * @param surveyForm
 */
export const setSurvey = (surveyForm: SurveyFormModel) => {
  //
  const { setSurveyId, setSurveyTitle, setSurveyDesignerName } = CardCreateStore.instance;

  setSurveyId(surveyForm.id);
  setSurveyTitle(surveyForm.title);
  setSurveyDesignerName(surveyForm.formDesignerName);
};

/**
 * Store 에 Survey 관련 값 초기화
 */
export const resetSurvey = () => {
  const { setSurveyId, setSurveyTitle, setSurveyDesignerName } = CardCreateStore.instance;

  setSurveyId('');
  setSurveyTitle('');
  setSurveyDesignerName('');
};

/**
 * Test Model 을 Test 선택 모달에 적용할 수 있도록 Convert 해주는 함수
 * @param test
 */
export const convertExamPaper = (test: TestWithViewInfo): ExamPaperModel => {
  //
  const examPaper = getInitExamPaperModel();

  return {
    ...examPaper,
    id: test.paperId,
    title: test.examTitle,
    successPoint: test.successPoint,
    totalPoint: test.totalPoint,
    questionSelectionType: test.questionSelectionType,
  };
};

/**
 * CardCategory 를 SelectCollegeModal 에 적용할 수 있도록 Convert 해주는 함수
 * @param cardCategory
 */
export const convertCardCategory = (cardCategory: CardCategoryWithInfo): ChannelWithAnotherInfo => {
  //
  return {
    collegeId: cardCategory.collegeId,
    description: new PolyglotModel(),
    displayOrder: cardCategory.displayOrder,
    enabled: false,
    groupBasedAccessRule: new GroupBasedAccessRule(),
    id: cardCategory.twoDepthChannelId ? cardCategory.twoDepthChannelId : cardCategory.channelId,
    parentId: cardCategory.twoDepthChannelId ? cardCategory.channelId : cardCategory.parentId,
    mainCategory: cardCategory.mainCategory,
    name: cardCategory.name,
    registeredTime: 0,
    twoDepthChannelId: cardCategory.twoDepthChannelId,
    patronKey: new PatronKey(),
  };
};

/**
 * SubCategory College 별로 묶은 Channel Node
 * @param colleges
 */
export const makeSubCategoryDisplay = (colleges: CollegeModel[]): React.ReactNode => {
  //
  const { subCategories } = CardCreateStore.instance;

  const collegeIds: string[] = [];
  const filteredCategories: CardCategoryWithInfo[] = [];

  subCategories.forEach((subCategory) => {
    //
    // 같은 College 들 까리 묶기 위해서 중복 없는 CollegeId 목록에 College 가 없을 경우 추가
    !collegeIds.some((collegeId) => collegeId === subCategory.collegeId) && collegeIds.push(subCategory.collegeId);

    // 1 Depth 인 경우
    if (subCategory.twoDepthChannelId === '') {
      //
      const hasChildren = subCategories.some(
        (category) => category.twoDepthChannelId && category.channelId === subCategory.channelId
      );

      // 1 Depth 이면서 Children 이 없는 경우
      if (!hasChildren) {
        filteredCategories.push(subCategory);
      }
    } else {
      // 2 Depth 인 경우
      filteredCategories.push(subCategory);
    }
  });

  const result: React.ReactNode[] = [];

  collegeIds.forEach((collegeId, index) => {
    const channelIds = filteredCategories
      .filter((category) => category.collegeId === collegeId)
      .map((category) => (category.twoDepthChannelId ? category.twoDepthChannelId : category.channelId));

    const college = colleges.find((c) => c.id === collegeId);

    if (college) {
      //
      const collegeName = getPolyglotToAnyString(college.name);

      const channelNames: string[] = [];
      channelIds.forEach((channelId, index) => {
        const channel = college.channels.find((channel) => channelId === channel.id);

        channel && channelNames.push(getPolyglotToAnyString(channel.name));
      });

      result.push(
        <Table.Row key={index}>
          <Table.Cell>{collegeName}</Table.Cell>
          <Table.Cell>{channelNames.join(', ')}</Table.Cell>
        </Table.Row>
      );
    }
  });

  return result.length > 0 ? (
    <>
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>
        <Table.Body>{result.map((node) => node)}</Table.Body>
      </Table>
    </>
  ) : null;
};

/**
 * SubCategory College 별로 묶은 Channel Text 만들기
 * @param collegeId
 * @param channelIds
 * @param colleges
 */
export const makeCategoryWithChannelsDisplay = (
  collegeId: string,
  channelIds: string[],
  colleges: CollegeModel[]
): string => {
  //
  const college = colleges.find((c) => (c.id = collegeId));

  if (college) {
    //
    const collegeName = getPolyglotToAnyString(college.name);
    const channelNames: string[] = [];

    channelIds.forEach((channelId) => {
      const channel = college.channels.find((channel) => channelId === channel.id);

      channel && channelNames.push(getPolyglotToAnyString(channel.name));
    });

    return `${collegeName} > ${channelNames.join(', ')}`;
  }

  return '';
};

/**
 * 접근제어 수정시 선수 Card, 관련 Card 접근 여부 수정
 * @param groupBasedAccessRuleModel
 */
export const onChangeAccessRule = (groupBasedAccessRuleModel: GroupBasedAccessRuleModel) => {
  //
  const { prerequisiteCards, relatedCards, setPrerequisiteCards, setRelatedCards } = CardCreateStore.instance;

  setPrerequisiteCards(
    prerequisiteCards.map((prerequisiteCards) => ({
      ...prerequisiteCards,
      accessible: isAccessible(prerequisiteCards.groupBasedAccessRule, groupBasedAccessRuleModel),
    }))
  );

  setRelatedCards(
    relatedCards.map((relatedCard) => ({
      ...relatedCard,
      accessible: isAccessible(relatedCard.card.groupBasedAccessRule, groupBasedAccessRuleModel),
    }))
  );
};

/**
 * Card 기본정보 Validation Check
 */
export const cardBasicInfoValidation = async () => {
  //
  const {
    langSupports,
    name,
    simpleDescription,
    description,
    mainCategory,
    hasPrerequisite,
    prerequisiteCards,
    cardOperator,
    difficultyLevel,
    thumbnailImagePath,
    permittedCinerooms,
  } = CardCreateStore.instance;
  const { groupBasedAccessRule } = AccessRuleService.instance;

  if (isDefaultPolyglotBlank(langSupports, name)) {
    alert(AlertModel.getRequiredInputAlert('Card 명'));
    return false;
  }
  if (isDefaultPolyglotBlank(langSupports, simpleDescription)) {
    alert(AlertModel.getRequiredInputAlert('Card 표시 문구'));
    return false;
  }

  if (isDefaultPolyglotBlank(langSupports, description)) {
    alert(AlertModel.getRequiredInputAlert('Card 소개'));
    return false;
  }

  if (mainCategory.collegeId === '') {
    alert(AlertModel.getRequiredChoiceAlert('메인채널'));
    return false;
  }

  if (hasPrerequisite === 'Yes' && prerequisiteCards.length === 0) {
    alert(AlertModel.getRequiredChoiceAlert('선수 Card'));
    return false;
  }

  if (!cardOperator || cardOperator.id === '') {
    alert(AlertModel.getRequiredChoiceAlert('담당자'));
    return false;
  }

  if (difficultyLevel === '') {
    alert(AlertModel.getRequiredInputAlert('난이도'));
    return false;
  }

  if (thumbnailImagePath === '') {
    alert(AlertModel.getRequiredChoiceAlert('썸네일'));
    return false;
  }

  if (permittedCinerooms.length === 0) {
    alert(AlertModel.getRequiredChoiceAlert('멤버사 적용 범위 설정'));
    return false;
  }

  if (groupBasedAccessRule.accessRules.length === 0) {
    alert(AlertModel.getRequiredChoiceAlert('접근 제어 정보'));
    return false;
  }

  if (prerequisiteCards.some((prerequisiteCard) => !prerequisiteCard.accessible)) {
    alert(AlertModel.getCustomAlert(true, '접근권한', '접근권한이 없는 선수 Card 가 존재합니다', '확인'));
    return false;
  }
  return true;
};

/**
 * Card 정보 불러오기
 * @description 기존 입력 정보 초기화 후, 불러온 데이터로 Meta 정보 자동입력
 * @param cardWithAccessAndOptional
 * @param userGroupMap
 */
export const setCardCreateByCopyCard = (
  cardWithAccessAndOptional: CardWithAccessAndOptional,
  userGroupMap: Map<number, UserGroupRuleModel>
) => {
  //
  const {
    cardWithContents: { card, cardContents },
  } = cardWithAccessAndOptional;
  const {
    setLangSupports,
    setSearchable,

    setName,
    setSimpleDescription,
    setDescription,
    setHasStamp,
    setStampCount,
    setDifficultyLevel,
    setTags,
    setGroupBasedAccessRule,
    reset,
  } = CardCreateStore.instance;
  const { reset: learningReset, setStudentEnrollmentType } = LearningStore.instance;
  const { reset: enrollmentReset } = EnrollmentCubeStore.instance;
  const { reset: learningContentsReset } = LearningContentsStore.instance;

  reset();
  learningReset();
  enrollmentReset();
  learningContentsReset();

  setDefaultSurvey();
  setSearchable(card.searchable ? 'Yes' : 'No');
  setLangSupports(card.langSupports.map((langSupport) => new LangSupport(langSupport)));
  setName(new PolyglotModel(card.name));
  setSimpleDescription(new PolyglotModel(card.simpleDescription));
  setDescription(new PolyglotModel(cardContents.description));
  setHasStamp(card.stampCount > 0);
  setStampCount(card.stampCount);
  setDifficultyLevel(card.difficultyLevel);
  setTags(new PolyglotModel(card.tags));
  setGroupBasedAccessRule(card.groupBasedAccessRule);
  setAccessRule(card, userGroupMap);

  setStudentEnrollmentType(card.studentEnrollmentType);
};

export const getCardCreateSdo = (): CardSdo => {
  //
  const {
    langSupports,
    searchable,
    name,
    simpleDescription,
    description,
    mainCategory,
    subCategories,
    stampCount,
    prerequisiteCards,
    cardOperator,
    difficultyLevel,
    permittedCinerooms,
    tags,
    fileBoxId,
    relatedCards,
    pisAgreementRequired,
    pisAgreementTitle,
    pisAgreementDepotId,
    mandatory,
    communityId,
    report,
    reportName,
    reportQuestion,
    reportFileBoxId,
    surveyId,
    thumbnailImagePath,
    tests,
  } = CardCreateStore.instance;
  const { groupBasedAccessRule } = AccessRuleService.instance;
  const {
    studentEnrollmentType,
    enrollingAvailable,
    learningPeriod,
    validLearningDate,
    approvalProcess,
    sendingMail,
    cancellationPenalty,
    enrollmentCards,
    additionalLearningTime,
    restrictLearningPeriod,
    sequentialStudyRequired,
  } = LearningStore.instance;
  const { learningContents } = LearningContentsStore.instance;

  return {
    langSupports: langSupportCdo(langSupports),
    searchable: searchable === 'Yes',
    studentEnrollmentType,
    name,
    simpleDescription,
    description,
    categories: [mainCategory, ...subCategories],
    stampCount,
    prerequisiteCards,
    cardOperator: cardOperator.id,
    difficultyLevel,
    thumbnailImagePath,
    permittedCinerooms,
    tags,
    groupBasedAccessRule: GroupBasedAccessRuleModel.asGroupBasedAccessRule(groupBasedAccessRule),
    fileBoxId,
    relatedCards,
    pisAgreementRequired,
    pisAgreementTitle,
    pisAgreementDepotId,
    mandatory,
    communityId,
    reportFileBox: {
      report,
      reportName,
      reportQuestion,
      fileBoxId: reportFileBoxId,
    },
    surveyId,
    tests,
    restrictLearningPeriod,
    learningPeriod,
    validLearningDate,
    approvalProcess: approvalProcess === 'Yes',
    sendingMail: sendingMail === 'Yes',
    cancellationPenalty,
    enrollmentCards: studentEnrollmentType === 'Enrollment' ? enrollmentCards : [],
    learningContents,
    cardDiscussions: getCardDiscussion(),
    sequentialStudyRequired,
    additionalLearningTime,
    instructors: getInstructors(),
    enrollingAvailable: yesNoToBoolean(enrollingAvailable),
  } as CardSdo;
};

/**
 * Card Create 의 InstructorWithOptional 을 Sdo Instructor 로 변환
 */
const getInstructors = (): InstructorInCard[] => {
  //
  const { instructors } = LearningStore.instance;

  return (
    (instructors &&
      instructors.length > 0 &&
      instructors.map(
        (instructor) =>
          ({
            id: instructor.instructor.id,
            instructorId: instructor.instructor.id,
            representative: instructor.representative,
          } as InstructorInCard)
      )) ||
    []
  );
};

/**
 * LearningContents 내 모든 Discussion 확인
 */
const getCardDiscussion = () => {
  //
  const { learningContents } = LearningContentsStore.instance;

  const discussion: CardDiscussion[] = [];

  learningContents.forEach((learningContent: LearningContentWithOptional) => {
    //
    if (learningContent.learningContentType === 'Discussion') {
      //
      if (learningContent.cardDiscussion) {
        discussion.push(learningContent.cardDiscussion);
      }
    } else if (learningContent.learningContentType === 'Chapter') {
      //
      const children = learningContent.children;

      if (children) {
        //
        children.forEach((childrenLearningContent: LearningContentWithOptional) => {
          //
          if (childrenLearningContent.learningContentType === 'Discussion') {
            //
            if (childrenLearningContent.cardDiscussion) {
              discussion.push(childrenLearningContent.cardDiscussion);
            }
          }
        });
      }
    }
  });

  return discussion;
};

/**
 * 공통 설문 적용
 */
export const setDefaultSurvey = async () => {
  //
  const { surveyId, setSurveyTitle, setSurveyDesignerName } = CardCreateStore.instance;
  const { findSurveyForm } = SurveyFormService.instance;
  findSurveyForm(surveyId).then((surveyForm) => {
    //
    setSurveyTitle(surveyForm.title);
    setSurveyDesignerName(surveyForm.formDesignerName);
  });
};
