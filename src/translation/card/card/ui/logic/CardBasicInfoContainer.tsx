import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';

import { CardService } from '../../index';
import CardBasicInfoView from '../view/CardBasicInfoView';

interface Props {
  isUpdatable: boolean;
  cardService: CardService;
}

@observer
@reactAutobind
class CardBasicInfoContainer extends React.Component<Props> {
  //
  render() {
    //
    const { isUpdatable, cardService } = this.props;
    const { cardQuery, changeCardQueryProps } = cardService;

    return (
      <CardBasicInfoView
        isUpdatable={isUpdatable}
        cardQuery={cardQuery}
        changeCardQueryProps={changeCardQueryProps}
      />
    );
  }
}

export default CardBasicInfoContainer;
