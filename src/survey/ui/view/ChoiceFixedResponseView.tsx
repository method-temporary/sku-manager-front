import React from 'react';
import { List, Radio } from 'semantic-ui-react';
import { QuestionModel } from '../../form/model/QuestionModel';
import Image from 'shared/components/Image';
import { ChoiceFixedQuestionItems } from 'survey/form/model/ChoiceFixedQuestionItems';

interface Props {
  question: QuestionModel;
}

export default class ReviewResponseView extends React.Component<Props> {
  render() {
    const { question } = this.props;
    const choiceFixedQuestionItems = question.answerItems as ChoiceFixedQuestionItems;

    return (
      <List.Item as="li" key={`Q-${question.sequence.index}`}>
        <div className="ol-title">
          {question.sentence}
          {question.sentencesImageUrl ? (
            <div>
              <Image src={question.sentencesImageUrl} className="img-list" />
            </div>
          ) : null}
        </div>
        {/* eslint-disable  */}
        <div className="ol-answer">
          <List>
            {choiceFixedQuestionItems &&
              choiceFixedQuestionItems.items.map((item, index) => (
                <List.Item key={`Q-${question.sequence.index}-${item.number}`}>
                  <Radio
                    label={item.values.langStringMap.get('ko')}
                    name={`${question.sequence.number}`}
                    value={item.number}
                  />
                </List.Item>
              ))}
          </List>
        </div>
        {/* eslint-enable */}
      </List.Item>
    );
  }
}
