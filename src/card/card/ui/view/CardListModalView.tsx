import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Icon, Radio, Table } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CardWithAccessRuleResult } from '../../model/CardWithAccessRuleResult';
import { CardWithContents } from '../../model/CardWithContents';
import { booleanToYesNo, divisionCategories } from '../logic/CardHelper';
import { SelectType } from 'shared/model';

interface Props {
  onSelectCard: (card: CardWithContents, checked: boolean) => void;
  cards: CardWithAccessRuleResult[];
  selectedCards: CardWithContents[];
  collegesMap: Map<string, string>;
  channelMap: Map<string, string>;
  isSingle?: boolean;
  singleSelectedCard?: CardWithContents | null;
  onSingleSelectCard?: (card: CardWithContents) => void;
}

@observer
@reactAutobind
class CardListModalView extends ReactComponent<Props, {}> {
  //
  render() {
    //
    const {
      onSelectCard,
      cards,
      selectedCards,
      collegesMap,
      channelMap,
      isSingle,
      singleSelectedCard,
      onSingleSelectCard,
    } = this.props;

    return (
      <Table celled>
        <colgroup>
          <col width="5%" />
          <col />
          <col width="15%" />
          <col width="10%" />
          <col width="10%" />
          <col width="15%" />
          <col width="10%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>선택</Table.HeaderCell>
            <Table.HeaderCell>Card 명</Table.HeaderCell>
            <Table.HeaderCell>Channel</Table.HeaderCell>
            <Table.HeaderCell>접근가능여부</Table.HeaderCell>
            <Table.HeaderCell>공개여부</Table.HeaderCell>
            <Table.HeaderCell>등록일자</Table.HeaderCell>
            <Table.HeaderCell>생성자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(cards &&
            cards.length !== 0 &&
            cards.map((cardWithAccessRuleResult, idx) => {
              const selected = selectedCards.some(
                (selectedCard) => selectedCard.card.id === cardWithAccessRuleResult.cardWithContents.card.id
              );

              const { mainCategory } = divisionCategories(cardWithAccessRuleResult.cardWithContents.card.categories);

              return (
                <Table.Row key={idx} textAlign="center">
                  <Table.Cell>
                    {(isSingle && (
                      <Form.Field
                        control={Radio}
                        value={cardWithAccessRuleResult.cardWithContents.card.id}
                        checked={
                          singleSelectedCard &&
                          singleSelectedCard.card.id === cardWithAccessRuleResult.cardWithContents.card.id
                        }
                        onChange={() =>
                          onSingleSelectCard && onSingleSelectCard(cardWithAccessRuleResult.cardWithContents)
                        }
                      />
                    )) || (
                      <Form.Field
                        control={Checkbox}
                        checked={selected}
                        disabled={!cardWithAccessRuleResult.accessible}
                        onChange={(e: any, data: any) =>
                          onSelectCard(cardWithAccessRuleResult.cardWithContents, data.checked)
                        }
                      />
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="left">
                    {getPolyglotToAnyString(
                      cardWithAccessRuleResult.cardWithContents.card.name,
                      getDefaultLanguage(cardWithAccessRuleResult.cardWithContents.card.langSupports)
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {collegesMap.get(mainCategory.collegeId) === undefined ||
                    channelMap.get(mainCategory.channelId) === undefined
                      ? ''
                      : `${collegesMap.get(mainCategory.collegeId)} > ${channelMap.get(mainCategory.channelId)}`}
                  </Table.Cell>
                  <Table.Cell>{booleanToYesNo(cardWithAccessRuleResult.accessible)}</Table.Cell>
                  <Table.Cell>
                    {cardWithAccessRuleResult.cardWithContents.card.searchable ? '공개' : '비공개'}
                  </Table.Cell>
                  <Table.Cell>
                    {moment(cardWithAccessRuleResult.cardWithContents.cardContents.registeredTime).format(
                      'YYYY.MM.DD HH:mm:ss'
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {getPolyglotToAnyString(
                      cardWithAccessRuleResult.cardWithContents.cardContents.registrantName,
                      getDefaultLanguage(cardWithAccessRuleResult.cardWithContents.card.langSupports)
                    )}
                  </Table.Cell>
                </Table.Row>
              );
            })) || (
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

export default CardListModalView;
