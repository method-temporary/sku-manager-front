import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CardWithContents } from '../..';

interface Props {
  onSelectCard: (card: CardWithContents, checked: boolean) => void;
  cards: CardWithContents[];
  selectedCards: CardWithContents[];
}

@observer
@reactAutobind
class CardListByCubeModalView extends ReactComponent<Props, {}> {
  //
  render() {
    //
    const { onSelectCard, cards, selectedCards } = this.props;
    return (
      <Table celled>
        <colgroup>
          <col width="5%" />
          <col />
          <col width="15%" />
          <col width="20%" />
          <col width="14%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>선택</Table.HeaderCell>
            <Table.HeaderCell>과정명</Table.HeaderCell>
            {/*<Table.HeaderCell> 접근가능여부 </Table.HeaderCell>*/}
            <Table.HeaderCell>공개여부</Table.HeaderCell>
            <Table.HeaderCell>등록일자</Table.HeaderCell>
            <Table.HeaderCell>생성자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(cards &&
            cards.length !== 0 &&
            cards.map((cardWithContents, idx) => {
              const selected = selectedCards.some((selectedCard) => selectedCard.card.id === cardWithContents.card.id);
              return (
                <Table.Row key={idx} textAlign="center">
                  <Table.Cell>
                    <Form.Field
                      control={Checkbox}
                      checked={selected}
                      onChange={(e: any, data: any) => onSelectCard(cardWithContents, data.checked)}
                    />
                  </Table.Cell>
                  <Table.Cell textAlign="left">{getPolyglotToAnyString(cardWithContents.card.name)}</Table.Cell>
                  {/*<Table.Cell>{booleanToYesNo(accessible)}</Table.Cell>*/}
                  <Table.Cell>{cardWithContents.card.searchable ? 'Yes' : 'No'}</Table.Cell>
                  <Table.Cell>
                    {moment(cardWithContents.cardContents.registeredTime).format('YYYY.MM.DD HH:mm:ss')}
                  </Table.Cell>
                  <Table.Cell>{getPolyglotToAnyString(cardWithContents.cardContents.registrantName)}</Table.Cell>
                </Table.Row>
              );
            })) || (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={5}>
                <div className="no-cont-wrap no-contents-icon">
                  <Icon className="no-contents80" />
                  <div className="sr-only">콘텐츠 없음</div>
                  <div className="text">검색 결과를 찾을 수 없습니다.</div>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );
  }
}

export default CardListByCubeModalView;
