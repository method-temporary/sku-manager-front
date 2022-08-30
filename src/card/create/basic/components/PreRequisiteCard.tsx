import React from 'react';
import { observer } from 'mobx-react';

import { GroupBasedAccessRule, GroupBasedAccessRuleModel } from 'shared/model';
import { FormTable } from 'shared/components';
import { AccessRuleService } from 'shared/present';

import { CardWithAccessAndOptional } from '../../../shared/components/cardSelectModal/model/CardWithAccessAndOptional';
import CardSelectModal from '../../../shared/components/cardSelectModal/CardSelectModal';
import { convertPreRequisiteCards } from '../../CardCreate.util';
import CardCreateStore from '../../CardCreate.store';

import { PreRequisiteCardWithInfo } from '../model/PreRequisiteCardWithInfo';
import PreRequisiteCardList from './PreRequisiteCardList';

interface Props {
  //
  readonly?: boolean;
}

export const PreRequisiteCard = observer(({ readonly }: Props) => {
  //
  const { prerequisiteCards, setPrerequisiteCards } = CardCreateStore.instance;
  const { groupBasedAccessRule } = AccessRuleService.instance;

  const groupAccessRoles = GroupBasedAccessRuleModel.asGroupBasedAccessRule(groupBasedAccessRule);
  const selectedCards = prerequisiteCards.map((prerequisiteCard) => convertPreRequisiteCards(prerequisiteCard));

  const onOk = (cardWithAccessResults: CardWithAccessAndOptional[]) => {
    //
    setPrerequisiteCards(
      cardWithAccessResults.map(
        ({ cardWithContents: { card, cardContents }, required }) =>
          ({
            prerequisiteCardId: card.id,
            prerequisiteCardName: card.name,
            required: required || false,
            groupBasedAccessRule: card.groupBasedAccessRule,
            learningTime: card.learningTime,
            hasStamp: card.stampCount > 0,
            registeredTime: cardContents.registeredTime,
            mainCategory: card.mainCategory,
            accessible: GroupBasedAccessRuleModel.asRuleModelForRule(card.groupBasedAccessRule).isAccessible(
              new GroupBasedAccessRule(card.groupBasedAccessRule),
              groupBasedAccessRule
            ),
          } as PreRequisiteCardWithInfo)
      )
    );
  };

  return (
    <FormTable title="선수 Card 정보">
      <FormTable.Row name="Card" required>
        <CardSelectModal
          isMulti
          groupAccessRoles={groupAccessRoles}
          onOk={onOk}
          selectedCards={selectedCards}
          readonly={readonly}
        />
        {prerequisiteCards.length > 0 && <PreRequisiteCardList readonly={readonly} />}
      </FormTable.Row>
    </FormTable>
  );
});

export default PreRequisiteCard;
