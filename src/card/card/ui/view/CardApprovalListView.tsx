import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { CardCategory } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { cardStateDisplay } from '../logic/CardHelper';
import { CardWithContents } from '../../model/CardWithContents';

interface Props {
  cards: CardWithContents[];
  startNo: number;
  displayChannel: (categories: CardCategory[]) => string;
  routeToDetail: (cardId: string) => void;
}

class CardApprovalListView extends React.Component<Props> {
  //
  render() {
    //
    const { cards, startNo, displayChannel, routeToDetail } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="30%" />
          <col width="20%" />
          <col width="15%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>카드명</Table.HeaderCell>
            <Table.HeaderCell>Channel</Table.HeaderCell>
            <Table.HeaderCell>승인요청일자</Table.HeaderCell>
            <Table.HeaderCell>생성자</Table.HeaderCell>
            <Table.HeaderCell>제공상태</Table.HeaderCell>
            <Table.HeaderCell>공개여부</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {cards && cards.length ? (
            cards.map(({ card, cardContents }, index: number) => (
              <Table.Row textAlign="center" key={card.id} onClick={() => routeToDetail(card.id)}>
                <Table.Cell>{startNo - index}</Table.Cell>
                <Table.Cell textAlign="left">{getPolyglotToAnyString(card.name)}</Table.Cell>
                <Table.Cell>{displayChannel(card.categories)}</Table.Cell>
                <Table.Cell>{moment(card.cardStateModifiedTime).format('YYYY.MM.DD HH:mm:ss')}</Table.Cell>
                <Table.Cell>{getPolyglotToAnyString(cardContents.registrantName)}</Table.Cell>
                <Table.Cell>{cardStateDisplay(card.cardState)}</Table.Cell>
                <Table.Cell>{card.searchable ? 'Yes' : 'No'}</Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={7}>
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

export default CardApprovalListView;
