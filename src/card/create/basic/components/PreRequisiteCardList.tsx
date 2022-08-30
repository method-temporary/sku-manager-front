import React from 'react';
import { observer } from 'mobx-react';
import { Button, Form, Table } from 'semantic-ui-react';
import dayjs from 'dayjs';

import { RadioGroup } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { booleanToYesNo, yesNoToBoolean } from 'shared/helper';

import { RequireType } from '_data/lecture/cards/model/vo';

import { useFindColleges } from 'college/College.hook';

import { displayChannel } from '../../../shared/utiles';

import CardCreateStore from '../../CardCreate.store';
import { PreRequisiteCardWithInfo } from '../model/PreRequisiteCardWithInfo';

interface Props {
  readonly?: boolean;
}

const PreRequisiteCardList = observer(({ readonly }: Props) => {
  //
  const { prerequisiteCards, setPrerequisiteCards } = CardCreateStore.instance;
  const { data: Colleges } = useFindColleges();

  const onChangeRequired = (index: number, value: string) => {
    //
    setPrerequisiteCards(
      prerequisiteCards.map(
        (prerequisiteCard, idx) =>
          ({
            ...prerequisiteCard,
            required: index === idx ? yesNoToBoolean(value) : prerequisiteCard.required,
          } as PreRequisiteCardWithInfo)
      )
    );
  };

  const onDelete = (index: number) => {
    //
    setPrerequisiteCards(
      prerequisiteCards
        .filter((_, idx) => index !== idx)
        .map(
          (prerequisiteCard) =>
            ({
              ...prerequisiteCard,
            } as PreRequisiteCardWithInfo)
        )
    );
  };

  const onChangeSort = (index: number, nextIndex: number, prerequisiteCard: PreRequisiteCardWithInfo) => {
    //
    const next = [...prerequisiteCards];

    next.splice(index, 1);
    next.splice(nextIndex, 0, prerequisiteCard);

    setPrerequisiteCards(next);
  };

  return (
    <Table celled>
      <colgroup>
        {!readonly && <col width="20%" />}
        <col width="80%" />
      </colgroup>

      <Table.Body>
        {prerequisiteCards.map((prerequisiteCard, index: number) => {
          return (
            <Table.Row key={index}>
              {!readonly && (
                <Table.Cell>
                  Card {index + 1}
                  <div className="action-btn-group">
                    <Button icon="minus" size="mini" basic onClick={() => onDelete(index)} />
                    {prerequisiteCards.length > 1 && (
                      <>
                        <Button
                          icon="angle down"
                          size="mini"
                          basic
                          disabled={index === prerequisiteCards.length - 1}
                          onClick={() => onChangeSort(index, index + 1, prerequisiteCard)}
                        />
                        <Button
                          icon="angle up"
                          size="mini"
                          basic
                          disabled={index === 0}
                          onClick={() => onChangeSort(index, index - 1, prerequisiteCard)}
                        />
                      </>
                    )}
                  </div>
                </Table.Cell>
              )}

              <Table.Cell colSpan={readonly ? 2 : 1}>
                <Form.Group>
                  <RadioGroup
                    disabled={readonly}
                    value={booleanToYesNo(prerequisiteCard.required)}
                    values={[RequireType.Require, RequireType.Optional]}
                    labels={['필수', '선택']}
                    onChange={(e: any, data: any) => onChangeRequired(index, data.value)}
                  />
                </Form.Group>

                <Table celled>
                  <colgroup>
                    <col width="35%" />
                    <col width="25%" />
                    <col width="15%" />
                    <col width="15%" />
                    <col width="10%" />
                  </colgroup>

                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>과정명</Table.HeaderCell>
                      <Table.HeaderCell>대표College &gt; 대표Channel</Table.HeaderCell>
                      <Table.HeaderCell>학습시간/Stamp</Table.HeaderCell>
                      <Table.HeaderCell>승인일자</Table.HeaderCell>
                      <Table.HeaderCell>접근가능 여부</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>{getPolyglotToAnyString(prerequisiteCard.prerequisiteCardName)}</Table.Cell>
                      <Table.Cell>{displayChannel(prerequisiteCard.mainCategory, Colleges?.results)}</Table.Cell>
                      <Table.Cell>{`${prerequisiteCard.learningTime} / ${booleanToYesNo(
                        prerequisiteCard.hasStamp
                      )}`}</Table.Cell>
                      <Table.Cell>{dayjs(prerequisiteCard.registeredTime).format('YYYY. MM. DD')}</Table.Cell>
                      <Table.Cell>{prerequisiteCard.accessible ? 'Yes' : 'No'}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Table.Cell>
            </Table.Row>
          );
        }) || null}
      </Table.Body>
    </Table>
  );
});

export default PreRequisiteCardList;
