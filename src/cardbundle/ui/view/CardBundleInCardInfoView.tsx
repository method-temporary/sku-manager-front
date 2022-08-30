import * as React from 'react';
import { observer } from 'mobx-react';
import { Button, Table, Form, Input } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { GroupBasedAccessRuleModel } from 'shared/model';
import { SubActions } from 'shared/components';

import { CardBundleModel } from '_data/arrange/cardBundles/model';
import { CardBundleType } from '_data/arrange/cardBundles/model/vo';

import { CardSelectModal } from 'card/card';
import { CardModel, CardWithContents, CardQueryModel } from 'card';
import CardListView from './CardListView';

interface Props {
  findCardByIds: () => void;
  findLastNApproved: () => void;
  findTopNStudentPassedCardsByLastDay: () => void;
  changeCardQueryProps: (name: string, value: number) => void;
  changeCardSequence: (card: CardWithContents, oldSeq: number, newSeq: number) => void;
  changeTargetCardProp: (index: number, name: string, value: any) => void;
  removeCardInCardBundle: () => void;
  displayChannel: (card: CardModel) => string;

  cardBundle: CardBundleModel;
  cards: CardWithContents[];
  cardQuery: CardQueryModel;
  groupBasedAccessRule: GroupBasedAccessRuleModel;
  isUpdatable: boolean;
}

@observer
@reactAutobind
class CardBundleInCardInfoView extends ReactComponent<Props> {
  //
  optionsButtonRenderer(): React.ReactNode {
    //
    const { type } = this.props.cardBundle;
    const { cardQuery, changeCardQueryProps, isUpdatable } = this.props;

    if (type === CardBundleType.New) {
      return (
        <>
          <Form.Field
            onChange={(e: any) => changeCardQueryProps('count', e.target.value)}
            control={Input}
            value={(cardQuery && cardQuery.count) || 0}
            disabled={!isUpdatable}
          />
          <Form.Field> 개 </Form.Field>
          <Button primary disabled={!isUpdatable} onClick={this.props.findLastNApproved}>
            최근 승인 카드 불러오기
          </Button>
        </>
      );
    } else if (type === CardBundleType.Popular) {
      return (
        <>
          <Form.Field
            onChange={(e: any) => changeCardQueryProps('lastN', e.target.value)}
            control={Input}
            value={(cardQuery && cardQuery.lastN) || 0}
            disabled={!isUpdatable}
          />
          <Form.Field> 일 기준 최다이수자 </Form.Field>
          <Form.Button primary disabled={!isUpdatable} onClick={this.props.findTopNStudentPassedCardsByLastDay}>
            카드 불러오기
          </Form.Button>
        </>
      );
    } else {
      return null;
    }
  }

  render() {
    //
    const {
      changeCardSequence,
      changeTargetCardProp,
      removeCardInCardBundle,
      displayChannel,
      cards,
      findCardByIds,
      groupBasedAccessRule,
      isUpdatable,
    } = this.props;
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
              <SubActions form>
                <SubActions.Right>
                  <Form.Group>
                    {this.optionsButtonRenderer()}
                    <Form.Button primary disabled={!isUpdatable} onClick={removeCardInCardBundle}>
                      삭제
                    </Form.Button>
                    <Form.Button primary disabled={!isUpdatable} onClick={findCardByIds}>
                      초기화
                    </Form.Button>
                    <CardSelectModal readonly={!isUpdatable} selectedCards={cards} />
                  </Form.Group>
                </SubActions.Right>
              </SubActions>
              <CardListView
                changeCardSequence={changeCardSequence}
                changeTargetCardProp={changeTargetCardProp}
                cards={cards}
                groupBasedAccessRule={groupBasedAccessRule}
                isUpdatable={isUpdatable}
                displayChannel={displayChannel}
              />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default CardBundleInCardInfoView;
