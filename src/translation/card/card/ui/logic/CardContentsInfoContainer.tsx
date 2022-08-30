import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import CardContentsInfoView from '../view/CardContentsInfoView';
import { CardService } from '../../index';

interface Props {
  isUpdatable: boolean;
  cardService: CardService;
  collegesMap: Map<string, string>;
  channelMap: Map<string, string>;
}

@observer
@reactAutobind
class CardContentsInfoContainer extends React.Component<Props> {
  
  render() {
    //
    const { isUpdatable, cardService } = this.props;
    const {
      cardQuery,
      changeCardQueryProps,
      cardContentsQuery,
      changeCardContentsQueryProps,
    } = cardService;

    return (
      <CardContentsInfoView
        cardQuery={cardQuery}
        isUpdatable={isUpdatable}
        cardContentsQuery={cardContentsQuery}
        changeCardQueryProps={changeCardQueryProps}
        changeCardContentsQueryProps={changeCardContentsQueryProps}
      />
    );
  }
}

export default CardContentsInfoContainer;
