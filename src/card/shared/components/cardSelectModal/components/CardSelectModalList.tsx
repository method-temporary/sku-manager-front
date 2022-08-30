import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Icon, Radio, Table } from 'semantic-ui-react';
import dayjs from 'dayjs';

import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';
import { booleanToYesNo } from 'shared/helper';

import { useFindColleges } from 'college/College.hook';
import { displayChannel } from '../../../utiles';

import { isChecked, onSelectedCard } from '../CardSelectModal.util';
import { CardWithAccessAndOptional } from '../model/CardWithAccessAndOptional';
import { useParams } from 'react-router-dom';

interface Props {
  isMulti?: boolean;
  cardWithAccessRule: CardWithAccessAndOptional[];
  ignoreAccess?: boolean;
}

const CardSelectModalList = observer(({ isMulti, cardWithAccessRule, ignoreAccess }: Props) => {
  //
  const { data: Colleges } = useFindColleges();
  const { cardId } = useParams<{ cardId: string }>();

  return (
    <Table celled>
      <colgroup>
        <col width="5%" />
        <col />
        <col width="8%" />
        <col width="15%" />
        <col width="8%" />
        <col width="7%" />
        <col width="15%" />
        <col width="8%" />
      </colgroup>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell>선택</Table.HeaderCell>
          <Table.HeaderCell>Card 명</Table.HeaderCell>
          <Table.HeaderCell>과정유형</Table.HeaderCell>
          <Table.HeaderCell>Channel</Table.HeaderCell>
          <Table.HeaderCell>접근가능여부</Table.HeaderCell>
          <Table.HeaderCell>공개여부</Table.HeaderCell>
          <Table.HeaderCell>등록일자</Table.HeaderCell>
          <Table.HeaderCell>생성자</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {(cardWithAccessRule &&
          cardWithAccessRule.length !== 0 &&
          cardWithAccessRule.map((cardWithAccessRuleResult, idx) => {
            return (
              <Table.Row key={idx} textAlign="center">
                <Table.Cell>
                  {(isMulti && (
                    <Form.Field
                      control={Checkbox}
                      checked={isChecked(cardWithAccessRuleResult.cardWithContents.card.id)}
                      disabled={
                        !cardWithAccessRuleResult.accessible ||
                        cardId === cardWithAccessRuleResult.cardWithContents.card.id ||
                        (ignoreAccess &&
                          cardWithAccessRuleResult.cardWithContents.card.studentEnrollmentType === 'Enrollment') ||
                        cardWithAccessRuleResult.cardWithContents.card.cardState !== 'Opened'
                      }
                      onChange={(_: any, data: any) => onSelectedCard(cardWithAccessRuleResult, data.checked, isMulti)}
                    />
                  )) || (
                    <Form.Field
                      control={Radio}
                      value={cardWithAccessRuleResult.cardWithContents.card.id}
                      disabled={
                        cardId === cardWithAccessRuleResult.cardWithContents.card.id ||
                        (ignoreAccess &&
                          cardWithAccessRuleResult.cardWithContents.card.studentEnrollmentType === 'Enrollment')
                      }
                      checked={isChecked(cardWithAccessRuleResult.cardWithContents.card.id)}
                      onChange={(_: any, data: any) => onSelectedCard(cardWithAccessRuleResult, data.checked, isMulti)}
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
                  {cardWithAccessRuleResult.cardWithContents.card.studentEnrollmentType === 'Enrollment'
                    ? '수강신청형'
                    : '상시형'}
                </Table.Cell>
                <Table.Cell>
                  {displayChannel(cardWithAccessRuleResult.cardWithContents.card.mainCategory, Colleges?.results)}
                </Table.Cell>
                <Table.Cell>{booleanToYesNo(cardWithAccessRuleResult.accessible)}</Table.Cell>
                <Table.Cell>{booleanToYesNo(cardWithAccessRuleResult.cardWithContents.card.searchable)}</Table.Cell>
                <Table.Cell>
                  {dayjs(cardWithAccessRuleResult.cardWithContents.cardContents.registeredTime).format(
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
});

export default CardSelectModalList;
