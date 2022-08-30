import * as React from 'react';
import { observer } from 'mobx-react';
import { Icon, Table } from 'semantic-ui-react';
import { useHistory, useParams } from 'react-router-dom';
import moment from 'moment';

import { Params } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import CardWithContentsAndRelatedCount from '_data/lecture/cards/model/CardWithContentsAndRelatedCount';

import { useFindColleges } from 'college/College.hook';
import { cardStateDisplay } from 'card/card/ui/logic/CardHelper';

import { learningManagementUrl } from '../../../../Routes';
import { displayChannel } from '../../../shared/utiles';

interface Props {
  cards: CardWithContentsAndRelatedCount[];
  startNo: number;
}

const CardApprovalList = observer(({ cards, startNo }: Props) => {
  //
  const history = useHistory();
  const { cineroomId } = useParams<Params>();
  const { data: Colleges } = useFindColleges();

  const routeToDetail = (cardId: string) => {
    //
    history.push(`/cineroom/${cineroomId}/${learningManagementUrl}/card-approval/card-approval-detail/${cardId}`);
  };

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
          cards.map(({ card, cardContents, cardRelatedCount }, index: number) => (
            <Table.Row textAlign="center" key={card.id} onClick={() => routeToDetail(card.id)}>
              <Table.Cell>{startNo - index}</Table.Cell>
              <Table.Cell textAlign="left">{getPolyglotToAnyString(card.name)}</Table.Cell>
              <Table.Cell>{displayChannel(card.mainCategory, Colleges?.results)}</Table.Cell>
              <Table.Cell>{moment(card.cardStateModifiedTime).format('YYYY.MM.DD HH:mm:ss')}</Table.Cell>
              <Table.Cell>{getPolyglotToAnyString(cardContents.registrantName)}</Table.Cell>
              <Table.Cell>{cardStateDisplay(card.cardState)}</Table.Cell>
              <Table.Cell>{card.searchable ? 'Yes' : 'No'}</Table.Cell>
            </Table.Row>
          ))
        ) : (
          <Table.Row>
            <Table.Cell textAlign="center" colSpan={14}>
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
});

export default CardApprovalList;
