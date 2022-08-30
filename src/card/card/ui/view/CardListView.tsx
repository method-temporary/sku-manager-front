import React from 'react';
import { observer } from 'mobx-react';
import { Icon, Loader, Table } from 'semantic-ui-react';
import { useHistory, useParams } from 'react-router-dom';
import moment from 'moment';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { getBasedAccessRuleView } from 'shared/helper';

import { CardStates } from '_data/lecture/cards/model/vo';
import { useUserGroupMap } from '../../../../usergroup/group/present/logic/usergroup.util';
import { learningManagementUrl, translationManagementUrl } from '../../../../Routes';
import { cardStateDisplay, displayChannel } from '../logic/CardHelper';
import { CardWithContents } from '../../model/CardWithContents';

interface Params {
  cineroomId: string;
}

interface Props {
  cards: CardWithContents[];
  startNo: number;
  isLoading?: boolean;
}

const CardList = observer(({ cards, startNo, isLoading }: Props) => {
  //
  const history = useHistory();
  const { cineroomId } = useParams<Params>();
  const userGroupMap = useUserGroupMap();

  const routeToDetail = (cardId: string) => {
    //
    history.push(`/cineroom/${cineroomId}/${translationManagementUrl}/cards/card-detail/${cardId}`);
  };

  return (
    <Table celled selectable>
      <colgroup>
        <col width="5%" />
        <col width="12%" />
        <col width="7%" />
        <col width="7%" />
        <col width="5%" />
        <col width="5%" />
        <col width="8%" />
        <col width="8%" />
        <col width="7%" />
        <col width="8%" />
        <col width="5%" />
        <col width="5%" />
        <col width="8%" />
        <col width="10%" />
      </colgroup>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell>No</Table.HeaderCell>
          <Table.HeaderCell>카드명</Table.HeaderCell>
          <Table.HeaderCell>카드유형</Table.HeaderCell>
          <Table.HeaderCell>Channel</Table.HeaderCell>
          <Table.HeaderCell>선수카드</Table.HeaderCell>
          <Table.HeaderCell>Stamp</Table.HeaderCell>
          <Table.HeaderCell>등록일자</Table.HeaderCell>
          <Table.HeaderCell>승인일자</Table.HeaderCell>
          <Table.HeaderCell>제공상태</Table.HeaderCell>
          <Table.HeaderCell>생성자</Table.HeaderCell>
          <Table.HeaderCell>학습자</Table.HeaderCell>
          <Table.HeaderCell>이수자</Table.HeaderCell>
          <Table.HeaderCell>공개여부</Table.HeaderCell>
          <Table.HeaderCell>접근제어규칙</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {isLoading ? (
          <Table.Row>
            <Table.Cell textAlign="center" colSpan={14}>
              <Loader active={isLoading} inline>
                Card를 검색중 입니다....
              </Loader>
            </Table.Cell>
          </Table.Row>
        ) : (
          <>
            {cards && cards.length ? (
              cards.map(({ card, cardContents, cardRelatedCount }, index: number) => (
                <Table.Row textAlign="center" key={card.id} onClick={() => routeToDetail(card.id)}>
                  <Table.Cell>{startNo - index}</Table.Cell>
                  <Table.Cell textAlign="left">{getPolyglotToAnyString(card.name)}</Table.Cell>
                  <Table.Cell>{card.type}</Table.Cell>
                  <Table.Cell>{displayChannel(card.categories)}</Table.Cell>
                  <Table.Cell>{cardContents.prerequisiteCards.length > 0 ? 'Yes' : 'No'}</Table.Cell>
                  <Table.Cell>{card.stampCount > 0 ? 'Yes' : 'No'}</Table.Cell>
                  <Table.Cell>{moment(cardContents.registeredTime).format('YYYY.MM.DD HH:mm:ss')}</Table.Cell>
                  <Table.Cell>
                    {card.cardState === CardStates.Opened
                      ? moment(card.cardStateModifiedTime).format('YYYY.MM.DD HH:mm:ss')
                      : '-'}
                  </Table.Cell>
                  <Table.Cell>{cardStateDisplay(card.cardState)}</Table.Cell>
                  <Table.Cell>{getPolyglotToAnyString(cardContents.registrantName)}</Table.Cell>
                  <Table.Cell>{cardRelatedCount.studentCount}</Table.Cell>
                  <Table.Cell>{cardRelatedCount.passedStudentCount}</Table.Cell>
                  <Table.Cell>{card.searchable ? 'Yes' : 'No'}</Table.Cell>
                  <Table.Cell>
                    {card &&
                      card.groupBasedAccessRule &&
                      getBasedAccessRuleView(card.groupBasedAccessRule, userGroupMap)}
                  </Table.Cell>
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
          </>
        )}
      </Table.Body>
    </Table>
  );
});

export default CardList;
