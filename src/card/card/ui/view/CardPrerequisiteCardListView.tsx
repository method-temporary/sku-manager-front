import React from 'react';
import { observer } from 'mobx-react';
import { Button, Table, Form } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { GroupBasedAccessRuleModel, GroupBasedAccessRule } from 'shared/model';
import { RadioGroup } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { booleanToYesNo, divisionCategories } from '../logic/CardHelper';
import { CardWithContents } from '../../model/CardWithContents';
import { RequireType } from '../../../../_data/lecture/cards/model/vo/CardStates';
import { PrerequisiteCard } from '../../../../_data/lecture/cards/model/vo/PrerequisiteCard';
import { CardContentsQueryModel } from '../../model/CardContentsQueryModel';

interface Props {
  //
  isUpdatable: boolean;
  cardContentsQuery: CardContentsQueryModel;
  prerequisiteCards: CardWithContents[];
  getCardContents: (cardId: string) => CardWithContents;
  collegesMap: Map<string, string>;
  channelMap: Map<string, string>;
  onChangeCardRequired: (index: number, value: any) => void;
  onClickDeletePrerequisiteCard: (index: number) => void;
  onClickSortPrerequisiteCard: (
    index: number,
    prerequisiteCard: PrerequisiteCard,
    cardWithContents: CardWithContents,
    seq: number,
    neqSeq: number
  ) => void;
  groupBasedAccessRule: GroupBasedAccessRuleModel;
}

@observer
@reactAutobind
class CardPrerequisiteCardListView extends React.Component<Props> {
  //
  render() {
    //
    const {
      isUpdatable,
      cardContentsQuery,
      collegesMap,
      channelMap,
      onChangeCardRequired,
      onClickDeletePrerequisiteCard,
      onClickSortPrerequisiteCard,
      groupBasedAccessRule,
    } = this.props;

    const prerequisite = cardContentsQuery.prerequisiteCards;

    return (
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2}>Card 정보</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {prerequisite.map((prerequisiteCard, index: number) => {
            const { getCardContents } = this.props;
            const cardWithContents = getCardContents(prerequisiteCard.prerequisiteCardId);
            const { mainCategory } = divisionCategories(cardWithContents.card.categories);

            return (
              <Table.Row key={index}>
                {isUpdatable && (
                  <Table.Cell>
                    Card {index + 1}
                    <div className="action-btn-group">
                      <Button icon="minus" size="mini" basic onClick={() => onClickDeletePrerequisiteCard(index)} />
                      {prerequisite.length > 1 && (
                        <>
                          <Button
                            icon="angle down"
                            size="mini"
                            basic
                            onClick={() =>
                              onClickSortPrerequisiteCard(index, prerequisiteCard, cardWithContents, index, index + 1)
                            }
                          />
                          <Button
                            icon="angle up"
                            size="mini"
                            basic
                            onClick={() =>
                              onClickSortPrerequisiteCard(index, prerequisiteCard, cardWithContents, index, index - 1)
                            }
                          />
                        </>
                      )}
                    </div>
                  </Table.Cell>
                )}

                <Table.Cell colSpan={isUpdatable ? 1 : 2}>
                  <Form.Group>
                    <RadioGroup
                      disabled={!isUpdatable}
                      value={booleanToYesNo(prerequisiteCard.required)}
                      values={[RequireType.Require, RequireType.Optional]}
                      labels={['필수', '선택']}
                      onChange={(e: any, data: any) => onChangeCardRequired(index, data.value)}
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
                        <Table.Cell>{getPolyglotToAnyString(cardWithContents.card.name)}</Table.Cell>
                        <Table.Cell>
                          {`${collegesMap.get(mainCategory.collegeId)} > ${channelMap.get(mainCategory.channelId)}`}
                        </Table.Cell>
                        <Table.Cell>{`${cardWithContents.card.learningTime} / ${
                          cardWithContents.card.stampCount > 0 ? 'Yes' : 'No'
                        }`}</Table.Cell>
                        <Table.Cell>
                          {moment(cardWithContents.cardContents.registeredTime).format('YYYY. MM. DD')}
                        </Table.Cell>
                        <Table.Cell>
                          {GroupBasedAccessRuleModel.asRuleModelForRule(
                            cardWithContents.card.groupBasedAccessRule
                          ).isAccessible(
                            new GroupBasedAccessRule(cardWithContents.card.groupBasedAccessRule),
                            groupBasedAccessRule
                          )
                            ? 'Yes'
                            : 'No'}
                        </Table.Cell>
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
  }
}

export default CardPrerequisiteCardListView;
