import React from 'react';
import { observer } from 'mobx-react';
import { Button, Table } from 'semantic-ui-react';
import dayjs from 'dayjs';

import { booleanToYesNo } from 'shared/helper';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { CardStates } from '_data/lecture/cards/model/vo';

import { useFindColleges } from 'college/College.hook';

import { cardStateDisplay } from '../../../card/ui/logic/CardHelper';
import { displayChannel } from '../../../shared/utiles';
import CardCreateStore from '../../CardCreate.store';
import { RelatedCardWithInfo } from '../model/RelatedCardWithInfo';

interface Props {
  //
  readonly?: boolean;
}

const RelatedCardList = observer(({ readonly }: Props) => {
  //
  const { relatedCards, setRelatedCards } = CardCreateStore.instance;
  const { data: Colleges } = useFindColleges();

  const onDelete = (index: number) => {
    //
    setRelatedCards(
      relatedCards
        .filter((_, idx) => index !== idx)
        .map(
          (relatedCard) =>
            ({
              ...relatedCard,
            } as RelatedCardWithInfo)
        )
    );
  };

  const onChangeSort = (index: number, nextIndex: number, relatedCard: RelatedCardWithInfo) => {
    //
    const next = [...relatedCards];

    next.splice(index, 1);
    next.splice(nextIndex, 0, relatedCard);

    setRelatedCards(next);
  };

  return (
    <Table celled>
      <colgroup>
        {!readonly && <col width="20%" />}
        <col width="80%" />
      </colgroup>

      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan={2}>관련 과정</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {relatedCards.map((relatedCardWithInfo, index) => (
          <Table.Row key={index}>
            {!readonly && (
              <Table.Cell>
                과정 {index + 1}
                <div className="action-btn-group">
                  <Button icon="minus" size="mini" basic onClick={() => onDelete(index)} />
                  {relatedCards.length > 1 ? (
                    <>
                      <Button
                        icon="angle down"
                        size="mini"
                        basic
                        onClick={() => onChangeSort(index, index + 1, relatedCardWithInfo)}
                        disabled={index === relatedCards.length - 1}
                      />
                      <Button
                        icon="angle up"
                        size="mini"
                        basic
                        onClick={() => onChangeSort(index, index - 1, relatedCardWithInfo)}
                        disabled={index === 0}
                      />
                    </>
                  ) : null}
                </div>
              </Table.Cell>
            )}

            <Table.Cell colSpan={readonly ? 2 : 1}>
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
                    <Table.Cell>{getPolyglotToAnyString(relatedCardWithInfo.card.name)}</Table.Cell>
                    {/* Channel */}
                    <Table.Cell>{displayChannel(relatedCardWithInfo.card.mainCategory, Colleges?.results)}</Table.Cell>

                    {/* Stamp여부 */}
                    <Table.Cell textAlign="center">{relatedCardWithInfo.card.stampCount > 0 ? 'Yes' : 'No'}</Table.Cell>

                    {/* 등록일자 */}
                    <Table.Cell textAlign="center">
                      {dayjs(relatedCardWithInfo.cardContents.registeredTime).format('YYYY.MM.DD')}
                      {/*YYYY-MM-DD HH:mi:ss*/}
                    </Table.Cell>

                    {/* 승인일자 */}
                    <Table.Cell textAlign="center">
                      {relatedCardWithInfo.card.cardState === CardStates.Opened
                        ? dayjs(relatedCardWithInfo.card.cardStateModifiedTime).format('YYYY.MM.DD')
                        : '-'}
                    </Table.Cell>

                    {/* 제공상태 */}
                    <Table.Cell textAlign="center">{cardStateDisplay(relatedCardWithInfo.card.cardState)}</Table.Cell>

                    {/* 생성자 */}
                    <Table.Cell textAlign="center">
                      {getPolyglotToAnyString(relatedCardWithInfo.cardContents.registrantName)}
                    </Table.Cell>

                    {/* 공개여부 */}
                    <Table.Cell textAlign="center">{booleanToYesNo(relatedCardWithInfo.card.searchable)}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
});

export default RelatedCardList;
