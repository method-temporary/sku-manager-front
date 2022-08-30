import React from 'react';
import { Checkbox, List, Radio } from 'semantic-ui-react';
import { QuestionModel } from '../../form/model/QuestionModel';
import { ChoiceQuestionItems } from '../../form/model/ChoiceQuestionItems';
import Image from 'shared/components/Image';

interface Props {
  question: QuestionModel;
}

export default class ChoiceResponseView extends React.Component<Props> {
  render() {
    const { question } = this.props;
    const choiceQuestionItems = question.answerItems as ChoiceQuestionItems;

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
            {choiceQuestionItems &&
              choiceQuestionItems.items.map((item, index) =>
                choiceQuestionItems.multipleChoice ? (
                  <List.Item key={`Q-${question.sequence.index}-${item.number}`}>
                    <Checkbox label={item.value} name={`${question.sequence.number}`} value={item.number} />
                    {choiceQuestionItems.imageUrls.length > 0 && choiceQuestionItems.imageUrls[index].imageUrl ? (
                      <div>
                        <Image src={choiceQuestionItems.imageUrls[index].imageUrl} className="img-list" />
                      </div>
                    ) : null}
                  </List.Item>
                ) : (
                  <List.Item key={`Q-${question.sequence.index}-${item.number}`}>
                    <Radio label={item.value} name={`${question.sequence.number}`} value={item.number} />
                    {choiceQuestionItems.imageUrls.length > 0 && choiceQuestionItems.imageUrls[index].imageUrl ? (
                      <div>
                        <Image src={choiceQuestionItems.imageUrls[index].imageUrl} className="img-list" />
                      </div>
                    ) : null}
                  </List.Item>
                )
              )}
          </List>
        </div>
        {/* eslint-enable */}
      </List.Item>
    );
  }
}
