import React from 'react';
import { List, Radio } from 'semantic-ui-react';
import { QuestionModel } from '../../form/model/QuestionModel';
import { CriterionModel } from '../../form/model/CriterionModel';

interface Props {
  question: QuestionModel
  criterion: CriterionModel
}

export default class CriterionResponseView extends React.Component<Props> {

  render() {
    const { question, criterion } = this.props;

    return (

      <List.Item as="li" key={`Q-${question.sequence.index}`}>
        <div className="ol-title">
          {question.sentence}
        </div>
        <div className="ol-answer">
          <List>
            {
              criterion && criterion.criteriaItems.map((item) => (
                <List.Item key={`Q-${question.sequence.index}-${item.index}`}>
                  <Radio
                    label={item.name}
                    name={`${question.sequence.number}`}
                    value={item.value}
                  />
                </List.Item>
              ))
            }
          </List>
        </div>
      </List.Item>
    );
  }
}
