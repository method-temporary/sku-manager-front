import React from 'react';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Table, Form } from 'semantic-ui-react';
import { SubActions } from 'shared/components';
import { AccessRuleService } from 'shared/present';
import { CardSelectModal } from 'card/card';
import { CardWithContents } from 'card';
import { CollegeService } from 'college';
import { CardBundleService } from 'cardbundle';
import CardService from '../../../present/logic/CardService';
import { BadgeService } from '../../../../../certification';
import { UserGroupService } from '../../../../../usergroup';
import { CardSelectInfoList } from '../view/CardSelectInfoList';

interface Props {
  // 공통
  isUpdatable: boolean;
  callType: 'Badge' | 'CardBundle';
  onClickResetCardSelected?: () => void;

  // CardBundle
  optionsButtons?: () => React.ReactNode;
}

interface Injected {
  cardService: CardService;
  collegeService: CollegeService;
  badgeService: BadgeService;
  cardBundleService: CardBundleService;
  accessRuleService: AccessRuleService;
  userGroupService: UserGroupService;
}

@inject('collegeService', 'cardService', 'badgeService', 'cardBundleService', 'accessRuleService', 'userGroupService')
@observer
@reactAutobind
class CardSelectInfoListContainer extends ReactComponent<Props, {}, Injected> {
  //
  componentDidMount() {
    this.init();
  }

  async init() {
    //
    await this.injected.userGroupService.findUserGroupMap();
  }

  getCardsLearningTime() {
    //
    const { cardService } = this.injected;
    const { cards } = cardService;
    const learningTime = cards.reduce((acc, cur) => acc + cur.card.learningTime, 0);
    const totalLearningTime = cards.reduce(
      (acc, cur) => acc + cur.card.learningTime + cur.card.additionalLearningTime,
      0
    );

    if (this.props.callType === 'Badge') {
      const { badgeService } = this.injected;
      badgeService.changeBadgeProp('learningTime', totalLearningTime);

      return totalLearningTime;
    } else if (this.props.callType === 'CardBundle') {
      const { cardBundleService } = this.injected;
      cardBundleService.changeCardBundleFormProps('learningTime', learningTime);

      return learningTime;
    }

    return -1;
  }

  onClickInitializeCards() {
    //
    const { cardsApprovals } = this.injected.cardService;
    const { initializeCards } = this.injected.cardService;

    initializeCards([...cardsApprovals]);
  }

  onClickCardDelete(index: number) {
    //
    const { cardService } = this.injected;
    const copiedCards = [...cardService.cards];

    copiedCards.splice(index, 1);
    cardService.setCards([...copiedCards]);
  }

  onClickCardSorting(card: CardWithContents, oldSeq: number, newSeq: number) {
    //
    const { cardService } = this.injected;
    cardService.changeCardSequence(card, oldSeq, newSeq);
  }

  render() {
    //
    const { isUpdatable, optionsButtons, callType } = this.props;
    const { cardService, accessRuleService, userGroupService } = this.injected;
    const { cards } = cardService;
    const { groupBasedAccessRule } = accessRuleService;
    const userGroupMap = userGroupService.userGroupMap;

    return (
      <Table title="Card 정보">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="title-header">Card 정보</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              {isUpdatable && (
                <SubActions form>
                  <SubActions.Right>
                    <Form.Group>
                      <>
                        {optionsButtons && optionsButtons()}
                        <Form.Button primary disabled={!isUpdatable} onClick={this.onClickInitializeCards}>
                          초기화
                        </Form.Button>
                        <CardSelectModal readonly={!isUpdatable} selectedCards={cards} />
                      </>
                    </Form.Group>
                  </SubActions.Right>
                </SubActions>
              )}
              <CardSelectInfoList
                isUpdatable={isUpdatable}
                cards={cards}
                callType={callType}
                onClickCardDelete={this.onClickCardDelete}
                onClickCardSorting={this.onClickCardSorting}
                learningTime={this.getCardsLearningTime()}
                groupBasedAccessRule={groupBasedAccessRule}
                userGroupMap={userGroupMap}
              />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default CardSelectInfoListContainer;
