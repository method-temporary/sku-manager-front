import * as React from 'react';
import { observer } from 'mobx-react';
import { Icon, Table } from 'semantic-ui-react';
import { useHistory, useParams } from 'react-router-dom';
import moment from 'moment';

import { Params } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { getBasedAccessRuleView } from 'shared/helper';

import { CardStates } from '_data/lecture/cards/model/vo';
import CardWithContentsAndRelatedCount from '_data/lecture/cards/model/CardWithContentsAndRelatedCount';

import { useFindColleges } from 'college/College.hook';

import { learningManagementUrl } from '../../../Routes';
import { cardStateDisplay } from '../../card/ui/logic/CardHelper';
import { useUserGroupMap } from '../../../usergroup/group/present/logic/usergroup.util';
import { displayChannel } from '../../shared/utiles';

interface Props {
  cards: CardWithContentsAndRelatedCount[];
  startNo: number;
}

const CardList = observer(({ cards, startNo }: Props) => {
  //
  const history = useHistory();
  const { cineroomId } = useParams<Params>();
  const userGroupMap = useUserGroupMap();
  const { data: Colleges } = useFindColleges();

  const routeToDetail = (cardId: string) => {
    //
    history.push(`/cineroom/${cineroomId}/${learningManagementUrl}/cards/card-detail/${cardId}`);
  };

  return (
    <Table celled selectable>
      <colgroup>
        <col width="4%" />
        <col width="%" />
        {/* <col width="7%" /> */}
        <col width="6%" />
        <col width="9%" />
        <col width="6%" />
        <col width="6%" />
        <col width="6%" />
        {/* <col width="7%" />
        <col width="5%" />
        <col width="5%" /> */}
        <col width="7%" />
        <col width="7%" />
        <col width="6%" />
        <col width="10%" />
        <col width="10%" />
        <col width="6%" />
        {/* <col width="4%" />
        <col width="4%" />
        <col width="5%" />
        <col width="10%" /> */}
      </colgroup>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell>No</Table.HeaderCell>
          <Table.HeaderCell>Card???</Table.HeaderCell>
          {/* <Table.HeaderCell>????????????</Table.HeaderCell> */}
          <Table.HeaderCell>Card??????</Table.HeaderCell>
          <Table.HeaderCell>??????</Table.HeaderCell>
          <Table.HeaderCell>OC</Table.HeaderCell>
          <Table.HeaderCell>??????</Table.HeaderCell>
          <Table.HeaderCell>??????</Table.HeaderCell>
          {/* <Table.HeaderCell>Channel</Table.HeaderCell>
          <Table.HeaderCell>????????????</Table.HeaderCell>
          <Table.HeaderCell>Stamp</Table.HeaderCell> */}
          <Table.HeaderCell>?????????</Table.HeaderCell>
          <Table.HeaderCell>?????????</Table.HeaderCell>
          <Table.HeaderCell>?????????</Table.HeaderCell>
          <Table.HeaderCell>????????????</Table.HeaderCell>
          <Table.HeaderCell>????????????</Table.HeaderCell>
          <Table.HeaderCell>????????????</Table.HeaderCell>
          {/* <Table.HeaderCell>?????????</Table.HeaderCell>
          <Table.HeaderCell>?????????</Table.HeaderCell>
          <Table.HeaderCell>????????????</Table.HeaderCell>
          <Table.HeaderCell>??????????????????</Table.HeaderCell> */}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {cards && cards.length ? (
          cards.map(({ card, cardContents, cardRelatedCount }, index: number) => (
            <Table.Row textAlign="center" key={card.id} onClick={() => routeToDetail(card.id)}>
              <Table.Cell>{startNo - index}</Table.Cell>
              <Table.Cell textAlign="left">{getPolyglotToAnyString(card.name)}</Table.Cell>
              {/* <Table.Cell>{card.studentEnrollmentType === 'Anyone' ? '?????????' : '???????????????'}</Table.Cell> */}
              <Table.Cell>{card.type}</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              {/* <Table.Cell>{displayChannel(card.mainCategory, Colleges?.results)}</Table.Cell>
              <Table.Cell>{cardContents.prerequisiteCards.length > 0 ? 'Yes' : 'No'}</Table.Cell>
              <Table.Cell>{card.stampCount > 0 ? 'Yes' : 'No'}</Table.Cell> */}
              <Table.Cell>{getPolyglotToAnyString(cardContents.registrantName)}</Table.Cell>
              <Table.Cell>{moment(cardContents.registeredTime).format('YYYY.MM.DD HH:mm:ss')}</Table.Cell>
              <Table.Cell>
                {card.cardState === CardStates.Opened
                  ? moment(card.cardStateModifiedTime).format('YYYY.MM.DD HH:mm:ss')
                  : '-'}
              </Table.Cell>
              <Table.Cell>{cardStateDisplay(card.cardState)}</Table.Cell>

              {/* <Table.Cell>{cardRelatedCount.studentCount}</Table.Cell>
              <Table.Cell>{cardRelatedCount.passedStudentCount}</Table.Cell>
              <Table.Cell>{card.searchable ? 'Yes' : 'No'}</Table.Cell>
              <Table.Cell>
                {card && card.groupBasedAccessRule && getBasedAccessRuleView(card.groupBasedAccessRule, userGroupMap)}
              </Table.Cell> */}
            </Table.Row>
          ))
        ) : (
          <Table.Row>
            <Table.Cell textAlign="center" colSpan={15}>
              <div className="no-cont-wrap no-contents-icon">
                <Icon className="no-contents80" />
                <div className="sr-only">????????? ??????</div>
                <div className="text">?????? ????????? ?????? ??? ????????????.</div>
              </div>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
});

export default CardList;
