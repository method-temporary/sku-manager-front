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
class CardBasicInfoView extends React.Component<Props> {
  //
  render() {
    //
    const {
      isUpdatable,
      cardQuery,
      changeCardQueryProps,
    } = this.props;
    
    return (
      <FormTable title="기본 정보">
        <FormTable.Row name="지원 언어">
          <Polyglot.Languages onChangeProps={changeCardQueryProps} readOnly={!isUpdatable} />
        </FormTable.Row>
        <FormTable.Row name="기본 언어">
          <Polyglot.Default onChangeProps={changeCardQueryProps} readOnly={!isUpdatable} />
        </FormTable.Row>
        <FormTable.Row name="Card 명" required>
          <Polyglot.Input
            languageStrings={cardQuery.name}
            name="name"
            onChangeProps={changeCardQueryProps}
            placeholder="과정명을 입력해주세요. (최대 200자까지 입력가능)"
            maxLength="200"
            readOnly={!isUpdatable}
          />
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default CardBasicInfoView;
