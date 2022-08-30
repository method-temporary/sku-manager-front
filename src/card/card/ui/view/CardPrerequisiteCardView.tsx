import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';

import { FormTable } from 'shared/components';

import CardPrerequisiteCardListView from './CardPrerequisiteCardListView';

import { CardSelectModal } from '../../index';
import { CardWithContents } from '../../model/CardWithContents';
import { PrerequisiteCard } from '../../../../_data/lecture/cards/model/vo/PrerequisiteCard';
import { CardQueryModel } from '../../model/CardQueryModel';
import { CardContentsQueryModel } from '../../model/CardContentsQueryModel';
import { GroupBasedAccessRuleModel } from 'shared/model';

interface Props {
  isUpdatable: boolean;
  prerequisiteCardQuery: CardQueryModel;
  changePrerequisiteCardQueryProps: (name: string, value: any) => void;
  cardContentsQuery: CardContentsQueryModel;
  prerequisiteCards: CardWithContents[];
  collegesMap: Map<string, string>;
  channelMap: Map<string, string>;
  onClickPrerequisiteCardModalOk: () => void;
  getCardContents: (cardId: string) => CardWithContents;
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
class CardPrerequisiteCardView extends React.Component<Props> {
  //
  render() {
    //
    const {
      isUpdatable,
      prerequisiteCardQuery,
      changePrerequisiteCardQueryProps,
      cardContentsQuery,
      prerequisiteCards,
      onClickPrerequisiteCardModalOk,
      getCardContents,
      collegesMap,
      channelMap,
      onChangeCardRequired,
      onClickDeletePrerequisiteCard,
      onClickSortPrerequisiteCard,
      groupBasedAccessRule,
    } = this.props;

    return (
      <FormTable title="선수 Card 정보">
        <FormTable.Row name="Card" required>
          {isUpdatable && (
            <CardSelectModal
              searchQuery={prerequisiteCardQuery}
              changeSearchQueryProps={changePrerequisiteCardQueryProps}
              onClickOk={onClickPrerequisiteCardModalOk}
              selectedCards={prerequisiteCards}
            />
          )}
          {prerequisiteCards.length > 0 && (
            <CardPrerequisiteCardListView
              isUpdatable={isUpdatable}
              cardContentsQuery={cardContentsQuery}
              prerequisiteCards={prerequisiteCards}
              getCardContents={getCardContents}
              collegesMap={collegesMap}
              channelMap={channelMap}
              onChangeCardRequired={onChangeCardRequired}
              onClickDeletePrerequisiteCard={onClickDeletePrerequisiteCard}
              onClickSortPrerequisiteCard={onClickSortPrerequisiteCard}
              groupBasedAccessRule={groupBasedAccessRule}
            />
          )}
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default CardPrerequisiteCardView;
