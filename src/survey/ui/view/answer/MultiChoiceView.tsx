import React from 'react';
import { List, Checkbox } from 'semantic-ui-react';
import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { AnswerItemModel } from '../../../answer/model/AnswerItemModel';
import { NumberValue } from '../../../form/model/NumberValue';
import { QuestionModel } from 'survey/form/model/QuestionModel';
import Image from 'shared/components/Image';

interface Props {
  answer: AnswerItemModel;
  items: NumberValue[];
  question: QuestionModel;
}

interface State {}

@reactAutobind
@observer
class MultiChoiceView extends React.Component<Props, State> {
  //
  render() {
    const { answer, items, question } = this.props;

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
              <Checkbox
                className="base"
                label={item.value}
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

export default MultiChoiceView;
