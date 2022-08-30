import * as React from 'react';
import { observer } from 'mobx-react';
import { Button, Icon, Table, Form, Checkbox } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { GroupBasedAccessRuleModel } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CardModel, CardWithContents } from '../../../card';

interface Props {
  changeCardSequence: (card: CardWithContents, oldSeq: number, newSeq: number) => void;
  changeTargetCardProp: (index: number, name: string, value: any) => void;
  cards: CardWithContents[];
  groupBasedAccessRule: GroupBasedAccessRuleModel;
  isUpdatable: boolean;
  displayChannel: (card: CardModel) => string;
}

@observer
@reactAutobind
class CardListView extends ReactComponent<Props> {
  //
  render() {
    //
    const { changeCardSequence, changeTargetCardProp, cards, groupBasedAccessRule, isUpdatable, displayChannel } =
      this.props;
    return (
      <>
        <Table celled>
          <colgroup>
            <col width="2%" />
            <col width="9%" />
            <col width="5%" />
            <col />
            <col width="20%" />
            <col width="15%" />
            <col width="12%" />
            <col width="12%" />
          </colgroup>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell className="title-header" />
              <Table.HeaderCell className="title-header">순서변경</Table.HeaderCell>
              <Table.HeaderCell className="title-header">순서</Table.HeaderCell>
              <Table.HeaderCell className="title-header">Card명</Table.HeaderCell>
              <Table.HeaderCell className="title-header">채널</Table.HeaderCell>
              <Table.HeaderCell className="title-header">학습시간/Stamp</Table.HeaderCell>
              <Table.HeaderCell className="title-header">승인일시</Table.HeaderCell>
              <Table.HeaderCell className="title-header">접근가능여부</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(cards &&
              cards.length !== 0 &&
              cards.map((cardWithContents, index) => {
                return (
                  <Table.Row textAlign="center" key={cardWithContents.card.id}>
                    <Table.Cell>
                      <Form.Field
                        disabled={!isUpdatable}
                        control={Checkbox}
                        checked={cardWithContents.card.selected}
                        onChange={(e: any, data: any) => changeTargetCardProp(index, 'card.selected', data.checked)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        icon
                        size="mini"
                        basic
                        disabled={!isUpdatable || index === cards.length - 1}
                        onClick={() => changeCardSequence(cardWithContents, index, index + 1)}
                      >
                        <Icon name="angle down" />
                      </Button>
                      <Button
                        icon
                        size="mini"
                        basic
                        disabled={!isUpdatable || index === 0}
                        onClick={() => changeCardSequence(cardWithContents, index, index - 1)}
                      >
                        <Icon name="angle up" />
                      </Button>
                    </Table.Cell>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell textAlign="left">{getPolyglotToAnyString(cardWithContents.card.name)}</Table.Cell>
                    <Table.Cell>{displayChannel(cardWithContents.card)}</Table.Cell>
                    <Table.Cell>{`${cardWithContents.card.learningTime} / ${cardWithContents.card.stampCount}`}</Table.Cell>
                    <Table.Cell>
                      {moment(cardWithContents.card.cardStateModifiedTime).format('YYYY. MM. DD HH:mm:ss')}
                    </Table.Cell>
                    <Table.Cell>
                      {`${groupBasedAccessRule.isAccessible(cardWithContents.card.groupBasedAccessRule)}`
                        ? 'Yes'
                        : 'No'}
                    </Table.Cell>
                  </Table.Row>
                );
              })) || (
              <Table.Row>
                <Table.Cell textAlign="center" colSpan={8}>
                  <div className="no-cont-wrap no-contents-icon">
                    <Icon className="no-contents80" />
                    <div className="sr-only">콘텐츠 없음</div>
                    <div className="text">등록된 카드가 없습니다.</div>
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </>
    );
  }
}

export default CardListView;
