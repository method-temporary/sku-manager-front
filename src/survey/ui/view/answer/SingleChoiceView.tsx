import React from 'react';
import { List, Radio } from 'semantic-ui-react';
import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { AnswerItemModel } from '../../../answer/model/AnswerItemModel';
import { NumberValue } from '../../../form/model/NumberValue';
import { QuestionModel } from '../../../form/model/QuestionModel';
import { Image } from 'shared/components';

interface Props {
  question: QuestionModel;
  answer: AnswerItemModel;
  items: NumberValue[];
}

interface State {}

@reactAutobind
@observer
class SingleChoiceView extends React.Component<Props, State> {
  //
  render() {
    const { answer, question, items } = this.props;

    return (
      <List>
        {question.sentencesImageUrl && (
          <div style={{ margin: '20px 0' }}>
            {question.sentencesImageUrl && <Image src={question.sentencesImageUrl} />}
          </div>
        )}

        {(items &&
          items.length &&
          items.map((item) => (
            <List.Item key={item.number + '_item'}>
              <Radio
                className="base"
                label={item.value || item.values.langStringMap.get('ko')}
                name={`survey_radio_${question.sequence.toSequenceString()}`}
                value={item.number}
                readOnly
                checked={answer.itemNumbers.includes(item.number)}
              />
            </List.Item>
          ))) ||
          null}
      </List>
    );
  }
}

export default SingleChoiceView;
