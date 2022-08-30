import * as React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Modal, Pagination } from 'shared/components';
import { Button } from 'semantic-ui-react';
import { CardWithContents } from '../../model/CardWithContents';
import CardService from '../../present/logic/CardService';
import { inject, observer } from 'mobx-react';
import { SharedService } from 'shared/present';
import CardListByCubeModalView from '../view/CardListByCubeModalView';

interface Props {
  cubeId: string;
  defaultValue?: CardWithContents;
}

interface States {}

interface Injected {
  cardService: CardService;
  sharedService: SharedService;
}

@inject('cardService')
@observer
@reactAutobind
class CardByCubeModal extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'cardByCubeModal';

  async findCardsByCardRdo(): Promise<void> {
    //
    const { cardService } = this.injected;

    await cardService.findByCubeId(this.props.cubeId);
  }

  onOpenModal() {
    //
    if (this.props.defaultValue) {
      this.injected.cardService.setSelectedCards([this.props.defaultValue]);
    } else {
      this.injected.cardService.clearSelectedCards();
    }
  }

  onSelectCard(card: CardWithContents, checked: boolean): void {
    //
    const { cardService } = this.injected;
    if (checked) {
      cardService.setSelectedCards([card]);
    } else {
      cardService.setSelectedCards([]);
    }
  }

  onSaveCards(): void {
    //
    const { cardService } = this.injected;
    cardService.setSelectedCardByCube(cardService.selectedCards[0]);
  }

  render() {
    //
    const { cardService } = this.injected;
    const { selectedCards, cards } = cardService;

    return (
      <Modal
        size="large"
        triggerAs="a"
        trigger={<Button onClick={this.onOpenModal}>Card 선택</Button>}
        onMount={this.findCardsByCardRdo}
      >
        <Modal.Header className="res">카드 선택</Modal.Header>
        <Modal.Content className="fit-layout">
          <>
            <Pagination name={this.paginationKey} onChange={this.findCardsByCardRdo}>
              <CardListByCubeModalView onSelectCard={this.onSelectCard} cards={cards} selectedCards={selectedCards} />
              <Pagination.Navigator />
            </Pagination>
          </>
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton onClick={this.onSaveCards}>OK</Modal.CloseButton>
          <Modal.CloseButton>CANCEL</Modal.CloseButton>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default CardByCubeModal;
