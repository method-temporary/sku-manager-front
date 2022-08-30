import React from 'react';
import { observer } from 'mobx-react';

import { reactAutobind } from '@nara.platform/accent';

import { FormTable, Polyglot } from 'shared/components';
import { Language } from 'shared/components/Polyglot';

import { CardQueryModel } from 'card/card';
import { CardContentsQueryModel } from 'card/card/model/CardContentsQueryModel';

interface Props {
  isUpdatable: boolean;
  cardQuery: CardQueryModel;
  cardContentsQuery: CardContentsQueryModel;
  changeCardQueryProps: (name: string, value: any) => void;
  changeCardContentsQueryProps: (name: string, value: any) => void;
}

@observer
@reactAutobind
class CardContentsInfoView extends React.Component<Props> {
  render() {
    const { isUpdatable, cardQuery, changeCardQueryProps, cardContentsQuery, changeCardContentsQueryProps } =
      this.props;

    return (
      <FormTable title="부가 정보">
        <FormTable.Row name="Card 표시 문구" required>
          <Polyglot.TextArea
            name="simpleDescription"
            onChangeProps={changeCardQueryProps}
            languageStrings={cardQuery.simpleDescription}
            maxLength={200}
            placeholder={isUpdatable ? 'Card 표시 문구를 입력해주세요. (최대 200자까지 입력가능)' : ''}
            readOnly={!isUpdatable}
            oneLanguage={Language.Ko}
            disabledTab={true}
          />
          <div className="margin-bottom10" />
          <Polyglot.TextArea
            name="simpleDescription"
            onChangeProps={changeCardQueryProps}
            languageStrings={cardQuery.simpleDescription}
            maxLength={200}
            placeholder={isUpdatable ? 'Card 표시 문구를 입력해주세요. (최대 200자까지 입력가능)' : ''}
            readOnly={!isUpdatable}
            oneLanguage={Language.En}
            disabledTab={true}
          />
          <div className="margin-bottom10" />
          <Polyglot.TextArea
            name="simpleDescription"
            onChangeProps={changeCardQueryProps}
            languageStrings={cardQuery.simpleDescription}
            maxLength={200}
            placeholder={isUpdatable ? 'Card 표시 문구를 입력해주세요. (최대 200자까지 입력가능)' : ''}
            readOnly={!isUpdatable}
            oneLanguage={Language.Zh}
            disabledTab={true}
          />
        </FormTable.Row>
        <FormTable.Row name="Card 소개" required>
          <Polyglot.Editor
            name="description"
            languageStrings={cardContentsQuery.description}
            onChangeProps={changeCardContentsQueryProps}
            maxLength={3000}
            placeholder={isUpdatable ? 'Card 소개를 입력해주세요. (3,000자까지 입력가능)' : ''}
            readOnly={!isUpdatable}
            oneLanguage={Language.Ko}
            disabledTab={true}
          />
          <div className="margin-bottom10" />
          <Polyglot.Editor
            name="description"
            languageStrings={cardContentsQuery.description}
            onChangeProps={changeCardContentsQueryProps}
            maxLength={3000}
            placeholder={isUpdatable ? 'Card 소개를 입력해주세요. (3,000자까지 입력가능)' : ''}
            readOnly={!isUpdatable}
            oneLanguage={Language.En}
            disabledTab={true}
          />
          <div className="margin-bottom10" />
          <Polyglot.Editor
            name="description"
            languageStrings={cardContentsQuery.description}
            onChangeProps={changeCardContentsQueryProps}
            maxLength={3000}
            placeholder={isUpdatable ? 'Card 소개를 입력해주세요. (3,000자까지 입력가능)' : ''}
            readOnly={!isUpdatable}
            oneLanguage={Language.Zh}
            disabledTab={true}
          />
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default CardContentsInfoView;
