import React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import { Button, Table } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { booleanToYesNo, cardStateDisplay, divisionCategories } from '../logic/CardHelper';

import { CardStates } from '../../../../_data/lecture/cards/model/vo/CardStates';
import { CardWithContents } from '../../model/CardWithContents';

interface Props {
  isUpdatable: boolean;
  relatedCards: CardWithContents[];
  onClickDeleteRelatedCard: (index: number) => void;
  onClickSortRelatedCard: (card: CardWithContents, seq: number, newSeq: number) => void;
  collegesMap: Map<string, string>;
  channelMap: Map<string, string>;
}

@observer
@reactAutobind
class CardRelatedCardListView extends React.Component<Props> {
  //
  render() {
    //
    const { isUpdatable, relatedCards, onClickDeleteRelatedCard, onClickSortRelatedCard, collegesMap, channelMap } =
      this.props;

    return (
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2}>관련 과정</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {relatedCards.map((cardWithContents, index) => (
            <Table.Row key={index}>
              {isUpdatable && (
                <Table.Cell>
                  과정 {index + 1}
                  <div className="action-btn-group">
                    <Button icon="minus" size="mini" basic onClick={() => onClickDeleteRelatedCard(index)} />
                    {relatedCards.length > 1 ? (
                      <>
                        <Button
                          icon="angle down"
                          size="mini"
                          basic
                          onClick={() => onClickSortRelatedCard(cardWithContents, index, index + 1)}
                          disabled={index === relatedCards.length - 1}
                        />
                        <Button
                          icon="angle up"
                          size="mini"
                          basic
                          onClick={() => onClickSortRelatedCard(cardWithContents, index, index - 1)}
                          disabled={index === 0}
                        />
                      </>
                    ) : null}
                  </div>
                </Table.Cell>
              )}
              <Table.Cell colSpan={isUpdatable ? 1 : 2}>
                <Table celled>
                  <colgroup>
                    <col width="20%" />
                    <col width="20%" />
                    <col width="10%" />
                    <col width="10%" />
                    <col width="10%" />
                    <col width="10%" />
                    <col width="10%" />
                    <col width="10%" />
                  </colgroup>

                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell textAlign="center">Card 명</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">Channel</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">
                        Stamp
                        <br />
                        획득여부
                      </Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">등록일자</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">승인일자</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">제공상태</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">생성자</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">공개여부</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    <Table.Row>
                      {/* 코스명 */}
                      <Table.Cell>{getPolyglotToAnyString(cardWithContents.card.name)}</Table.Cell>
                      {/* Channel */}
                      <Table.Cell>
                        {`${collegesMap.get(
                          divisionCategories(cardWithContents.card.categories).mainCategory.collegeId
                        )} > ${channelMap.get(
                          divisionCategories(cardWithContents.card.categories).mainCategory.channelId
                        )}`}
                      </Table.Cell>

                      {/* Stamp여부 */}
                      <Table.Cell textAlign="center">{cardWithContents.card.stampCount > 0 ? 'Yes' : 'No'}</Table.Cell>

                      {/* 등록일자 */}
                      <Table.Cell textAlign="center">
                        {moment(cardWithContents.cardContents.registeredTime).format('YYYY.MM.DD')}
                        {/*YYYY-MM-DD HH:mi:ss*/}
                      </Table.Cell>

                      {/* 승인일자 */}
                      <Table.Cell textAlign="center">
                        {cardWithContents.card.cardState === CardStates.Opened
                          ? moment(cardWithContents.card.cardStateModifiedTime).format('YYYY.MM.DD')
                          : '-'}
                      </Table.Cell>

                      {/* 제공상태 */}
                      <Table.Cell textAlign="center">{cardStateDisplay(cardWithContents.card.cardState)}</Table.Cell>

                      {/* 생성자 */}
                      <Table.Cell textAlign="center">
                        {getPolyglotToAnyString(cardWithContents.cardContents.registrantName)}
                      </Table.Cell>

                      {/* 공개여부 */}
                      <Table.Cell textAlign="center">{booleanToYesNo(cardWithContents.card.searchable)}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

export default CardRelatedCardListView;
