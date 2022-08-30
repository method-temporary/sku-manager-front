import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Container, Form, Tab } from 'semantic-ui-react';
import moment from 'moment';

import { SelectType } from 'shared/model';
import { AccessRuleService } from 'shared/present';
import {
  AccessRuleSettings,
  alert,
  AlertModel,
  confirm,
  ConfirmModel,
  FormTable,
  PageTitle,
  SubActions,
  Polyglot,
} from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { certificationManagementUrl } from '../../../../../Routes';

import { BadgeState } from '_data/badge/badges/model/vo';

import { CardService } from '../../../../../card';
import CardSelectInfoListContainer from '../../../../../card/card/ui/shared/logic/CardSelectInfoListContainer';
import UserWorkspaceService from '../../../../../userworkspace/present/logic/UserWorkspaceService';
import { UserGroupService } from '../../../../../usergroup';
import { BadgeCategoryService } from '../../../category';
import BadgeStudentInformationContainer from '../../../student/ui/logic/BadgeStudentInformationContainer';
import BadgeService from '../../present/logic/BadgeService';
import BadgePreviewModal from './BadgePreviewModal';
import BadgeBasicInfoContainer from './BadgeBasicInfoContainer';
import BadgeAdditionalInfoContainer from './BadgeAdditionalInfoContainer';
import BadgeLearningInfoContainer from './BadgeLearningInfoContainer';
import { findGroupBasedAccessRules, getBadgeCategoryMap, getBadgeStateDisplay } from './BadgeHelper';

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
class BadgeDetailContainer extends ReactComponent<Props, State, Injected> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      isUpdatable: false,
    };
    this.init();
  }

  async init() {
    //
    const { badgeService, accessRuleService, userGroupService } = this.injected;

    // badgeService.clearRelatedBadges();

    if (this.props.match.params.badgeId) {
      //
      await this.findBadge();
      await this.findCardsInfo(badgeService.badge.cardIds);
      await this.findRelatedBadges();
      await findGroupBasedAccessRules(badgeService.badge, accessRuleService, userGroupService);
      await this.injected.cardService.setCards(this.injected.badgeService.badge.cards);
    }
  }

  async findBadge() {
    //
    const { badgeId } = this.props.match.params;
    const { badgeService } = this.injected;

    await badgeService.findBadge(badgeId);
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

  async findCardsInfo(cardIds: string[]) {
    //
    const { cardService, badgeService } = this.injected;

    const cards = await cardService.findCardsForAdminByIds(cardIds);
    badgeService.changeBadgeProp('cards', cards);

    badgeService.setCardRestProp(badgeService.badge.cardIds, badgeService.badge.cards);
  }

  componentWillUnmount() {
    const { badgeService } = this.injected;
    badgeService.clearRelatedBadgeAndCards();
  }

  getOpenedPanes() {
    //
    const { badgeId, cineroomId } = this.props.match.params;
    const { isUpdatable } = this.state;
    const { badgeService, badgeCategoryService, userWorkspaceService } = this.injected;
    const { badge, changeBadgeProp, clearBadgeQuery, badgeOperatorIdentity, changeBadgeOperatorProp } = badgeService;

    const badgeCategoryMap = getBadgeCategoryMap(badgeCategoryService, '');
    const userWorkspaceMap = userWorkspaceService.userWorkspaceMap;

    const menuItems: { menuItem: string; render: () => JSX.Element }[] = [];
    const relatedBadges = badge.relatedBadges;

    menuItems.push({
      menuItem: 'Badge 정보',
      render: () => (
        <Tab.Pane attached={false}>
          <div className="content">
            <Form>
              <Polyglot languages={badge.langSupports}>
                {/*생성 정보*/}
                <FormTable title="생성 정보">
                  <FormTable.Row name="생성 정보">
                    {getPolyglotToAnyString(badge.registrantName)} |{' '}
                    {moment(badge.registeredTime).format('YYYY.MM.DD HH:mm')}
                  </FormTable.Row>
                  <FormTable.Row name="승인 정보">
                    {getBadgeStateDisplay(badge.state)}
                    {' | '}
                    {badge.state === BadgeState.Created
                      ? badge.openRequest && moment(badge.registeredTime).format('YYYY.MM.DD HH:mm')
                      : null}
                    {badge.state === BadgeState.Opened ? (
                      <span>{moment(badge.openRequest.response.time).format('YYYY.MM.DD HH:mm')}</span>
                    ) : null}
                    {badge.state === BadgeState.Rejected ? (
                      <>
                        <p />
                        <div
                          dangerouslySetInnerHTML={{
                            __html: badge.openRequest.response.remark,
                          }}
                        />
                      </>
                    ) : null}
                  </FormTable.Row>
                </FormTable>

                {/*기본 정보*/}
                <BadgeBasicInfoContainer
                  isUpdatable={isUpdatable}
                  badge={badge}
                  changeBadgeQueryProp={changeBadgeProp}
                  clearBadgeQuery={clearBadgeQuery}
                  badgeCategoryMap={badgeCategoryMap}
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

                <CardSelectInfoListContainer isUpdatable={isUpdatable} callType="Badge" />

                {/*연관 뱃지 정보*/}
                <BadgeLearningInfoContainer
                  isUpdatable={isUpdatable}
                  badge={badge}
                  relatedBadges={relatedBadges}
                  userWorkspaceMap={userWorkspaceMap}
                  badgeCategoryMap={badgeCategoryMap}
                  changeBadgeProp={changeBadgeProp}
                />

                <SubActions form>
                  <SubActions.Left>
                    {badgeService.creatorCineroomId === cineroomId && (
                      <Button onClick={this.routeToBadgeModified} primary>
                        수정
                      </Button>
                    )}
                  </SubActions.Left>
                  <SubActions.Right>
                    <Button onClick={this.routeToBadgeList}>목록</Button>
                    {badgeId && <BadgePreviewModal badgeId={badgeId} />}
                    {badgeId &&
                      badge.state !== BadgeState.Opened &&
                      badge.state !== BadgeState.OpenApproval &&
                      !this.state.isUpdatable && (
                        <Button primary onClick={this.onClickRequestApproval}>
                          승인요청
                        </Button>
                      )}
                  </SubActions.Right>
                </SubActions>
              </Polyglot>
            </Form>
          </div>
        </Tab.Pane>
      ),
    });

    if (badge.state === BadgeState.Opened && badgeService.creatorCineroomId === cineroomId) {
      //
      menuItems.push({
        menuItem: '학습자 관리',
        render: () => (
          <>
            <p className="tab-text">{getPolyglotToAnyString(badge.name)}</p>
            <Tab.Pane attached={false}>
              <BadgeStudentInformationContainer
                badgeId={this.props.match.params.badgeId}
                totalCardCount={badge.cardIds ? badge.cardIds.length : 0}
              />
            </Tab.Pane>
          </>
        ),
      });
    }

    return menuItems;
  }

  onClickRequestApproval() {
    //
    confirm(ConfirmModel.getRequestApprovalConfirm(this.getRequestApprovalSuccessAlert), false);
  }

  async getRequestApprovalSuccessAlert() {
    //
    const { badgeService } = this.injected;

    const { badge, modifiedBadgeApproval } = badgeService;

    await modifiedBadgeApproval(badge.id);

    alert(AlertModel.getOpenApprovalSuccessAlert(() => this.routeToBadgeDetail()));
  }

  routeToBadgeModified() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${certificationManagementUrl}/badges/badge-modify/${this.props.match.params.badgeId}`
    );
  }

  routeToBadgeList() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${certificationManagementUrl}/badges/badge-list`
    );
  }

  routeToBadgeDetail() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${certificationManagementUrl}/badges/badge-detail/${this.props.match.params.badgeId}`
    );
  }

  render() {
    //
    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.badgeSections} />

        <Tab panes={this.getOpenedPanes()} menu={{ secondary: true, pointing: true }} className="styled-tab tab-wrap" />
      </Container>
    );
  }
}

export default BadgeDetailContainer;
