import React from 'react';
import { Button, Icon, Tab } from 'semantic-ui-react';
import { UseBaseMutationResult } from 'react-query';
import dayjs from 'dayjs';

import {
  GroupBasedAccessRule,
  GroupBasedAccessRuleModel,
  PatronKey,
  PolyglotModel,
  UserGroupRuleModel,
} from 'shared/model';
import { AccessRuleSettings, DimmerLoader, Polyglot, SubActions } from 'shared/components';
import { getPolyglotToAnyString, LangSupport } from 'shared/components/Polyglot';
import { setGroupBasedAccessRuleInfo } from 'shared/components/AccessRuleSettings/AccessRuleSetting.util';
import { AccessRuleService } from 'shared/present';

import Card from '_data/lecture/cards/model/Card';
import CardContents from '_data/lecture/cards/model/CardContents';
import CardWithContentsAndRelatedCount from '_data/lecture/cards/model/CardWithContentsAndRelatedCount';
import { CardStates } from '_data/lecture/cards/model/vo';
import { CubeDetail } from '_data/cube/model/CubeDetail';
import { findCubesDetailsByIds } from '_data/cube/api/cubeApis';
import { findInstructorsByIds } from '_data/user/instructors/api/instructorApi';
import { InstructorWithUserRdo } from '_data/user/instructors/model/InstructorWithUserRdo';

import { TestSheetModalContainer } from 'exam/ui/logic/TestSheetModalContainer';

import { SurveyFormService, SurveyFormSummary, SurveyManagementContainer } from 'survey';
import { CommunityStore } from 'community/community';
import { findExamPaperByIds } from 'exam/api/examApi';
import MemberService from 'approval/present/logic/MemberService';
import DiscussionService from 'discussion/present/logic/DiscussionService';

import { InstructorWithOptionalFunc } from '../../instructor/instructor/shared/components/instructorModal/model/InstructorWithOptional';
import Discussion from '../../discussion/model/Discussion';
import { CardStudentPage } from '../student/cardStudent/CardStudentPage';
import { CardStudentResultPage } from '../student/cardStudentResult/CardStudentResultPage';
import { AutoEncourage } from '../autoEncourage/AutoEncourage';

import CardCreateStore from '../create/CardCreate.store';
import { onChangeAccessRule } from '../create/CardCreate.util';
import { CardOperator } from '../create/basic/model/vo';
import {
  getMainCategoryByCardCategory,
  getSubCategoriesByCardCategories,
} from '../create/basic/model/CardCategoryWithInfo';
import { TestWithViewInfo } from '../create/basic/model/TestWithViewInfo';
import { RelatedCardWithInfo } from '../create/basic/model/RelatedCardWithInfo';
import { PreRequisiteCardWithInfo } from '../create/basic/model/PreRequisiteCardWithInfo';

import CardDetailStore from './CardDetail.store';

import CardBasicInfo from '../create/basic/components/CardBasicInfo';
import CardExposureInfo from '../create/basic/components/CardExposureInfo';
import PreRequisiteCard from '../create/basic/components/PreRequisiteCard';
import CardAdditionalInfo from '../create/basic/components/CardAdditionalInfo';
import CardMoreInfo from '../create/basic/components/CardMoreInfo';

import { cardStateDisplay } from '../card/ui/logic/CardHelper';
import { CardOpenResponse } from '../card/model/vo/CardOpenResponse';
import { onUploadCardThumbnail } from '../card/present/logic/CardThumbnailSelectService';

import CardApprovalDetailStore from '../approval/detail/CardApprovalDetail.store';
import { LearningPeriodInfo } from '../create/learning/learningPeriodInfo/LearningPeriodInfo';
import RoundInfo from '../create/learning/components/RoundInfo';
import { LearningPlan } from '../create/learning/learningPlan/LearningPlan';
import LearningStore from '../create/learning/Learning.store';
import LearningContentsStore from '../create/learning/learningPlan/LearningContents/LearningContents.store';
import { LearningContentWithOptional } from '../create/learning/LearningContents/model/learningContentWithOptional';
import { EnrollmentCardWithOptional } from '../create/learning/model/EnrollmentCardWithOptional';
import { setCardLearningTime } from 'card/create/learning/CardLearningInfoPage.util';
import EnrollmentCubeStore from '../create/learning/learningPlan/enrollmentCube/EnrollmentCube.store';
import { CardSurveyPage } from 'card/survey/CardSurveyPage';
import CommentApi from 'feedback/comment/present/apiclient/CommentApi';

/**
 * Card Detail Tab 목록
 * @param cardId
 * @param onClickNext
 * @param onClickPrev
 * @param onClickUpdate
 * @param onClickApprovalCard
 * @param onClickModifyButton
 */
export const getCardDetailTabMenus = (
  cardId: string,
  onClickNext: () => void,
  onClickPrev: () => void,
  onClickUpdate: () => void,
  onClickApprovalCard: () => void,
  onClickModifyButton: () => void,
  onClickMoveToCardList: () => void
) => {
  //
  const { readonly, isDetailLoading, cardState, loaderPage } = CardDetailStore.instance;
  const { langSupports, hasPrerequisite, name } = CardCreateStore.instance;
  const { studentEnrollmentType } = LearningStore.instance;
  const { groupBasedAccessRule } = AccessRuleService.instance;

  const menuItems: { menuItem: string; render: () => JSX.Element }[] = [];

  menuItems.push({
    menuItem: 'Card 정보',
    render: () => (
      <DimmerLoader active={isDetailLoading} page={loaderPage}>
        <Tab.Pane attached={false}>
          <Polyglot languages={langSupports}>
            {/* 기본 정보 */}
            <CardBasicInfo readonly={readonly} />
            {/* 노출 정보 */}
            <CardExposureInfo readonly={readonly} />
            {/* 접근 제어 */}
            <AccessRuleSettings
              multiple={false}
              onChange={onChangeAccessRule}
              readOnly={readonly}
              form={false}
              defaultGroupBasedAccessRule={groupBasedAccessRule}
            />
            {/* 선수 카드 */}
            {hasPrerequisite === 'Yes' && <PreRequisiteCard readonly={readonly} />}
            {/* 부가 정보 */}
            <CardAdditionalInfo readonly={readonly} />
            {/* 추가 정보 */}
            <CardMoreInfo readonly={readonly} />
            {/* Test 미리보기 Modal */}
            <TestSheetModalContainer />
          </Polyglot>

          <SubActions form>
            <SubActions.Left>
              <Button type="button" onClick={onClickUpdate}>
                {readonly ? '수정' : '취소'}
              </Button>
            </SubActions.Left>
            <SubActions.Right>
              {readonly && (cardState === CardStates.Created || cardState === CardStates.Rejected) && (
                <Button primary onClick={() => onClickApprovalCard()}>
                  승인요청
                </Button>
              )}
              <Button basic onClick={onClickMoveToCardList}>
                목록
              </Button>
              <Button primary disabled={readonly} onClick={onClickModifyButton}>
                저장
              </Button>
            </SubActions.Right>
          </SubActions>
        </Tab.Pane>
      </DimmerLoader>
    ),
  });

  menuItems.push({
    menuItem: '학습 정보',
    render: () => (
      <>
        <p className="tab-text">{getPolyglotToAnyString(name)}</p>
        <DimmerLoader active={isDetailLoading} page={loaderPage}>
          <Tab.Pane attached={false}>
            <Polyglot languages={langSupports}>
              <LearningPeriodInfo readonly={readonly} />
              {studentEnrollmentType === 'Enrollment' && <RoundInfo readonly={readonly} />}
              <LearningPlan readonly={readonly} />
            </Polyglot>

            <SubActions form>
              <SubActions.Left>
                <Button type="button" onClick={onClickUpdate}>
                  {readonly ? '수정' : '취소'}
                </Button>
              </SubActions.Left>
              <SubActions.Right>
                {readonly ? (
                  (cardState === CardStates.Created || cardState === CardStates.Rejected) && (
                    <Button primary onClick={() => onClickApprovalCard()}>
                      승인요청
                    </Button>
                  )
                ) : (
                  <Button primary onClick={onClickModifyButton}>
                    저장
                  </Button>
                )}
              </SubActions.Right>
            </SubActions>
          </Tab.Pane>
        </DimmerLoader>
      </>
    ),
  });

  readonly &&
    menuItems.push(
      ...[
        {
          menuItem: '학습자',
          render: () => (
            <>
              <p className="tab-text">{getPolyglotToAnyString(name)}</p>
              <Tab.Pane attached={false}>
                <CardStudentPage />
              </Tab.Pane>
            </>
          ),
        },
        {
          menuItem: '결과관리',
          render: () => (
            <>
              <p className="tab-text">{getPolyglotToAnyString(name)}</p>
              <Tab.Pane attached={false}>
                <CardStudentResultPage />
              </Tab.Pane>
            </>
          ),
        },
        {
          menuItem: '설문',
          render: () => <CardSurveyPage />,
        },
        {
          menuItem: '자동독려',
          render: () => (
            <>
              <p className="tab-text">{getPolyglotToAnyString(name)}</p>
              <AutoEncourage />
            </>
          ),
        },
      ]
    );

  return menuItems;
};

/**
 * Card Detail CardCreateStore 에 값 Setting
 * @param userGroupMap
 * @param cardWithContentsAndRelatedCount
 * @param mutation
 */
export const setCardCreateByCardContents = async (
  userGroupMap: Map<number, UserGroupRuleModel>,
  cardWithContentsAndRelatedCount: CardWithContentsAndRelatedCount,
  mutation: UseBaseMutationResult<CardWithContentsAndRelatedCount, unknown, string>
) => {
  //
  const { card, cardContents } = cardWithContentsAndRelatedCount;

  // 기본 정보
  setBasicInfo(cardWithContentsAndRelatedCount);

  // 노출 정보
  setExposureInfo(card);

  // 접근 제어 정보
  setAccessRule(card, userGroupMap);

  // 선수 카드 정보
  await setPrerequisite(cardContents, mutation);

  // 부가 정보
  await setAdditionalInfo(cardContents, mutation);

  // 추가 정보
  await setMoreInfo(cardContents);
};

/**
 * 기본 정보 입력
 * @param cardWithContentsAndRelatedCount
 */
const setBasicInfo = async (cardWithContentsAndRelatedCount: CardWithContentsAndRelatedCount) => {
  //
  const { card, cardContents, cardOperatorIdentity } = cardWithContentsAndRelatedCount;

  const {
    setLangSupports,
    setSearchable,

    setName,
    setSimpleDescription,
    setDescription,
    setMainCategory,
    setSubCategories,
    setHasStamp,
    setStampCount,
    setHasPrerequisite,
    setCardOperator,
    setDifficultyLevel,
    setMandatory,
  } = CardCreateStore.instance;
  const { setRegistrantName, setRegisteredTime, setApprovalInfo, setCardState } = CardDetailStore.instance;
  const { setRemark } = CardApprovalDetailStore.instance;

  setLangSupports(card.langSupports.map((langSupport) => new LangSupport(langSupport)));
  setSearchable(card.searchable ? 'Yes' : 'No');

  setName(new PolyglotModel(card.name));
  setSimpleDescription(new PolyglotModel(card.simpleDescription));
  setDescription(new PolyglotModel(cardContents.description));
  setMainCategory(getMainCategoryByCardCategory(card.mainCategory));
  setSubCategories(getSubCategoriesByCardCategories(card.categories));
  setHasStamp(card.stampCount > 0);
  setStampCount(card.stampCount);
  setHasPrerequisite(cardContents.prerequisiteCards.length > 0 ? 'Yes' : 'No');
  setCardOperator({
    id: cardOperatorIdentity.id,
    name: cardOperatorIdentity.name,
    companyCode: cardOperatorIdentity.companyCode,
    companyName: cardOperatorIdentity.companyName,
    email: cardOperatorIdentity.email,
  } as CardOperator);
  setDifficultyLevel(card.difficultyLevel);
  setRegistrantName(cardContents.registrantName);
  setRegisteredTime(cardContents.registeredTime);

  const approvalInfo = await getApprovalInfo(card, cardContents);

  setApprovalInfo(approvalInfo.approvalInfo);
  setRemark(approvalInfo.remark);
  setCardState(card.cardState);
  setMandatory(cardContents.mandatory);
};

const getApprovalInfo = async (card: Card, cardContents: CardContents) => {
  //
  const { findMemberById } = MemberService.instance;

  // Open 일 때만 시간, 이름
  if (card.cardState === CardStates.Opened || card.cardState === CardStates.Rejected) {
    const request = cardContents.openRequests && cardContents.openRequests[cardContents.openRequests.length - 1];

    const response = request && request.response ? request.response : new CardOpenResponse();

    const res = response.approver ? response : { time: 0, approver: new PatronKey() };

    const {
      time,
      approver: { keyString },
    } = res;

    const remark = response.remark ? response.remark : '';

    let employeeName = '';
    return keyString !== ''
      ? findMemberById(keyString)
          .then((response) => (employeeName = getPolyglotToAnyString(response.name)))
          .then(() => ({
            approvalInfo: `${dayjs(time).format('YYYY.MM.DD HH:mm:ss')} | ${cardStateDisplay(card.cardState)} | ${
              employeeName || ''
            }`,
            remark,
          }))
          .catch(() => ({
            approvalInfo: `${dayjs(time).format('YYYY.MM.DD HH:mm:ss')} | ${cardStateDisplay(card.cardState)}`,
            remark,
          }))
      : {
          approvalInfo: cardStateDisplay(card.cardState),
          remark,
        };
  } else {
    return {
      approvalInfo: cardStateDisplay(card.cardState),
      remark: '',
    };
  }
};

/**
 * 노출 정보 입력
 * @param card
 */
const setExposureInfo = async (card: Card) => {
  //
  const { setThumbnailImagePath, setPermittedCinerooms, setTags } = CardCreateStore.instance;
  const thumbnail = await onUploadCardThumbnail();

  setThumbnailImagePath(card.thumbnailImagePath || thumbnail);
  setPermittedCinerooms(card.permittedCinerooms);
  setTags(new PolyglotModel(card.tags));
};

/**
 * 접근 제어 입력
 * @param card
 * @param userGroupMap
 */
export const setAccessRule = (card: Card, userGroupMap: Map<number, UserGroupRuleModel>) => {
  //
  const accessRuleService = AccessRuleService.instance;

  const { setGroupBasedAccessRule } = CardCreateStore.instance;

  setGroupBasedAccessRule(card.groupBasedAccessRule);
  accessRuleService.setGroupBasedAccessRule(setGroupBasedAccessRuleInfo(card.groupBasedAccessRule, userGroupMap));
};

const setPrerequisite = async (
  cardContents: CardContents,
  mutation: UseBaseMutationResult<CardWithContentsAndRelatedCount, unknown, string>
) => {
  //
  const { setPrerequisiteCards } = CardCreateStore.instance;
  const { groupBasedAccessRule } = AccessRuleService.instance;

  if (cardContents.prerequisiteCards) {
    const next: PreRequisiteCardWithInfo[] = [];

    /* eslint-disable no-await-in-loop */
    for (const prerequisiteCard of cardContents.prerequisiteCards) {
      //
      try {
        const cardWithContentsAndRelatedCount = await mutation.mutateAsync(prerequisiteCard.prerequisiteCardId);

        const { card, cardContents } = cardWithContentsAndRelatedCount;
        next.push({
          prerequisiteCardId: card.id,
          prerequisiteCardName: card.name,
          required: prerequisiteCard.required,
          groupBasedAccessRule: card.groupBasedAccessRule,
          learningTime: card.learningTime,
          hasStamp: card.stampCount > 0,
          registeredTime: cardContents.registeredTime,
          mainCategory: card.mainCategory,
          accessible: GroupBasedAccessRuleModel.asRuleModelForRule(card.groupBasedAccessRule).isAccessible(
            new GroupBasedAccessRule(card.groupBasedAccessRule),
            groupBasedAccessRule
          ),
        });
      } catch (error) {
        //
      }
    }
    setPrerequisiteCards(next);
  }
};

/**
 * 부가 정보 입력
 * @param cardContents
 * @param mutation
 */
const setAdditionalInfo = async (
  cardContents: CardContents,
  mutation: UseBaseMutationResult<CardWithContentsAndRelatedCount, unknown, string>
) => {
  //
  const {
    setFileBoxId,
    setRelatedCards,
    setPisAgreementRequired,
    setPisAgreementTitle,
    setPisAgreementDepotId,
    setCommunityId,
    setCommunityName,
  } = CardCreateStore.instance;
  const { groupBasedAccessRule } = AccessRuleService.instance;
  const { community, findCommunityAdmin } = CommunityStore.instance;

  setFileBoxId(cardContents.fileBoxId);

  if (cardContents.relatedCards) {
    const next: RelatedCardWithInfo[] = [];

    /* eslint-disable no-await-in-loop */
    for (const relatedCard of cardContents.relatedCards) {
      //
      try {
        const cardWithContentsAndRelatedCount = await mutation.mutateAsync(relatedCard.relatedCardId);

        const { card, cardContents } = cardWithContentsAndRelatedCount;
        next.push({
          relatedCardId: relatedCard.relatedCardId,
          card,
          cardContents,
          accessible: GroupBasedAccessRuleModel.asRuleModelForRule(card.groupBasedAccessRule).isAccessible(
            new GroupBasedAccessRule(card.groupBasedAccessRule),
            groupBasedAccessRule
          ),
          id: '',
        });
      } catch (error) {
        //
      }
    }
    setRelatedCards(next);
  }

  setPisAgreementRequired(cardContents.pisAgreementRequired);
  setPisAgreementTitle(new PolyglotModel(cardContents.pisAgreementTitle));
  setPisAgreementDepotId(new PolyglotModel(cardContents.pisAgreementDepotId));

  if (cardContents.communityId) {
    await findCommunityAdmin(cardContents.communityId);
    setCommunityId(cardContents.communityId);
    setCommunityName(community.name || '');
  }
};

/**
 * 추가 정보 입력
 * @param cardContents
 */
const setMoreInfo = async (cardContents: CardContents) => {
  //
  const {
    setReport,
    setReportName,
    setReportQuestion,
    setReportFileBoxId,
    setSurveyId,
    setSurveyCaseId,
    setSurveyTitle,
    setSurveyDesignerName,
    setTests,
  } = CardCreateStore.instance;
  const { setCardSurveyFrom } = CardDetailStore.instance;

  const { findSurveyForm } = SurveyFormService.instance;

  setReport(cardContents.reportFileBox?.report);
  setReportName(new PolyglotModel(cardContents.reportFileBox?.reportName));
  setReportQuestion(new PolyglotModel(cardContents.reportFileBox?.reportQuestion));
  setReportFileBoxId(cardContents.reportFileBox?.fileBoxId);
  setSurveyId(cardContents.surveyId);
  setSurveyCaseId(cardContents.surveyCaseId);

  if (cardContents.surveyId) {
    const surveyForm = await findSurveyForm(cardContents.surveyId);

    setCardSurveyFrom(surveyForm);
    setSurveyTitle(surveyForm.title);
    setSurveyDesignerName(surveyForm.formDesignerName);
  }

  if (cardContents.tests) {
    //
    const paperIds = cardContents.tests?.map((test) => test.paperId);

    const examPapers = await findExamPaperByIds(paperIds);

    if (examPapers) {
      setTests(
        cardContents.tests?.map((test) => {
          const examPaper = examPapers.find((examPaper) => examPaper.id === test.paperId);

          return {
            ...test,
            questionSelectionType: examPaper ? examPaper.questionSelectionType : '',
            totalPoint: examPaper ? examPaper.totalPoint : 0,
            successPoint: examPaper ? examPaper.successPoint : 0,
          } as TestWithViewInfo;
        })
      );
    }
  }
};

/**
 * Card Detail CardLearningStore 에 값 Setting
 * @param cardWithContentsAndRelatedCount
 */
export const setCardLearningByCardContents = async (
  cardWithContentsAndRelatedCount: CardWithContentsAndRelatedCount
) => {
  //
  const { card, cardContents } = cardWithContentsAndRelatedCount;

  // 과정 기간 정보
  setLearningPeriodInfo(card, cardContents);

  // 차수 운영 정보
  setRoundInfo(cardContents);

  // Chapter / Cube / Talk List 정보
  await setLearningContentsInfo(card, cardContents);
};

/**
 * 과정 기간 정보 입력
 */
const setLearningPeriodInfo = (card: Card, cardContents: CardContents) => {
  //
  const {
    setStudentEnrollmentType,
    setLearningPeriod,
    setRestrictLearningPeriod,
    setValidLearningDateCheck,
    setValidLearningDate,
    setEnrollingAvailable,
  } = LearningStore.instance;

  setStudentEnrollmentType(card.studentEnrollmentType);
  setEnrollingAvailable(cardContents.enrollingAvailable ? 'Yes' : 'No');
  setLearningPeriod(cardContents.learningPeriod);
  setRestrictLearningPeriod(cardContents.restrictLearningPeriod);
  setValidLearningDateCheck(cardContents.validLearningDate > 0);
  setValidLearningDate(cardContents.validLearningDate);
};

/**
 * 차수 운영 정보 입력
 */
const setRoundInfo = (cardContents: CardContents) => {
  //
  const { setApprovalProcess, setSendingMail, setCancellationPenalty, setEnrollmentCards } = LearningStore.instance;

  setApprovalProcess(cardContents.approvalProcess ? 'Yes' : 'No');
  setSendingMail(cardContents.sendingMail ? 'Yes' : 'No');
  setCancellationPenalty(cardContents.cancellationPenalty);
  setEnrollmentCards(
    cardContents.enrollmentCards.map(
      (enrollmentCard) => ({ ...enrollmentCard, isApprovalRound: true } as EnrollmentCardWithOptional)
    )
  );
};

/**
 * Chapter / Cube / Talk 정보 입력
 * @param card
 * @param cardContents
 */
const setLearningContentsInfo = async (card: Card, cardContents: CardContents) => {
  //
  const { setRestrictLearningPeriod, setInstructors, setAdditionalLearningTime, setSequentialStudyRequired } =
    LearningStore.instance;
  const { setSelectedCubeId } = EnrollmentCubeStore.instance;

  // Cube 순서
  setSequentialStudyRequired(cardContents.sequentialStudyRequired);

  setRestrictLearningPeriod(cardContents.restrictLearningPeriod);

  setAdditionalLearningTime(card.additionalLearningTime);

  await setLearningContentList(cardContents);

  setCardLearningTime();

  const instructorIds =
    (cardContents.instructors &&
      cardContents.instructors.length > 0 &&
      cardContents.instructors.map((instructor) => instructor.instructorId)) ||
    [];
  const instructorDetails =
    (instructorIds && instructorIds.length > 0 && (await findInstructorDetails(instructorIds))) || [];

  const newInstructors = instructorDetails.map((instructorDetail) => {
    return {
      ...InstructorWithOptionalFunc.fromInstructorWithUserRdo(instructorDetail),
      representative:
        cardContents.instructors.find((instructor) => instructor.instructorId === instructorDetail.instructor.id)
          ?.representative || false,
    };
  });

  instructorDetails && setInstructors(newInstructors);

  setSelectedCubeId('');
};

/**
 * 강사 정보 가져오기
 * @param ids
 */
const findInstructorDetails = async (ids: string[]): Promise<InstructorWithUserRdo[]> => {
  const result = await findInstructorsByIds(ids);
  return result;
};

const setLearningContentList = async (cardContents: CardContents) => {
  //
  const { setLearningContents } = LearningContentsStore.instance;

  const cubeIds: string[] = [];
  const discussionIds: string[] = [];
  const cubeMap = new Map<string, CubeDetail>();

  cardContents.learningContents &&
    cardContents.learningContents.forEach((contents) => {
      if (contents.learningContentType === 'Chapter') {
        contents.children &&
          contents.children.forEach((cContents) => {
            if (cContents.learningContentType === 'Cube') {
              cubeIds.push(cContents.contentId);
            } else if (cContents.learningContentType === 'Discussion') {
              discussionIds.push(cContents.contentId);
            }
          });
      } else if (contents.learningContentType === 'Cube') {
        cubeIds.push(contents.contentId);
      } else if (contents.learningContentType === 'Discussion') {
        discussionIds.push(contents.contentId);
      }
    });

  const nextLearningContents: LearningContentWithOptional[] = [];
  const cubeDetails = await findCubesDetailsByIds(cubeIds);
  const discussionMap = await findAndSetDiscussion(discussionIds);

  cubeDetails.map((cubeDetail) => cubeMap.set(cubeDetail.cube.id, cubeDetail));

  cardContents.learningContents?.forEach((content) => {
    if (content.learningContentType === 'Chapter') {
      //
      const children = content.children;
      const nextChildren: LearningContentWithOptional[] = [];

      if (children) {
        //
        children.forEach((childrenContent) => {
          //
          if (childrenContent.learningContentType === 'Cube') {
            //
            const cubeDetail = cubeMap.get(childrenContent.contentId);

            if (cubeDetail) {
              nextChildren.push({
                ...childrenContent,
                name: (cubeDetail && cubeDetail.cube.name) || childrenContent.name,
                cubeWithMaterial: cubeDetail,
                inChapter: true,
                selected: false,
              } as LearningContentWithOptional);
            }
          } else if (childrenContent.learningContentType === 'Discussion') {
            //
            const discussion = discussionMap.get(childrenContent.contentId);

            if (discussion) {
              //
              nextChildren.push({
                ...childrenContent,
                inChapter: true,
                selected: false,
                cardDiscussion: discussion,
              } as LearningContentWithOptional);
            }
          }
        });
      }

      nextLearningContents.push({
        ...content,
        children: nextChildren,
        inChapter: false,
        selected: false,
      } as LearningContentWithOptional);
    } else if (content.learningContentType === 'Cube') {
      //
      const cubeDetail = cubeMap.get(content.contentId);

      if (cubeDetail) {
        nextLearningContents.push({
          ...content,
          name: (cubeDetail && cubeDetail.cube.name) || content.name,
          cubeWithMaterial: cubeDetail,
          inChapter: true,
          selected: false,
        } as LearningContentWithOptional);
      } else {
        nextLearningContents.push({ ...content, inChapter: false, selected: false } as LearningContentWithOptional);
      }
    } else if (content.learningContentType === 'Discussion') {
      //
      const discussion = discussionMap.get(content.contentId);

      if (discussion) {
        //
        nextLearningContents.push({
          ...content,
          inChapter: true,
          selected: false,
          cardDiscussion: discussion,
        } as LearningContentWithOptional);
      }
    }
  });

  setLearningContents(nextLearningContents);
};

/**
 * 토론 정보 가져오기
 * @param ids
 */
const findAndSetDiscussion = async (ids: string[]) => {
  //
  const { findDiscussion, clearDiscussion } = DiscussionService.instance;

  const discussionMap = new Map<string, Discussion>();

  await Promise.all(
    ids.map(async (feedbackId) => {
      const discussion = await findDiscussion(feedbackId);

      if (discussion.commentFeedbackId) {
        const feedback = await CommentApi.instance.findCommentFeedback(discussion.commentFeedbackId);
        discussion.privateComment = feedback.config.privateComment;
      }

      discussionMap.set(discussion.id, discussion);
    })
  );

  await clearDiscussion();

  return discussionMap;
};
