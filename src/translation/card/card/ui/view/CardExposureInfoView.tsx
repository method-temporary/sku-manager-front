import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';

import { FormTable } from 'shared/components';

import { CardQueryModel } from 'card/card/model/CardQueryModel';
import Polyglot from 'shared/components/Polyglot';

interface Props {
  isUpdatable: boolean;
  cardQuery: CardQueryModel;
  changeCardQueryProps: (name: string, value: any) => void;
}

@observer
@reactAutobind
class CardExposureInfoView extends React.Component<Props> {
  //

  render() {
    //
    const { isUpdatable, cardQuery, changeCardQueryProps } = this.props;

    return (
      <FormTable title="노출 정보">
        <FormTable.Row name="Tag 정보">
          <Polyglot.Input
            languageStrings={cardQuery.tags}
            onChangeProps={changeCardQueryProps}
            name="tags"
            placeholder="단어간에는 쉼표(“,”)로 구분합니다."
            readOnly={!isUpdatable}
          />
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default CardExposureInfoView;
