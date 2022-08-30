import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Container, Form } from 'semantic-ui-react';

import { SelectType } from 'shared/model';
import { alert, AlertModel, confirm, ConfirmModel, PageTitle, SubActions, Loader, Polyglot } from 'shared/components';
import { langSupportCdo, isDefaultPolyglotBlank } from 'shared/components/Polyglot';
import { LoaderService } from 'shared/components/Loader';

import { translationManagementUrl } from 'Routes';
import { CollegeService } from 'college';
import { CardPolyglotUdo, getInitCardPolyglotUdo } from '_data/lecture/cards/model/CardPolyglotUdo';
import { LearningContentType } from 'card/card/model/vo/LearningContentType';
import Discussion from 'discussion/model/Discussion';
import { UserWorkspaceService } from 'userworkspace';

import { CardService } from '../../index';
import CardBasicInfoContainer from './CardBasicInfoContainer';
import CardExposureInfoContainer from './CardExposureInfoContainer';
import CardContentsInfoContainer from './CardContentsInfoContainer';
import CardAdditionalInfoContainer from './CardAdditionalInfoContainer';

interface Params {
  cineroomId: string;
  cardId: string;
}

interface Props extends RouteComponentProps<Params> {}

interface State {
  isUpdatable: boolean;
}

interface Injected {
  cardService: CardService;
  collegeService: CollegeService;
  loaderService: LoaderService;
  userWorkspaceService: UserWorkspaceService;
}

@inject('cardService', 'collegeService', 'loaderService', 'userWorkspaceService')
@observer
@reactAutobind
class CardCreateContainer extends ReactComponent<Props, State, Injected> {
  //
  state: State = {
    isUpdatable: true,
  };

  constructor(props: Props) {
    //
    super(props);

    const { cardId, cineroomId } = this.props.match.params;

    this.init();

    if (cardId) {
      this.findCard(cardId, cineroomId);
    }
  }

  // 공통 init
  async init() {
    this.pageRefresh();
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
    const { cardService } = this.injected;

    await cardService.findCardById(cardId, cineroomId);
  }

  routeToGoBack() {
    //
    this.props.history.goBack();
  }

  routeToCardList() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${translationManagementUrl}/cards/card-list`
    );
  }

  routeToCardDetail(cardId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${translationManagementUrl}/cards/card-detail/${cardId}`
    );
  }

  async onClickSaveCard() {
    //
    this.injected.loaderService.openPageLoader(true);

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
    }
  }

  async onClickModify() {
    //
    const { cardService } = this.injected;
    const cardId = this.props.match.params.cardId;
    const { cardQuery, cardContentsQuery } = cardService;

    try {
      const udo = getInitCardPolyglotUdo();
      udo.cardId = cardId;
      udo.langSupports = langSupportCdo(cardQuery.langSupports);
      udo.name = cardQuery.name; // 카드명
      udo.simpleDescription = cardQuery.simpleDescription; // Card 표시문구
      udo.tags = cardQuery.tags; // Tag 정보
      udo.description = cardContentsQuery.description; // Card 소개
      udo.reportName = cardContentsQuery.reportFileBox.reportName; // 리포트명
      udo.reportQuestion = cardContentsQuery.reportFileBox.reportQuestion; // Write Guide

      await cardService.modifyPolyglotsForAdmin(udo.cardId, udo);

      alert(
        AlertModel.getSaveSuccessAlert(() => {
          this.routeToCardDetail(cardId);
        })
      );
    } catch {
      alert(AlertModel.getCustomAlert(false, '오류', 'Card 수정에 실패하였습니다.', '확인'));
    }
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
    const { cardService } = this.injected;
    const { cardQuery, cardContentsQuery } = cardService;

    if (cardContentsQuery.learningContents) {
      if (isDefaultPolyglotBlank(cardQuery.langSupports, cardQuery.name)) {
        alert(AlertModel.getRequiredInputAlert('Card 명'));
        return false;
      }
    }

    if (isDefaultPolyglotBlank(cardQuery.langSupports, cardQuery.simpleDescription)) {
      alert(AlertModel.getRequiredInputAlert('Card 표시 문구'));
      return false;
    }

    if (isDefaultPolyglotBlank(cardQuery.langSupports, cardContentsQuery.description)) {
      alert(AlertModel.getRequiredInputAlert('Card 소개'));
      return false;
    }
    if (
      cardContentsQuery.reportFileBox &&
      isDefaultPolyglotBlank(cardQuery.langSupports, cardContentsQuery.reportFileBox.reportName)
    ) {
      if (
        cardContentsQuery.reportFileBox.fileBoxId ||
        !isDefaultPolyglotBlank(cardQuery.langSupports, cardContentsQuery.reportFileBox.reportQuestion)
      ) {
        alert(AlertModel.getRequiredInputAlert('Report 명'));
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
      alert(AlertModel.getOverlapAlert(`"카드명"`));
      return false;
    }

    return true;
  }

  render() {
    const { cineroomId, cardId } = this.props.match.params;
    const { cardService, collegeService, userWorkspaceService } = this.injected;

    const { collegesMap, channelMap } = collegeService;

    const userWorkspaces =
      cineroomId === 'ne1-m2-c2'
        ? userWorkspaceService.allUserWorkspaces
        : userWorkspaceService.userWorkspacesByUserWorkspaceId(cineroomId);

    return (
      <>
        <Container fluid>
          <PageTitle breadcrumb={SelectType.translationCardSections} />
          <Polyglot languages={cardService.cardQuery.langSupports}>
            <Form>
              <Loader />
              {/*기본 정보*/}
              <CardBasicInfoContainer isUpdatable cardService={cardService} />

              {/*노출 정보*/}
              <CardExposureInfoContainer
                cardId={cardId}
                isUpdatable
                cineroomId={cineroomId}
                cardService={cardService}
                userWorkspaces={userWorkspaces}
              />

              {/*부가 정보*/}
              <CardContentsInfoContainer
                isUpdatable
                cardService={cardService}
                collegesMap={collegesMap}
                channelMap={channelMap}
              />

              {/*추가 정보*/}
              <CardAdditionalInfoContainer isUpdatable cardService={cardService} />

              <SubActions form>
                <SubActions.Left>
                  {cardId && this.state.isUpdatable && <Button onClick={this.routeToGoBack}>취소</Button>}
                </SubActions.Left>
                <SubActions.Right>
                  <Button onClick={this.routeToCardList}>목록</Button>
                  <Button primary onClick={this.onClickSaveCard}>
                    저장
                  </Button>
                </SubActions.Right>
              </SubActions>
            </Form>
          </Polyglot>
        </Container>
      </>
    );
  }
}

export default CardCreateContainer;
