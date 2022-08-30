import React from 'react';
import { observer } from 'mobx-react';

import { GroupBasedAccessRuleModel } from 'shared/model';
import { AccessRuleService } from 'shared/present';
import { FormTable } from 'shared/components';

import CardSelectModal from '../../../shared/components/cardSelectModal/CardSelectModal';
import { CardWithAccessAndOptional } from '../../../shared/components/cardSelectModal/model/CardWithAccessAndOptional';

import { convertRelatedCards } from '../../CardCreate.util';
import CardCreateStore from '../../CardCreate.store';
import { RelatedCardWithInfo } from '../model/RelatedCardWithInfo';
import RelatedCardList from './RelatedCardList';

interface Props {
  //
  readonly?: boolean;
}

export const RelatedCard = observer(({ readonly }: Props) => {
  //
  const { relatedCards, setRelatedCards } = CardCreateStore.instance;
  const { groupBasedAccessRule } = AccessRuleService.instance;

  const selectedCards = relatedCards.map((relatedCard) => convertRelatedCards(relatedCard));

  const groupAccessRoles = GroupBasedAccessRuleModel.asGroupBasedAccessRule(groupBasedAccessRule);

  const onOk = (selectCards: CardWithAccessAndOptional[]) => {
    //
    setRelatedCards(
      selectCards.map(
        ({ cardWithContents: { card, cardContents }, relatedCardId, accessible }) =>
          ({
            card,
            cardContents,
            relatedCardId: relatedCardId || card.id,
            accessible,
          } as RelatedCardWithInfo)
      )
    );
  };

  return (
    <FormTable.Row name="관련 과정">
      <CardSelectModal
        isMulti
        groupAccessRoles={groupAccessRoles}
        onOk={onOk}
        selectedCards={selectedCards}
        readonly={readonly}
      />
      {relatedCards.length > 0 && <RelatedCardList readonly={readonly} />}
    </FormTable.Row>
  );
});

export default RelatedCard;
