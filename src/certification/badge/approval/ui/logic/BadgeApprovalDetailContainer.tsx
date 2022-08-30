import React from 'react';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Accordion, Button, Container, Form, Icon, Segment } from 'semantic-ui-react';
import moment from 'moment';

import { SelectType } from 'shared/model';
import {
  AccessRuleSettings,
  alert,
  AlertModel,
  confirm,
  ConfirmModel,
  FormTable,
  SubActions,
  Polyglot,
  RejectEmailModal,
} from 'shared/components';
import { AccessRuleService } from 'shared/present';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { BadgeState } from '_data/badge/badges/model/vo';

import { CardService } from 'card';
import CardSelectInfoListContainer from 'card/card/ui/shared/logic/CardSelectInfoListContainer';
import { UserGroupService } from 'usergroup';
import UserWorkspaceService from 'userworkspace/present/logic/UserWorkspaceService';

import { certificationManagementUrl } from '../../../../../Routes';
import { BadgeApprovalService, BadgeService } from '../../../../index';
import { BadgeCategoryService } from '../../../category';
import { findGroupBasedAccessRules, getBadgeStateDisplay } from '../../../badge/ui/logic/BadgeHelper';
import BadgeLearningInfoContainer from '../../../badge/ui/logic/BadgeLearningInfoContainer';
import BadgeBasicInfoContainer from '../../../badge/ui/logic/BadgeBasicInfoContainer';
import BadgeAdditionalInfoContainer from '../../../badge/ui/logic/BadgeAdditionalInfoContainer';

interface Params {
  cineroomId: string;
  badgeId: string;
}

interface Props extends RouteComponentProps<Params> {}

interface States {
  activeIndex: number;
}

interface Injected {
  badgeService: BadgeService;
  badgeApprovalService: BadgeApprovalService;
  badgeCategoryService: BadgeCategoryService;
  accessRuleService: AccessRuleService;
  userGroupService: UserGroupService;
  cardService: CardService;
  userWorkspaceService: UserWorkspaceService;
}

@inject(
  'badgeService',
  'badgeApprovalService',
  'badgeCategoryService',
  'accessRuleService',
  'userGroupService',
  'cardService',
  'userWorkspaceService'
)
@observer
@reactAutobind
class BadgeApprovalDetailContainer extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
    this.init();
  }

  async init() {
    //
    const { badgeId } = this.props.match.params;
    const { badgeService, badgeApprovalService, accessRuleService, userGroupService, cardService } = this.injected;

    const badge = await badgeService.findBadge(badgeId);

    await findGroupBasedAccessRules(badgeService.badge, accessRuleService, userGroupService);
    await this.findRelatedBadges();
    const cards = await cardService.findCardsForAdminByIds(badge.cardIds);
    await badgeService.changeBadgeProp('cards', cards);
    await this.injected.cardService.setCards(cards);

    badgeApprovalService.clearBadgeApprovalUdo();
  }

  onClickAccordion = (e: any, titleProps: any) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  async findRelatedBadges() {
    //
    const { badgeService } = this.injected;
    const { badge } = badgeService;

    if (badge.relatedBadgeIds && badge.relatedBadgeIds.length > 0) {
      const relatedBadges = await badgeService.findRelatedBadges(badge.relatedBadgeIds);
      badgeService.changeBadgeProp('relatedBadges', relatedBadges);
    }
  }

  async onRejectClick() {
    //
    const { badgeApprovalService } = this.injected;
    const { badgeId } = this.props.match.params;

    badgeApprovalService.addSelectedBadgeApproval(badgeId);

    await badgeApprovalService.modifyAllBadgesStatesRejected();

    this.routToBadgeApprovalDetail(badgeId);
  }

  onApprovalClick() {
    //
    confirm(ConfirmModel.getApprovalBadgeConfirm(this.approvalSuccessAlert), false);
  }

  async approvalSuccessAlert() {
    //
    const { badgeApprovalService } = this.injected;
    const { badgeId } = this.props.match.params;

    badgeApprovalService.addSelectedBadgeApproval(badgeId);

    await badgeApprovalService.modifyAllBadgeStatesOpened();

    alert(
      AlertModel.getApprovalSuccessAlert(() => {
        //
        this.routToBadgeApprovalDetail(badgeId);
      })
    );
  }

  routToBadgeApprovalDetail(badgeId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${certificationManagementUrl}/badge-approval/approval-detail/${badgeId}`
    );
  }

  render() {
    //
    const { badgeService, badgeCategoryService, userWorkspaceService, badgeApprovalService } = this.injected;
    const { setSelectedBadgeApproval } = badgeApprovalService;
    const { activeIndex } = this.state;

    const { badge, badgeOperatorIdentity, changeBadgeOperatorProp } = badgeService;
    const badgeCategoryMap = badgeCategoryService.badgeCategoryMap;
    const userWorkspaceMap = userWorkspaceService.userWorkspaceMap;

    const operatorName = getPolyglotToAnyString(badgeOperatorIdentity.name);

    return (
      <Container>
        <Form>
          <Polyglot languages={badge.langSupports}>
            {/*생성 정보*/}
            <FormTable title="생성 정보">
              <FormTable.Row name="생성 정보">
                {getPolyglotToAnyString(badge.registrantName)} |{' '}
                {moment(badge.registeredTime).format('YYYY.MM.DD HH:mm')}
              </FormTable.Row>
              <FormTable.Row name="승인 정보">
                <SubActions>
                  {getBadgeStateDisplay(badge.state)}
                  {badge.state === BadgeState.OpenApproval
                    ? ` | ${moment(badge.openRequest.time).format('YYYY.MM.DD HH:mm')} `
                    : ` | ${moment(badge.openRequest.response.time).format('YYYY.MM.DD HH:mm')} 
                        | ${getPolyglotToAnyString(badge.openRequest.response.approverName)} `}
                  {badge.state === BadgeState.OpenApproval && (
                    <>
                      <RejectEmailModal
                        onShow={() => true}
                        onClickReject={this.onRejectClick}
                        onChangeRemark={(name, value) => setSelectedBadgeApproval(name, value)}
                        type={SelectType.mailOptions[5].value}
                        cubeTitles={[getPolyglotToAnyString(badge.name)]} // 제목
                        emailList={[badgeOperatorIdentity.email]}
                        nameList={[operatorName]}
                        isApprovalRoleOwner
                      />
                      <Button primary onClick={this.onApprovalClick}>
                        승인
                      </Button>
                    </>
                  )}
                </SubActions>
              </FormTable.Row>
            </FormTable>

            <Accordion fluid>
              {/*기본 정보*/}
              <Accordion.Title active={activeIndex === 1} index={1} onClick={this.onClickAccordion}>
                <Segment>
                  <Icon name="dropdown" />
                  기본 정보
                </Segment>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 1}>
                <BadgeBasicInfoContainer
                  isUpdatable={false}
                  badge={badge}
                  badgeCategoryMap={badgeCategoryMap}
                  changeBadgeQueryProp={() => {}}
                  clearBadgeQuery={() => {}}
                />
              </Accordion.Content>

              {/*부가 정보*/}
              <Accordion.Title active={activeIndex === 2} index={2} onClick={this.onClickAccordion}>
                <Segment>
                  <Icon name="dropdown" />
                  부가 정보
                </Segment>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 2}>
                <BadgeAdditionalInfoContainer
                  isUpdatable={false}
                  badge={badge}
                  changeBadgeQueryProp={() => {}}
                  badgeOperatorIdentity={badgeOperatorIdentity}
                  changeBadgeOperatorProp={changeBadgeOperatorProp}
                />
              </Accordion.Content>

              {/*접근 제어*/}
              <Accordion.Title active={activeIndex === 3} index={3} onClick={this.onClickAccordion}>
                <Segment>
                  <Icon name="dropdown" />
                  접근 제어 정보
                </Segment>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 3}>
                <AccessRuleSettings readOnly multiple={false} />
              </Accordion.Content>

              {/*카드 정보*/}
              <Accordion.Title active={activeIndex === 4} index={4} onClick={this.onClickAccordion}>
                <Segment>
                  <Icon name="dropdown" />
                  Card 정보
                </Segment>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 4}>
                <CardSelectInfoListContainer isUpdatable={false} callType="Badge" />
              </Accordion.Content>

              {/*뱃지 정보*/}
              <Accordion.Title active={activeIndex === 5} index={5} onClick={this.onClickAccordion}>
                <Segment>
                  <Icon name="dropdown" />
                  연관 뱃지 정보
                </Segment>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 5}>
                <BadgeLearningInfoContainer
                  badge={badge}
                  changeBadgeProp={() => {}}
                  relatedBadges={badge.relatedBadges}
                  badgeCategoryMap={badgeCategoryMap}
                  userWorkspaceMap={userWorkspaceMap}
                />
              </Accordion.Content>
            </Accordion>
          </Polyglot>
        </Form>
      </Container>
    );
  }
}

export default withRouter(BadgeApprovalDetailContainer);
