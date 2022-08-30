import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Button, Container, Form } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { GroupBasedAccessRuleModel, SelectType, GroupBasedAccessRule } from 'shared/model';
import {
  AccessRuleSettings,
  alert,
  AlertModel,
  confirm,
  ConfirmModel,
  PageTitle,
  SubActions,
  Polyglot,
} from 'shared/components';
import { AccessRuleService } from 'shared/present';
import { isDefaultPolyglotBlank } from 'shared/components/Polyglot';

import { certificationManagementUrl } from '../../../../../Routes';

import { UserGroupService } from 'usergroup';
import { CardService, CardWithContents } from 'card';
import CardSelectInfoListContainer from 'card/card/ui/shared/logic/CardSelectInfoListContainer';
import { UserWorkspaceService } from 'userworkspace';

import { BadgeCategoryService } from '../../../category';
import BadgeService from '../../present/logic/BadgeService';
import { findGroupBasedAccessRules, getBadgeCategoryMap } from './BadgeHelper';
import BadgePreviewModal from './BadgePreviewModal';
import BadgeBasicInfoContainer from './BadgeBasicInfoContainer';
import BadgeAdditionalInfoContainer from './BadgeAdditionalInfoContainer';
import BadgeLearningInfoContainer from './BadgeLearningInfoContainer';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
  badgeId: string;
}

interface State {
  isUpdatable: boolean;
}

interface Injected {
  badgeService: BadgeService;
  accessRuleService: AccessRuleService;
  userGroupService: UserGroupService;
  badgeCategoryService: BadgeCategoryService;
  cardService: CardService;
  userWorkspaceService: UserWorkspaceService;
}

@inject(
  'badgeService',
  'accessRuleService',
  'userGroupService',
  'badgeCategoryService',
  'cardService',
  'userWorkspaceService'
)
@observer
@reactAutobind
class BadgeCreateContainer extends ReactComponent<Props, State, Injected> {
  //

  constructor(props: Props) {
    super(props);
    this.state = {
      isUpdatable: true,
    };
    this.init();
  }

  async init() {
    //
    const { badgeId } = this.props.match.params;
    const { badgeService, accessRuleService, userGroupService, cardService } = this.injected;

    // badgeService.clearRelatedBadges();
    badgeService.clearCategory();
    badgeService.clearBadgeOperatorProp();
    cardService.clearModalCardQuery();

    if (this.props.match.params.badgeId) {
      //
      await badgeService.findBadge(badgeId);
      await this.findRelatedBadges();
      await findGroupBasedAccessRules(badgeService.badge, accessRuleService, userGroupService);
      await this.findCardsInfo(badgeService.badge.cardIds);
      await this.injected.cardService.setCards(badgeService.badge.cards);
    } else {
      cardService.clearCards();
    }
  }

  async findCardsInfo(cardIds: string[]) {
    //
    const { cardService, badgeService } = this.injected;

    const cards = await cardService.findCardsForAdminByIds(cardIds);
    badgeService.changeBadgeProp('cards', cards);

    badgeService.setCardRestProp(badgeService.badge.cardIds, badgeService.badge.cards);
  }

  async findRelatedBadges() {
    //
    const { badgeService } = this.injected;
    const { badge } = badgeService;

    if (badge.relatedBadgeIds && badge.relatedBadgeIds.length > 0) {
      const relatedBadges = await badgeService.findRelatedBadges(badge.relatedBadgeIds);
      badgeService.changeBadgeProp('relatedBadges', relatedBadges);
    }
  }

  async onClickSaveBadge() {
    //
    const { badgeService, accessRuleService, cardService } = this.injected;

    const cardIds: string[] = [];
    const cards: CardWithContents[] = [];

    cardService.cards.forEach((cardWiths) => {
      cardIds.push(cardWiths.card.id);
      cards.push(cardWiths);
    });

    badgeService.changeBadgeProp('cardIds', cardIds);
    badgeService.changeBadgeProp('cards', cards);

    if (!this.validationCheck()) {
      badgeService.changeBadgeProp('cardIds', []);
      badgeService.changeBadgeProp('cards', []);
      return;
    }

    badgeService.changeBadgeProp(
      'groupBasedAccessRule',
      GroupBasedAccessRuleModel.asGroupBasedAccessRule(accessRuleService.groupBasedAccessRule)
    );

    let badgeId: string = '';

    if (this.props.match.params.badgeId) {
      //
      badgeId = this.props.match.params.badgeId;

      await confirm(
        ConfirmModel.getSaveConfirm(() => {
          this.onClickSave(badgeId);
        }),
        false
      );
    } else {
      //
      await confirm(ConfirmModel.getSaveAndApprovalConfirm(this.onClickSaveAndApproval, this.onClickSave), false);
    }
  }

  async onClickSave(badgeId?: string) {
    //
    const { badgeService } = this.injected;

    if (badgeId) {
      await badgeService.modifiedBadge(this.props.match.params.badgeId, badgeService.badge);
    } else {
      badgeId = await badgeService.registerBadge(badgeService.badge);
    }

    await alert(
      AlertModel.getSaveSuccessAlert(() => {
        if (badgeId) {
          this.routeToBadgeDetail(badgeId);
        } else {
          this.routeToBadgeList();
        }
      })
    );
  }

  async onClickSaveAndApproval() {
    //
    const { badgeService } = this.injected;

    await badgeService.setBadgeRequestApproval(true);
    await this.onClickSave();
  }

  async onClickApproval() {
    //
    const { badgeService } = this.injected;

    const { badge, modifiedBadgeApproval } = badgeService;

    await modifiedBadgeApproval(badge.id);
  }

  validationCheck() {
    //
    const { accessRuleService } = this.injected;
    const { badge, badgeMainCategory } = this.injected.badgeService;

    if (isDefaultPolyglotBlank(badge.langSupports, badge.name)) {
      alert(AlertModel.getRequiredInputAlert('Badge명'));
      return false;
    }

    if (badge.forSelectedMember === undefined) {
      alert(AlertModel.getRequiredChoiceAlert('HR 선발형'));
      return false;
    }

    if (badge.type === '') {
      alert(AlertModel.getRequiredChoiceAlert('유형'));
      return false;
    }

    if (badgeMainCategory.categoryId === '') {
      alert(AlertModel.getRequiredChoiceAlert('Main 분야'));
      return false;
    }

    if (badge.level === '') {
      alert(AlertModel.getRequiredChoiceAlert('Level'));
      return false;
    }

    if (badge.iconUrl === '') {
      alert(AlertModel.getRequiredInputAlert('아이콘'));
      return false;
    }

    if (isDefaultPolyglotBlank(badge.langSupports, badge.qualification)) {
      alert(AlertModel.getRequiredInputAlert('자격증명'));
      return false;
    }

    if (isDefaultPolyglotBlank(badge.langSupports, badge.acquisitionRequirements)) {
      alert(AlertModel.getRequiredInputAlert('획득조건'));
      return false;
    }

    if (badge.operator.keyString === '') {
      alert(AlertModel.getRequiredChoiceAlert('담당자'));
      return false;
    }

    if (accessRuleService.groupBasedAccessRule.accessRules.length === 0) {
      alert(AlertModel.getRequiredChoiceAlert('접근 제어 정보'));
      return false;
    }

    if (badge.cardIds.length === 0) {
      alert(AlertModel.getRequiredChoiceAlert('학습구성'));
      return false;
    }

    if (badge.collegeId === '') {
      alert(AlertModel.getRequiredChoiceAlert('설계주체'));
      return false;
    }

    const groupBasedAccessRule = accessRuleService.groupBasedAccessRule;

    for (const cardWiths of badge.cards) {
      if (
        !GroupBasedAccessRuleModel.asRuleModelForRule(cardWiths.card.groupBasedAccessRule).isAccessible(
          new GroupBasedAccessRule(cardWiths.card.groupBasedAccessRule),
          groupBasedAccessRule
        )
      ) {
        alert(AlertModel.getCustomAlert(true, '접근권한', '접근권한이 없는 카드가 존재합니다', '확인'));
        return false;
      }
    }

    return true;
  }

  routeToBadgeList() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${certificationManagementUrl}/badges/badge-list`
    );
  }

  routeToGoBack() {
    //
    this.props.history.goBack();
  }

  routeToBadgeDetail(badgeId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${certificationManagementUrl}/badges/badge-detail/${badgeId}`
    );
  }

  componentWillUnmount() {
    //
    const { badgeService } = this.injected;

    badgeService.clearBadgeQuery();
    badgeService.clearBadgeOperatorProp();
    badgeService.clearRelatedBadgeAndCards();
  }

  onClickResetCardSelected() {
    //
    const { badgeCardsReset } = this.injected.badgeService;
    const { setCards } = this.injected.cardService;

    setCards([...badgeCardsReset]);
  }

  render() {
    //
    const { isUpdatable } = this.state;
    const { badgeId, cineroomId } = this.props.match.params;
    const { badgeService, badgeCategoryService, userWorkspaceService } = this.injected;

    const { badge, changeBadgeProp, clearBadgeQuery, badgeOperatorIdentity, changeBadgeOperatorProp } = badgeService;

    const badgeCategoryMap = getBadgeCategoryMap(badgeCategoryService, cineroomId);
    const userWorkspaceMap = userWorkspaceService.userWorkspaceMap;

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.badgeSections} />
        <div className="content">
          <Form>
            <Polyglot languages={badge.langSupports}>
              {/*기본 정보*/}
              <BadgeBasicInfoContainer
                isUpdatable={isUpdatable}
                badge={badge}
                changeBadgeQueryProp={changeBadgeProp}
                clearBadgeQuery={clearBadgeQuery}
                badgeCategoryMap={badgeCategoryMap}
                creatorCineroomId={badgeService.creatorCineroomId}
              />

              {/*부가 정보*/}
              <BadgeAdditionalInfoContainer
                isUpdatable={isUpdatable}
                badge={badge}
                changeBadgeQueryProp={changeBadgeProp}
                badgeOperatorIdentity={badgeOperatorIdentity}
                changeBadgeOperatorProp={changeBadgeOperatorProp}
              />

              {/*접근 제어*/}
              <AccessRuleSettings readOnly={!isUpdatable} multiple={false} />

              <CardSelectInfoListContainer
                isUpdatable={isUpdatable}
                callType="Badge"
                onClickResetCardSelected={this.onClickResetCardSelected}
              />

              {/*연관 뱃지 정보*/}
              <BadgeLearningInfoContainer
                isUpdatable={isUpdatable}
                badge={badge}
                relatedBadges={badge.relatedBadges}
                userWorkspaceMap={userWorkspaceMap}
                badgeCategoryMap={badgeCategoryMap}
                changeBadgeProp={changeBadgeProp}
              />

              <SubActions form>
                <SubActions.Left>
                  {badgeId && this.state.isUpdatable && <Button onClick={this.routeToGoBack}>취소</Button>}
                </SubActions.Left>
                <SubActions.Right>
                  <Button onClick={this.routeToBadgeList}>목록</Button>
                  {badgeId && badge.state !== 'Opened' && !this.state.isUpdatable && (
                    <Button primary onClick={this.onClickApproval}>
                      승인요청
                    </Button>
                  )}
                  <Button primary onClick={this.onClickSaveBadge}>
                    저장
                  </Button>
                </SubActions.Right>
              </SubActions>
            </Polyglot>
          </Form>
        </div>
      </Container>
    );
  }
}

export default BadgeCreateContainer;
