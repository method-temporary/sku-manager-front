import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import CardAdditionalInfoView from '../view/CardAdditionalInfoView';
import { CardService } from '../../index';

interface Props {
  isUpdatable: boolean;
  cardService: CardService;
}

interface State {
  listModalOpen: boolean;
}
@observer
@reactAutobind
class CardAdditionalInfoContainer extends React.Component<Props, State> {
  //
  render() {
    //
    const { isUpdatable, cardService } = this.props;
    const { cardContentsQuery, changeCardContentsQueryProps } = cardService;

    return (
      <>
        <CardAdditionalInfoView
          isUpdatable={isUpdatable}
          cardContentsQuery={cardContentsQuery}
          changeCardContentsQueryProps={changeCardContentsQueryProps}
        />
      </>
    );
  }
}
export default CardAdditionalInfoContainer;
