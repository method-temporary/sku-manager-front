import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer, inject } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { Accordion, Container, Form, Header, Icon, Segment } from 'semantic-ui-react';

import {
  AccessRuleSettings,
  PageTitle,
  alert,
  AlertModel,
  confirm,
  ConfirmModel,
  Loader,
  Polyglot,
} from 'shared/components';
import { SelectType } from 'shared/model';

import { sharedService, AccessRuleService } from 'shared/present';
import { LoaderService } from 'shared/components/Loader/present/logic/LoaderService';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CardService } from '../../index';
import { ExamService } from '../../../../exam';
import { UserGroupService } from '../../../../usergroup';

import { CollegeService } from '../../../../college';
import { SurveyCaseService, SurveyFormService } from '../../../../survey';

import { learningManagementUrl } from '../../../../Routes';
import CardBasicInfoContainer from './CardBasicInfoContainer';
import CardExposureInfoContainer from './CardExposureInfoContainer';
import CardLearningInfoListContainer from './CardLearningInfoListContainer';
import CardContentsInfoContainer from './CardContentsInfoContainer';
import CardAdditionalInfoContainer from './CardAdditionalInfoContainer';
import CardPrerequisiteCardContainer from './CardPrerequisiteCardContainer';
import { findGroupBasedAccessRules } from './CardHelper';
import {
  getApprovalInfo,
  setCommunity,
  setCubeInfoAndTerm,
  setDiscussionInfo,
  setInstructorInfo,
  setPrerequisiteCards,
  setRelatedCards,
  setSurvey,
} from './CardLoadQueryModelHelper';
import CardApprovalInfoView from '../view/CardApprovalInfoView';
import { MemberService } from '../../../../approval';
import { CubeService } from '../../../../cube';
import { InstructorService } from '../../../../instructor/instructor';
import { DiscussionService } from '../../../../discussion';
import { UserWorkspaceService } from '../../../../userworkspace';
import { TestSheetModalContainer } from 'exam/ui/logic/TestSheetModalContainer';

interface Params {
  cineroomId: string;
  cardId: string;
}

interface Props extends RouteComponentProps<Params> {}

interface States {
  activeIndex: number;
  surveyCommentId: string;
  approvalInfo: string;
  remark: string;
}

interface Injected {
  cardService: CardService;
  collegeService: CollegeService;
  surveyFormService: SurveyFormService;
  accessRuleService: AccessRuleService;
  userGroupService: UserGroupService;
  examService: ExamService;
  memberService: MemberService;
  cubeService: CubeService;
  instructorService: InstructorService;
  surveyCaseService: SurveyCaseService;
  discussionService: DiscussionService;
  userWorkspaceService: UserWorkspaceService;
  loaderService: LoaderService;
}

@inject(
  'cardService',
  'collegeService',
  'surveyFormService',
  'surveyCaseService',
  'examService',
  'accessRuleService',
  'userGroupService',
  'memberService',
  'cubeService',
  'instructorService',
  'discussionService',
  'userWorkspaceService',
  'loaderService'
)
@observer
@reactAutobind
class CardApprovalDetailContainer extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      activeIndex: 0,
      surveyCommentId: '',
      approvalInfo: '',
      remark: '',
    };

    const { cardId } = this.props.match.params;

    if (cardId) {
      this.findCard(cardId);
    } else {
      this.routeToList();
    }
  }

  async findCard(cardId: string) {
    //
    const { cardService, surveyCaseService, loaderService } = this.injected;

    loaderService.openLoader(true);
    await cardService.findCardById(cardId);
    loaderService.closeLoader(true, 'info');

    const surveyCommentId = cardService.cardContentsQuery.surveyCaseId
      ? await surveyCaseService.findSurveyCaseByFeedId(cardService.cardContentsQuery.surveyCaseId)
      : '';
    await this.setState({ surveyCommentId });

    await this.setCardCreatorEmail();
    await this.setCardData();
  }

  async setCardData() {
    //
    const { cardService, accessRuleService, userGroupService, memberService, loaderService } = this.injected;

    const { approvalInfo } = await getApprovalInfo(cardService, memberService);
    loaderService.closeLoader(true, 'approvalInfo');

    await this.setState({ approvalInfo });

    // 노출 정보 - Community
    await setCommunity(cardService);
    loaderService.closeLoader(true, 'exposure');

    // Chapter / Cube / Talk List 정보
    this.setLearningContentsInfo();

    // 접근제어
    findGroupBasedAccessRules(cardService.cardQuery, accessRuleService, userGroupService);

    // 선수카드
    setPrerequisiteCards(cardService);

    // 부가정보
    this.setContentsInfo();

    // 추가정보
    this.setAdditionalInfo();
  }

  async setLearningContentsInfo() {
    //
    const { cardService, cubeService, collegeService, discussionService, loaderService } = this.injected;

    const { collegesMap, channelMap } = collegeService;

    await setCubeInfoAndTerm(cardService, cubeService, collegesMap, channelMap);
    await setDiscussionInfo(cardService, discussionService);

    loaderService.closeLoader(true, 'learning');
  }

  async setContentsInfo() {
    //
    const { cardService, instructorService, loaderService } = this.injected;

    // 부가정보 - 강사 정보
    await setInstructorInfo(cardService, instructorService);
    // 부가정보 - 관련 과정
    await setRelatedCards(cardService);

    loaderService.closeLoader(true, 'contents');
  }

  async setAdditionalInfo() {
    //
    const { cardService, surveyFormService, loaderService } = this.injected;

    // 추가정보 - 설문
    await setSurvey(cardService, surveyFormService);

    loaderService.closeLoader(true, 'additional');
  }

  async setCardCreatorEmail() {
    //
    const { cardService, memberService } = this.injected;

    const id = cardService.cardQuery.patronKey.keyString;

    const employee = await memberService.findMemberByAudienceId(id);

    cardService.changeCardContentsQueryProps('email', employee.email);
  }

  onClickAccordion = (e: any, titleProps: any) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  onClickOpened() {
    //
    const { cardId } = this.props.match.params;
    const { openedCard } = this.injected.cardService;

    confirm(
      ConfirmModel.getApprovalConfirm('Card', () => {
        openedCard(cardId);
        alert(AlertModel.getApprovalSuccessAlert(() => this.findCard(cardId)));
      }),
      false
    );
  }

  async onClickRejected() {
    //
    const { rejectedCard, clearCardRejected } = this.injected.cardService;

    const cardId = this.props.match.params.cardId;

    await rejectedCard(cardId);
    await clearCardRejected();
    await this.findCard(cardId);
  }

  routeToList() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${learningManagementUrl}/cards/card-approval-list`
    );
  }

  render() {
    //
    const { activeIndex } = this.state;
    const { cineroomId } = this.props.match.params;
    const {
      cardService,
      collegeService,
      // stationService,
      surveyFormService,
      examService,
      memberService,
      accessRuleService,
      userWorkspaceService,
    } = this.injected;
    const { cardQuery, cardContentsQuery, changeCardReactedProps } = cardService;

    const { collegesMap, channelMap } = collegeService;

    const userWorkspaces =
      cineroomId === 'ne1-m2-c2'
        ? userWorkspaceService.allUserWorkspaces
        : userWorkspaceService.userWorkspacesByUserWorkspaceId(cineroomId);

    const userWorkspaceMap = userWorkspaceService.userWorkspaceMap;

    return (
      <>
        <Container fluid>
          <Form>
            <PageTitle breadcrumb={SelectType.cardApprovalSections} />

            <Header as="h3" className="learning-tit">
              {cardQuery && getPolyglotToAnyString(cardQuery.name)}
            </Header>

            <Polyglot languages={cardService.cardQuery.langSupports}>
              {/*승인 정보*/}
              <Loader name="approvalInfo">
                <CardApprovalInfoView
                  cardQuery={cardQuery}
                  cardContentsQuery={cardContentsQuery}
                  changeCardReactedProps={changeCardReactedProps}
                  approvalInfo={this.state.approvalInfo}
                  remark={this.state.remark}
                  onClickOpened={this.onClickOpened}
                  onClickRejected={this.onClickRejected}
                />
              </Loader>

              {/*기본 정보*/}
              <Accordion fluid>
                <Accordion.Title active={activeIndex === 1} index={1} onClick={this.onClickAccordion}>
                  <Segment>
                    <Icon name="dropdown" />
                    기본 정보
                  </Segment>
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 1}>
                  <Loader name="info">
                    <CardBasicInfoContainer
                      isUpdatable={false}
                      cardService={cardService}
                      memberService={memberService}
                      collegeService={collegeService}
                      approvalInfo={this.state.approvalInfo}
                    />
                  </Loader>
                </Accordion.Content>

                {/*노출 정보*/}
                <Accordion.Title active={activeIndex === 2} index={2} onClick={this.onClickAccordion}>
                  <Segment>
                    <Icon name="dropdown" />
                    노출 정보
                  </Segment>
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 2}>
                  <Loader name="exposure">
                    <CardExposureInfoContainer
                      isUpdatable={false}
                      cineroomId={cineroomId}
                      cardService={cardService}
                      sharedService={sharedService}
                      userWorkspaces={userWorkspaces}
                      userWorkspaceMap={userWorkspaceMap}
                    />
                  </Loader>
                </Accordion.Content>

                {/*접근 제어*/}
                <Accordion.Title active={activeIndex === 3} index={3} onClick={this.onClickAccordion}>
                  <Segment>
                    <Icon name="dropdown" />
                    접근 제어 정보
                  </Segment>
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 3}>
                  <Loader name="accessRule">
                    <AccessRuleSettings readOnly multiple={false} />
                  </Loader>
                </Accordion.Content>

                {/*Chapter / Cube / Talk List 정보 정보*/}
                <Accordion.Title active={activeIndex === 4} index={4} onClick={this.onClickAccordion}>
                  <Segment>
                    <Icon name="dropdown" />
                    Chapter / Cube / Talk List 정보
                  </Segment>
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 4}>
                  <Loader name="learning">
                    <CardLearningInfoListContainer
                      isUpdatable={false}
                      cineroomId={cineroomId}
                      cardService={cardService}
                      collegesMap={collegesMap}
                      channelMap={channelMap}
                    />
                  </Loader>
                </Accordion.Content>

                {/*선수 Card 정보*/}
                {(cardContentsQuery.hasPrerequisite === 'Yes' || cardContentsQuery.prerequisiteCards.length > 0) && (
                  <>
                    <Accordion.Title active={activeIndex === 5} index={5} onClick={this.onClickAccordion}>
                      <Segment>
                        <Icon name="dropdown" />
                        선수 Card 정보
                      </Segment>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 5}>
                      <Loader name="prerequisite">
                        <CardPrerequisiteCardContainer
                          isUpdatable={false}
                          cardService={cardService}
                          collegesMap={collegesMap}
                          channelMap={channelMap}
                          groupBasedAccessRule={accessRuleService.groupBasedAccessRule}
                        />
                      </Loader>
                    </Accordion.Content>
                  </>
                )}

                {/*부가 정보*/}
                <Accordion.Title active={activeIndex === 6} index={6} onClick={this.onClickAccordion}>
                  <Segment>
                    <Icon name="dropdown" />
                    부가 정보
                  </Segment>
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 6}>
                  <Loader name="contents">
                    <CardContentsInfoContainer
                      isUpdatable={false}
                      cardService={cardService}
                      collegesMap={collegesMap}
                      channelMap={channelMap}
                    />
                  </Loader>
                </Accordion.Content>

                {/*추가 정보*/}
                <Accordion.Title active={activeIndex === 7} index={7} onClick={this.onClickAccordion}>
                  <Segment>
                    <Icon name="dropdown" />
                    추가 정보
                  </Segment>
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 7}>
                  <Loader name="additional">
                    <CardAdditionalInfoContainer
                      isUpdatable={false}
                      cardService={cardService}
                      examService={examService}
                      surveyFormService={surveyFormService}
                    />
                  </Loader>
                </Accordion.Content>
              </Accordion>
            </Polyglot>
          </Form>
        </Container>
        <TestSheetModalContainer />
      </>
    );
  }
}

export default CardApprovalDetailContainer;
