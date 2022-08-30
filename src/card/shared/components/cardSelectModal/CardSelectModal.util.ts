import { CardWithAccessRuleResult } from '_data/lecture/cards/model/CardWithAccessRuleResult';
import CardSelectModalStore from './CardSelectModal.store';

/**
 * 선택된 카드인지 여부 판단
 * @param cardId
 * @return boolean
 */
export const isChecked = (cardId: string): boolean => {
  //
  const { selectedCards } = CardSelectModalStore.instance;

  const selectedCard = selectedCards.find((selectedCard) => selectedCard.cardWithContents.card.id === cardId);

  return !!selectedCard;
};

/**
 * 카드 선택, 선택 해제 Event 함수
 * @param selectedCard
 * @param checked
 * @param isMulti
 */
export const onSelectedCard = (selectedCard: CardWithAccessRuleResult, checked: boolean, isMulti: boolean = false) => {
  //
  const { selectedCards, setSelectedCards } = CardSelectModalStore.instance;

  let next: CardWithAccessRuleResult[] = [...selectedCards];

  if (checked) {
    //
    if (isMulti) {
      // 다중 선택일 경우는 현재 리스트에서 추가
      next.push(selectedCard);
    } else {
      // 단일 선택일 경우에는 현재 리스트에서 선택한 Card 만 들어가도록 수정
      next = [selectedCard];
    }
  } else {
    // Radio 는 해댱 조건에 들어올 수 없어서 단일 선택 해제에 관환 코드 X
    // 다중 선택일 경우는 현재 리스트에서 선택한 Card만 삭제
    next = next
      .filter(
        (cardWithAccessRuleResult) =>
          cardWithAccessRuleResult.cardWithContents.card.id !== selectedCard.cardWithContents.card.id
      )
      .map((cardWithAccessRuleResult) => cardWithAccessRuleResult);
  }

  setSelectedCards(next);
};
