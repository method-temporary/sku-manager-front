import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Container, Form } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import {
  GroupBasedAccessRuleModel,
  SelectType,
  IconType,
  FileUploadType,
  SelectTypeModel,
  GroupBasedAccessRule,
} from 'shared/model';
import { SharedService, AccessRuleService } from 'shared/present';
import {
  AccessRuleSettings,
  alert,
  AlertModel,
  confirm,
  ConfirmModel,
  PageTitle,
  SubActions,
  Loader,
  Polyglot,
} from 'shared/components';
import { isDefaultPolyglotBlank } from 'shared/components/Polyglot';
import { LoaderService } from 'shared/components/Loader';

import { learningManagementUrl } from '../../../../Routes';
import { ExamService } from '../../../../exam';
import { TestSheetModalContainer } from 'exam/ui/logic/TestSheetModalContainer';
import { onUploadCardThumbnail } from 'card/card/present/logic/CardThumbnailSelectService';
import { MemberService } from '../../../../approval';
import { UserGroupService } from '../../../../usergroup';
import { SurveyFormService } from '../../../../survey';
import { CollegeService } from '../../../../college';
import { InstructorService } from '../../../../instructor/instructor';
import { CubeService } from '../../../../cube';
import { LearningContentType } from '../../model/vo/LearningContentType';
import { DiscussionService } from '../../../../discussion';
import Discussion from '../../../../discussion/model/Discussion';
import { DifficultyLevel } from '../../../../cube/cube';
import { UserWorkspaceService } from '../../../../userworkspace';

import { CardService } from '../../index';
import { findGroupBasedAccessRules } from './CardHelper';
import { CardRelatedCardModel } from '../../../../_data/lecture/cards/model/vo/CardRelatedCardModel';
import CardBasicInfoContainer from './CardBasicInfoContainer';
import CardExposureInfoContainer from './CardExposureInfoContainer';
import CardLearningInfoListContainer from './CardLearningInfoListContainer';
import CardContentsInfoContainer from './CardContentsInfoContainer';
import CardAdditionalInfoContainer from './CardAdditionalInfoContainer';
import CardPrerequisiteCardContainer from './CardPrerequisiteCardContainer';
import {
  setCommunity,
  setCubeInfoAndTerm,
  setDiscussionInfo,
  setInstructorInfo,
  setPrerequisiteCards,
  setRelatedCards,
  setSurvey,
} from './CardLoadQueryModelHelper';
import { cardBreadcrumb } from '../../../shared/utiles';

interface Params {
  cineroomId: string;
  cardId: string;
  copiedId: string;
}

interface Props extends RouteComponentProps<Params> {}

interface State {
  isUpdatable: boolean;
  newCardId: string;
  approvalInfo: string;
  imageFile?: File;
}

interface Injected {
  cardService: CardService;
  collegeService: CollegeService;
  surveyFormService: SurveyFormService;
  accessRuleService: AccessRuleService;
  examService: ExamService;
  userGroupService: UserGroupService;
  memberService: MemberService;
  sharedService: SharedService;
  instructorService: InstructorService;
  cubeService: CubeService;
  discussionService: DiscussionService;
  loaderService: LoaderService;
  userWorkspaceService: UserWorkspaceService;
}

@inject(
  'cardService',
  'collegeService',
  'surveyFormService',
  'examService',
  'accessRuleService',
  'userGroupService',
  'memberService',
  'sharedService',
  'instructorService',
  'cubeService',
  'discussionService',
  'loaderService',
  'userWorkspaceService'
)
@observer
@reactAutobind
class CardCreateContainer extends ReactComponent<Props, State, Injected> {
  //
  state: State = {
    isUpdatable: true,
    newCardId: '',
    approvalInfo: '',
  };

  constructor(props: Props) {
    //
    super(props);

    const { cardId, copiedId, cineroomId } = this.props.match.params;

    this.init();

    if (cardId) {
      this.findCard(cardId, cineroomId);
    } else if (copiedId) {
      this.copyCard(copiedId, cineroomId);
    } else {
      const { cardService, surveyFormService } = this.injected;

      const { changeCardContentsQueryProps } = cardService;

      changeCardContentsQueryProps('surveyCaseId', 'default');
      changeCardContentsQueryProps('surveyId', '8460bf79-12d2-4c1e-9051-a0acab151c83');
      setSurvey(cardService, surveyFormService);
    }
  }

  // ?????? init
  async init() {
    //
    const { surveyFormService, examService, sharedService } = this.injected;

    this.pageRefresh();

    // ??????, Exam(Text) ?????????
    surveyFormService.clearSurveyFormProps();
    examService.clearExams();
  }

  pageRefresh() {
    //
    const { clearCardQueryWithOutSearch, clearCardContentsQuery, clearPrerequisiteCards, clearRelatedCards } =
      this.injected.cardService;

    clearCardQueryWithOutSearch();
    clearCardContentsQuery();
    clearPrerequisiteCards();
    clearRelatedCards();
  }

  async findCard(cardId: string, cineroomId: string) {
    //
    const {
      cardService,
      accessRuleService,
      userGroupService,
      surveyFormService,
      instructorService,
      cubeService,
      collegeService,
      discussionService,
    } = this.injected;
    const { collegesMap, channelMap } = collegeService;

    await cardService.findCardById(cardId, cineroomId);

    await setDiscussionInfo(cardService, discussionService);
    await setCubeInfoAndTerm(cardService, cubeService, collegesMap, channelMap);
    await setCommunity(cardService);

    await findGroupBasedAccessRules(cardService.cardQuery, accessRuleService, userGroupService);

    await setPrerequisiteCards(cardService);
    await setInstructorInfo(cardService, instructorService);
    await setRelatedCards(cardService);
    await setSurvey(cardService, surveyFormService);
  }

  async copyCard(cardId: string, cineroomId: string) {
    //
    const { cardService, surveyFormService, accessRuleService, userGroupService } = this.injected;

    await cardService.findCardById(cardId, cineroomId);

    await setSurvey(cardService, surveyFormService);
    await findGroupBasedAccessRules(cardService.cardQuery, accessRuleService, userGroupService);
    //
    cardService.changeCardQueryProps('categories', []);
    cardService.changeCardQueryProps('permittedCinerooms', []);
    cardService.changeCardQueryProps('permittedRequireCineroomsIds', []);
    cardService.changeCardQueryProps('learningTime', 0);
    // cardService.changeCardQueryProps('additionalLearningTime', 0);
    cardService.changeCardContentsQueryProps('learningContents', []);
    cardService.changeCardContentsQueryProps('cardOperator', null);
    cardService.changeCardContentsQueryProps('fileBoxId', '');
    cardService.changeCardContentsQueryProps('reportFileBox.fileBoxId', '');
    cardService.changeCardContentsQueryProps('instructors', []);
  }

  routeToGoBack() {
    //
    this.props.history.goBack();
  }

  routeToCardList() {
    //
    this.props.history.push(`/cineroom/${this.props.match.params.cineroomId}/${learningManagementUrl}/cards/card-list`);
  }

  routeToCardDetail(cardId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${learningManagementUrl}/cards/card-detail/${cardId}`
    );
  }

  async onClickSaveCard() {
    //
    this.injected.loaderService.openPageLoader(true);

    const { cardService } = this.injected;
    const { changeCardQueryProps } = cardService;
    const thumbnailImageUrl = await onUploadCardThumbnail();
    changeCardQueryProps('thumbnailImagePath', thumbnailImageUrl);

    const validation = await this.validationCheck();
    this.injected.loaderService.closeLoader(true);
    if (!validation) return;

    if (this.props.match.params.cardId) {
      confirm(
        ConfirmModel.getSaveConfirm(() => {
          this.onClickModify();
        }),
        false
      );
    } else {
      confirm(
        ConfirmModel.getSaveAndApprovalConfirm(
          () => {
            this.onClickSaveAndApproval(true);
          },
          () => {
            this.onClickSaveAndApproval(false);
          }
        ),
        false
      );
    }
  }

  async onClickSaveAndApproval(approval?: boolean) {
    //
    const { cardService, accessRuleService, sharedService } = this.injected;
    const { cardQuery, changeCardQueryProps, changeCardContentsQueryProps, registerCard, approvalCard } = cardService;

    changeCardQueryProps(
      'groupBasedAccessRule',
      GroupBasedAccessRuleModel.asGroupBasedAccessRule(accessRuleService.groupBasedAccessRule)
    );

    changeCardContentsQueryProps(
      'relatedCards',
      cardService.relatedCards.map(
        (cardModel) => new CardRelatedCardModel({ relatedCardId: cardModel.card.id } as CardRelatedCardModel)
      )
    );

    if (cardQuery.thumbImagePath === '') {
      if (cardQuery.iconType === IconType.SKUniversity) {
        changeCardQueryProps('thumbImagePath', cardQuery.iconPath);
      } else if (this.state.imageFile) {
        const path = await sharedService.uploadFile(this.state.imageFile, FileUploadType.Card);

        changeCardQueryProps('thumbImagePath', path);
      }
    }

    await this.setDiscussions();

    const newCardId = await registerCard();

    if (newCardId === '') {
      return;
    }

    if (approval) await approvalCard(newCardId);

    alert(
      AlertModel.getSaveSuccessAlert(() => {
        this.routeToCardDetail(newCardId);
      })
    );
  }

  async onClickModify() {
    //
    const { sharedService, cardService, accessRuleService } = this.injected;
    const cardId = this.props.match.params.cardId;
    const { cardQuery, changeCardQueryProps, changeCardContentsQueryProps, modifyCard } = cardService;

    changeCardQueryProps(
      'groupBasedAccessRule',
      GroupBasedAccessRuleModel.asGroupBasedAccessRule(accessRuleService.groupBasedAccessRule)
    );

    changeCardContentsQueryProps(
      'relatedCards',
      cardService.relatedCards.map(
        (cardModel) => new CardRelatedCardModel({ relatedCardId: cardModel.card.id } as CardRelatedCardModel)
      )
    );

    if (cardQuery.thumbImagePath === '') {
      if (cardQuery.iconType === IconType.SKUniversity) {
        changeCardQueryProps('thumbImagePath', cardQuery.iconPath);
      } else if (this.state.imageFile) {
        const path = await sharedService.uploadFile(this.state.imageFile, FileUploadType.Card);

        changeCardQueryProps('thumbImagePath', path);
      }
    }

    await this.setDiscussions();

    await modifyCard(cardId);

    alert(
      AlertModel.getSaveSuccessAlert(() => {
        this.routeToCardDetail(cardId);
      })
    );
  }

  async setDiscussions() {
    //
    const { cardService } = this.injected;

    const learningContents = cardService.cardContentsQuery.learningContents;
    const discussions: Discussion[] = [];

    learningContents &&
      learningContents.forEach((content) => {
        if (content.learningContentType === LearningContentType.Chapter) {
          content.children &&
            content.children.forEach((cContent) => {
              if (cContent.learningContentType === LearningContentType.Discussion) {
                discussions.push(cContent.discussion);
              }
            });
        } else if (content.learningContentType === LearningContentType.Discussion) {
          discussions.push(content.discussion);
        }
      });

    cardService.changeCardContentsQueryProps('cardDiscussions', discussions);
  }

  validationCheck() {
    //
    const { cardService, accessRuleService } = this.injected;
    const { cardQuery, cardContentsQuery } = cardService;
    const { groupBasedAccessRule } = accessRuleService;

    let noAccessCard = 0;

    if (cardContentsQuery.learningContents) {
      let cubeCnt = 0;

      if (cardQuery.categories.filter((category) => category.mainCategory).length === 0) {
        alert(AlertModel.getRequiredChoiceAlert('????????????'));
        return false;
      }

      if (isDefaultPolyglotBlank(cardQuery.langSupports, cardQuery.name)) {
        alert(AlertModel.getRequiredInputAlert('Card ???'));
        return false;
      }

      if (
        ((cardQuery.iconType === IconType.SKUniversity && cardQuery.iconPath === '') ||
          (cardQuery.iconType === IconType.Personal && cardQuery.fileIconPath === '')) &&
        cardQuery.thumbImagePath === ''
      ) {
        alert(AlertModel.getRequiredChoiceAlert('?????????'));
        return false;
      }

      if (cardQuery.permittedCinerooms.length === 0) {
        alert(AlertModel.getRequiredChoiceAlert('????????? ?????? ?????? ??????'));
        return false;
      }

      if (groupBasedAccessRule.accessRules.length === 0) {
        alert(AlertModel.getRequiredChoiceAlert('?????? ?????? ??????'));
        return false;
      }

      if (cardContentsQuery.learningContents.length === 0) {
        alert(AlertModel.getRequiredChoiceAlert('?????? ??????'));
        return false;
      }

      // Chapter / Cube / Talk List ?????? -> Cube??? ????????? ?????? 1??? ?????? ???????????? ???
      cardContentsQuery.learningContents.forEach((content) => {
        if (content.learningContentType === LearningContentType.Chapter) {
          const children = content.children;

          children.forEach((cContent) => {
            cContent.learningContentType === LearningContentType.Cube && cubeCnt++;
          });
        } else if (content.learningContentType === LearningContentType.Cube) {
          cubeCnt++;
        }
      });

      if (cubeCnt === 0) {
        alert(AlertModel.getRequiredChoiceAlert('Cube'));
        return false;
      }
    }

    if (cardQuery.thumbnailImagePath.length === 0) {
      alert(AlertModel.getRequiredChoiceAlert('?????????'));
      return false;
    }

    if (cardContentsQuery.hasPrerequisite === 'Yes' && cardContentsQuery.prerequisiteCards.length === 0) {
      alert(AlertModel.getRequiredChoiceAlert('?????? Card'));
      return false;
    }

    if (cardContentsQuery.hasPrerequisite === 'Yes' && cardContentsQuery.prerequisiteCards.length > 0) {
      cardContentsQuery.prerequisiteCards.forEach((preCard) => {
        !GroupBasedAccessRuleModel.asRuleModelForRule(preCard.groupBasedAccessRule).isAccessible(
          new GroupBasedAccessRule(preCard.groupBasedAccessRule),
          groupBasedAccessRule
        ) && noAccessCard++;
      });
    }

    if (noAccessCard > 0) {
      alert(AlertModel.getCustomAlert(true, '????????????', '??????????????? ?????? ????????? ???????????????', '??????'));
      return false;
    }

    if (cardContentsQuery.learningPeriod.startDateLong === 0 || cardContentsQuery.learningPeriod.endDateLong === 0) {
      alert(AlertModel.getRequiredChoiceAlert('????????????'));
      return false;
    }

    if (isDefaultPolyglotBlank(cardQuery.langSupports, cardQuery.simpleDescription)) {
      alert(AlertModel.getRequiredInputAlert('Card ?????? ??????'));
      return false;
    }

    if (isDefaultPolyglotBlank(cardQuery.langSupports, cardContentsQuery.description)) {
      alert(AlertModel.getRequiredInputAlert('Card ??????'));
      return false;
    }

    if (!cardContentsQuery.cardOperator || cardContentsQuery.cardOperator.id === '') {
      alert(AlertModel.getRequiredChoiceAlert('?????????'));
      return false;
    }

    if (cardQuery.difficultyLevel === DifficultyLevel.Empty) {
      alert(AlertModel.getRequiredInputAlert('?????????'));
      return false;
    }

    if (
      cardContentsQuery.instructors.length > 0 &&
      cardContentsQuery.instructors.filter((instructor) => instructor.representative).length === 0
    ) {
      alert(AlertModel.getRequiredChoiceAlert('????????????'));
      return false;
    }

    // if (cardContentsQuery.reportFileBox.reportName !== '' && cardContentsQuery.reportFileBox.reportQuestion === '') {
    //   alert(AlertModel.getRequiredInputAlert('Report ????????? ???????????????'));
    //   return false;
    // }
    if (
      cardContentsQuery.reportFileBox &&
      isDefaultPolyglotBlank(cardQuery.langSupports, cardContentsQuery.reportFileBox.reportName)
    ) {
      if (
        cardContentsQuery.reportFileBox.fileBoxId ||
        !isDefaultPolyglotBlank(cardQuery.langSupports, cardContentsQuery.reportFileBox.reportQuestion)
      ) {
        alert(AlertModel.getRequiredInputAlert('Report ???'));
        return false;
      }
    }

    return this.overLepCheck();
  }

  async overLepCheck() {
    //
    const { cardQuery, findCardDuplicateCardName } = this.injected.cardService;

    const cardDuplicateRdo = { name: cardQuery.name, id: this.props.match.params.cardId || undefined };

    const count = await findCardDuplicateCardName(cardDuplicateRdo);

    if (count > 0) {
      alert(AlertModel.getOverlapAlert(`"?????????"`));
      return false;
    }

    return true;
  }

  onClickCardImport() {
    //
    const { cardService } = this.injected;
    const cardId = cardService.singleSelectedCard.card.id;

    if (cardId) {
      this.props.history.push(
        `/cineroom/${this.props.match.params.cineroomId}/${learningManagementUrl}/cards/card-create/copy/${cardId}`
      );
    } else {
      alert(AlertModel.getCustomAlert(true, 'Card ???????????? ??????', 'Card??? ??????????????????', '??????', () => {}));
    }
  }

  render() {
    //
    const { isUpdatable } = this.state;
    const { cineroomId, cardId, copiedId } = this.props.match.params;
    const {
      cardService,
      collegeService,
      surveyFormService,
      examService,
      memberService,
      instructorService,
      cubeService,
      // stationService,
      accessRuleService,
      sharedService,
      userWorkspaceService,
    } = this.injected;
    const { cardContentsQuery, cardQuery } = cardService;

    const { collegesMap, channelMap } = collegeService;

    const userWorkspaces =
      cineroomId === 'ne1-m2-c2'
        ? userWorkspaceService.allUserWorkspaces
        : userWorkspaceService.userWorkspacesByUserWorkspaceId(cineroomId);
    const userWorkspaceMap = userWorkspaceService.userWorkspaceMap;

    return (
      <>
        <Container fluid>
          <PageTitle breadcrumb={cardBreadcrumb} />
          <Polyglot languages={cardService.cardQuery.langSupports}>
            <Form>
              <Loader />
              {/*?????? ??????*/}
              <CardBasicInfoContainer
                isUpdatable
                cardId={cardId}
                approvalInfo={this.state.approvalInfo}
                cardService={cardService}
                memberService={memberService}
                collegeService={collegeService}
                onClickCardImport={this.onClickCardImport}
              />

              {/*?????? ??????*/}
              {/*<CardExposureInfoContainer*/}
              {/*  cardId={cardId}*/}
              {/*  isUpdatable*/}
              {/*  cineroomId={cineroomId}*/}
              {/*  cardService={cardService}*/}
              {/*  sharedService={sharedService}*/}
              {/*  userWorkspaces={userWorkspaces}*/}
              {/*  userWorkspaceMap={userWorkspaceMap}*/}
              {/*  iconGroups={iconGroups}*/}
              {/*  setFile={(file: File) => this.setState({ imageFile: file })}*/}
              {/*/>*/}

              {/*?????? ??????*/}
              <AccessRuleSettings readOnly={!isUpdatable} multiple={false} />

              {/*Chapter / Cube / Talk  List ??????*/}
              <CardLearningInfoListContainer
                isUpdatable
                cineroomId={cineroomId}
                cardService={cardService}
                instructorService={instructorService}
                cubeService={cubeService}
                collegesMap={collegesMap}
                channelMap={channelMap}
              />

              {/*?????? Card ??????*/}
              {cardContentsQuery.hasPrerequisite === 'Yes' && (
                <CardPrerequisiteCardContainer
                  isUpdatable
                  cardService={cardService}
                  collegesMap={collegesMap}
                  channelMap={channelMap}
                  groupBasedAccessRule={accessRuleService.groupBasedAccessRule}
                />
              )}

              {/*?????? ??????*/}
              <CardContentsInfoContainer
                isUpdatable
                cardService={cardService}
                collegesMap={collegesMap}
                channelMap={channelMap}
              />

              {/*?????? ??????*/}
              <CardAdditionalInfoContainer
                isUpdatable
                cardService={cardService}
                examService={examService}
                surveyFormService={surveyFormService}
              />

              <SubActions form>
                <SubActions.Left>
                  {cardId && this.state.isUpdatable && <Button onClick={this.routeToGoBack}>??????</Button>}
                </SubActions.Left>
                <SubActions.Right>
                  <Button onClick={this.routeToCardList}>??????</Button>
                  <Button primary onClick={this.onClickSaveCard}>
                    ??????
                  </Button>
                </SubActions.Right>
              </SubActions>
            </Form>
          </Polyglot>
        </Container>
        <TestSheetModalContainer />
      </>
    );
  }
}

export default CardCreateContainer;
