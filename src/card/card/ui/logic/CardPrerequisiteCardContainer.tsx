import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';

import { CardService } from '../../index';
import { yesNoToBoolean } from './CardHelper';
import { PrerequisiteCard } from '../../../../_data/lecture/cards/model/vo/PrerequisiteCard';
import { CardWithContents } from '../../model/CardWithContents';
import CardPrerequisiteCardView from '../view/CardPrerequisiteCardView';
import { GroupBasedAccessRuleModel } from 'shared/model';

interface Props {
  isUpdatable: boolean;
  cardService: CardService;
  collegesMap: Map<string, string>;
  channelMap: Map<string, string>;
  groupBasedAccessRule: GroupBasedAccessRuleModel;
}

@observer
@reactAutobind
class CardPrerequisiteCardContainer extends React.Component<Props> {
  //

  onClickPrerequisiteCardModalOk() {
    //
    const { cardService } = this.props;
    const { selectedCards, changeCardContentsQueryProps } = cardService;
    cardService.setPrerequisiteCards(selectedCards);

    const cards = selectedCards.map(
      (cardWithContents) =>
        new PrerequisiteCard({
          prerequisiteCardId: cardWithContents.card.id,
          prerequisiteCardName: cardWithContents.card.name,
          groupBasedAccessRule: cardWithContents.card.groupBasedAccessRule,
        } as PrerequisiteCard)
    );

    changeCardContentsQueryProps('prerequisiteCards', cards);
  }

  getCardContents(cardId: string) {
    //
    const { prerequisiteCards } = this.props.cardService;

    const copiedPrerequisiteCards = [...prerequisiteCards];

    const cardWithContents = copiedPrerequisiteCards.filter(
      (cardWithContents) => cardWithContents && cardWithContents.card && cardWithContents.card.id === cardId
    );

    return cardWithContents.length > 0 ? cardWithContents[0] : new CardWithContents();
    // return new CardWithContents();
  }

  onChangeCardRequired(index: number, value: any) {
    //
    const { changeCardContentsQueryProps } = this.props.cardService;

    changeCardContentsQueryProps(`prerequisiteCards[${index}].required`, yesNoToBoolean(value));
  }

  onClickDeletePrerequisiteCard(index: number) {
    //
    const { cardContentsQuery, prerequisiteCards, changeCardContentsQueryProps, setPrerequisiteCards } =
      this.props.cardService;
    //
    const removeQueryPrerequisiteCards = this.removeInList(index, cardContentsQuery.prerequisiteCards);
    const removePrerequisiteCard = this.removeInList(index, prerequisiteCards);

    changeCardContentsQueryProps('prerequisiteCards', removeQueryPrerequisiteCards);
    setPrerequisiteCards(removePrerequisiteCard);
  }

  onClickSortPrerequisiteCard(
    index: number,
    prerequisiteCard: PrerequisiteCard,
    cardWithContents: CardWithContents,
    seq: number,
    neqSeq: number
  ) {
    //
    const { cardContentsQuery, prerequisiteCards, changeCardContentsQueryProps, setPrerequisiteCards } =
      this.props.cardService;

    const newQueryPrerequisiteCard = [...cardContentsQuery.prerequisiteCards];

    newQueryPrerequisiteCard.splice(seq, 1);
    newQueryPrerequisiteCard.splice(neqSeq, 0, prerequisiteCard);

    changeCardContentsQueryProps('prerequisiteCards', newQueryPrerequisiteCard);

    const newPrerequisiteCard = [...prerequisiteCards];
    newPrerequisiteCard.splice(seq, 1);
    newPrerequisiteCard.splice(neqSeq, 0, cardWithContents);

    setPrerequisiteCards(newPrerequisiteCard);
  }

  removeInList(index: number, oldList: any[]) {
    //
    return oldList.slice(0, index).concat(oldList.slice(index + 1));
  }

  render() {
    //
    const { isUpdatable, cardService, collegesMap, channelMap, groupBasedAccessRule } = this.props;
    const { prerequisiteCardQuery, changePrerequisiteCardQueryProps, cardContentsQuery, prerequisiteCards } =
      cardService;

    return (
      <CardPrerequisiteCardView
        isUpdatable={isUpdatable}
        prerequisiteCardQuery={prerequisiteCardQuery}
        changePrerequisiteCardQueryProps={changePrerequisiteCardQueryProps}
        cardContentsQuery={cardContentsQuery}
        prerequisiteCards={prerequisiteCards}
        collegesMap={collegesMap}
        channelMap={channelMap}
        onClickPrerequisiteCardModalOk={this.onClickPrerequisiteCardModalOk}
        getCardContents={this.getCardContents}
        onChangeCardRequired={this.onChangeCardRequired}
        onClickDeletePrerequisiteCard={this.onClickDeletePrerequisiteCard}
        onClickSortPrerequisiteCard={this.onClickSortPrerequisiteCard}
        groupBasedAccessRule={groupBasedAccessRule}
      />
    );
  }
}

export default CardPrerequisiteCardContainer;
