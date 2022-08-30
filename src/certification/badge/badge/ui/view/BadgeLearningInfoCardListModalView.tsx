import React from 'react';
import { reactAutobind } from '@nara.platform/accent';
import { Checkbox, Form, Icon, Radio, Table } from 'semantic-ui-react';
import { CardWithContents } from '../../../../../card';
import { observer } from 'mobx-react';
import moment from 'moment';

interface Props {
  cards: CardWithContents[];
  onCheckCardPlan: (card: CardWithContents) => void;
  cardIds: string[];
  multiple?: boolean; // undefined, true가 기본
  collegeMap: Map<string, string>;
  channelMap: Map<string, string>;
}

@observer
@reactAutobind
class BadgeLearningInfoCardListModalView extends React.Component<Props> {
  //
  render() {
    //
    const { cards, onCheckCardPlan, cardIds, multiple, collegeMap, channelMap } = this.props;

    return (
      <Table celled>
        <colgroup>
          <col width="5%" />
          <col width="40%" />
          <col width="25%" />
          <col width="15%" />
          <col width="15%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">선택</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">과정명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Channel</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">등록일자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">생성자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {(cards &&
            cards.length &&
            cards.map((card, index: number) => (
              <Table.Row key={index}>
                <Table.Cell textAlign="center">
                  <Form.Field
                    control={multiple === false ? Radio : Checkbox}
                    checked={cardIds.includes(card.card.id)}
                    onChange={(e: any, data: any) => onCheckCardPlan(card)}
                  />
                </Table.Cell>
                <Table.Cell>{card.card.name}</Table.Cell>
                <Table.Cell>
                  {card.card.categories.map((college, index) => {
                    if (college.mainCategory === true) {
                      return `${collegeMap.get(college.collegeId)} > ${channelMap.get(college.channelId)}`;
                    } else {
                      return null;
                    }
                  })}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {moment(card.cardContents.registeredTime).format('YY.MM.DD')}
                </Table.Cell>
                <Table.Cell>{card.cardContents.registrantName}</Table.Cell>
              </Table.Row>
            ))) || (
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

export default BadgeLearningInfoCardListModalView;
