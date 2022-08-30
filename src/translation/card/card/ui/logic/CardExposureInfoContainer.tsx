import React from 'react';
import { observer } from 'mobx-react';

import { reactAutobind } from '@nara.platform/accent';

import { PermittedCineroom } from 'shared/model';

import { CardService } from '../../index';

import CardExposureInfoView from '../view/CardExposureInfoView';
import UserWorkspaceModel from 'userworkspace/model/UserWorkspaceModel';

interface Props {
  cardId?: string;
  isUpdatable: boolean;
  cineroomId: string;
  cardService: CardService;
  userWorkspaces: UserWorkspaceModel[];
}

const ICON_EXTENSION = {
  IMAGE: 'jpg|png|jpeg|svg|JPG|PNG|JPEG|SVG',
};

@observer
@reactAutobind
class CardExposureInfoContainer extends React.Component<Props> {
  //
  componentDidMount() {
    //
    const { cardService, userWorkspaces, cineroomId } = this.props;
    const { changeCardQueryProps, cardQuery } = cardService;

    if (cardQuery.permittedCinerooms) {
      const isAll = cardQuery.permittedCinerooms.find((cineroom) => cineroom.cineroomId === cineroomId);

      if (isAll) {
        changeCardQueryProps('isAll', true);
        if (isAll.required) {
          changeCardQueryProps('isRequiredAll', true);
        }
      }
    }

    if (userWorkspaces.length === 1) {
      const cineroom = userWorkspaces[0];
      const cineroomId = cineroom.id;
      const permittedRequireCineroomsIds = [cineroomId];
      const permittedCinerooms = [
        new PermittedCineroom({
          cineroomId,
          required: false,
        } as PermittedCineroom),
      ];

      changeCardQueryProps('isAll', true);
      changeCardQueryProps('permittedRequireCineroomsIds', permittedRequireCineroomsIds);
      changeCardQueryProps('permittedCinerooms', permittedCinerooms);
    }
  }

  render() {
    //
    const { isUpdatable, cardService } = this.props;
    const { cardQuery, changeCardQueryProps } = cardService;

    return (
      <CardExposureInfoView
        isUpdatable={isUpdatable}
        cardQuery={cardQuery}
        changeCardQueryProps={changeCardQueryProps}
      />
    );
  }
}

export default CardExposureInfoContainer;
