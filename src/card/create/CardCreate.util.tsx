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
 * Polyglot ??? ????????? ?????? ??????
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
    // ?????? ??????, ?????? ??????
    setLangSupports(value as LangSupport[]);
  } else if (name === 'name') {
    // ?????????
    setName(value as PolyglotModel);
  } else if (name === 'simpleDescription') {
    // ?????? ?????? ??????
    setSimpleDescription(value as PolyglotModel);
  } else if (name === 'description') {
    // ?????? ??????
    setDescription(value as PolyglotModel);
  } else if (name === 'tags') {
    // Tag ??????
    setTags(value as PolyglotModel);
  } else if (name === 'pisAgreementTitle') {
    // ?????? ??????
    setPisAgreementTitle(value as PolyglotModel);
  } else if (name === 'pisAgreementDepotId') {
    // ?????? Deport Id
    setPisAgreementDepotId(value as PolyglotModel);
  }
};

/**
 * ?????? ?????? Model ???  ???????????? ????????? ????????? ??? ????????? Convert ????????? ??????
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
 * ?????? ?????? model ??? ???????????? ????????? ????????? ??? ????????? Convert ????????? ??????
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
 * Report Modal ?????? ????????? ReportFileBox ??? Store ??? Setting
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
 * CardCreateStore ??? ?????? ????????? ReportFileBox ?????????
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
 * Survey Modal ?????? ????????? SurveyFormModel ??? Store ??? Setting
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
 * Store ??? Survey ?????? ??? ?????????
 */
export const resetSurvey = () => {
  const { setSurveyId, setSurveyTitle, setSurveyDesignerName } = CardCreateStore.instance;

  setSurveyId('');
  setSurveyTitle('');
  setSurveyDesignerName('');
};

/**
 * Test Model ??? Test ?????? ????????? ????????? ??? ????????? Convert ????????? ??????
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
 * CardCategory ??? SelectCollegeModal ??? ????????? ??? ????????? Convert ????????? ??????
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
 * SubCategory College ?????? ?????? Channel Node
 * @param colleges
 */
export const makeSubCategoryDisplay = (colleges: CollegeModel[]): React.ReactNode => {
  //
  const { subCategories } = CardCreateStore.instance;

  const collegeIds: string[] = [];
  const filteredCategories: CardCategoryWithInfo[] = [];

  subCategories.forEach((subCategory) => {
    //
    // ?????? College ??? ?????? ?????? ????????? ?????? ?????? CollegeId ????????? College ??? ?????? ?????? ??????
    !collegeIds.some((collegeId) => collegeId === subCategory.collegeId) && collegeIds.push(subCategory.collegeId);

    // 1 Depth ??? ??????
    if (subCategory.twoDepthChannelId === '') {
      //
      const hasChildren = subCategories.some(
        (category) => category.twoDepthChannelId && category.channelId === subCategory.channelId
      );

      // 1 Depth ????????? Children ??? ?????? ??????
      if (!hasChildren) {
        filteredCategories.push(subCategory);
      }
    } else {
      // 2 Depth ??? ??????
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
 * SubCategory College ?????? ?????? Channel Text ?????????
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
 * ???????????? ????????? ?????? Card, ?????? Card ?????? ?????? ??????
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
 * Card ???????????? Validation Check
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
    alert(AlertModel.getRequiredInputAlert('Card ???'));
    return false;
  }
  if (isDefaultPolyglotBlank(langSupports, simpleDescription)) {
    alert(AlertModel.getRequiredInputAlert('Card ?????? ??????'));
    return false;
  }

  if (isDefaultPolyglotBlank(langSupports, description)) {
    alert(AlertModel.getRequiredInputAlert('Card ??????'));
    return false;
  }

  if (mainCategory.collegeId === '') {
    alert(AlertModel.getRequiredChoiceAlert('????????????'));
    return false;
  }

  if (hasPrerequisite === 'Yes' && prerequisiteCards.length === 0) {
    alert(AlertModel.getRequiredChoiceAlert('?????? Card'));
    return false;
  }

  if (!cardOperator || cardOperator.id === '') {
    alert(AlertModel.getRequiredChoiceAlert('?????????'));
    return false;
  }

  if (difficultyLevel === '') {
    alert(AlertModel.getRequiredInputAlert('?????????'));
    return false;
  }

  if (thumbnailImagePath === '') {
    alert(AlertModel.getRequiredChoiceAlert('?????????'));
    return false;
  }

  if (permittedCinerooms.length === 0) {
    alert(AlertModel.getRequiredChoiceAlert('????????? ?????? ?????? ??????'));
    return false;
  }

  if (groupBasedAccessRule.accessRules.length === 0) {
    alert(AlertModel.getRequiredChoiceAlert('?????? ?????? ??????'));
    return false;
  }

  if (prerequisiteCards.some((prerequisiteCard) => !prerequisiteCard.accessible)) {
    alert(AlertModel.getCustomAlert(true, '????????????', '??????????????? ?????? ?????? Card ??? ???????????????', '??????'));
    return false;
  }
  return true;
};

/**
 * Card ?????? ????????????
 * @description ?????? ?????? ?????? ????????? ???, ????????? ???????????? Meta ?????? ????????????
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
 * Card Create ??? InstructorWithOptional ??? Sdo Instructor ??? ??????
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
 * LearningContents ??? ?????? Discussion ??????
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
 * ?????? ?????? ??????
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
