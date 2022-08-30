import React from 'react';
import { Icon, List, Radio } from 'semantic-ui-react';
import { QuestionModel } from '../../form/model/QuestionModel';
import { ReviewQuestionItems } from '../../form/model/ReviewQuestionItems';
import Image from 'shared/components/Image';
import classNames from 'classnames';

interface Props {
  question: QuestionModel;
}

export default class ReviewResponseView extends React.Component<Props> {
  state = { focus: false, write: '' };

  render() {
    const { question } = this.props;
    const reviewQuestionItems = question.answerItems as ReviewQuestionItems;

    return (
      <List.Item as="li" key={`Q-${question.sequence.index}`}>
        <div className="ol-title">{question.sentence}</div>
        {/* eslint-disable  */}
        <div className="ol-answer">
          <List>
            {reviewQuestionItems &&
              reviewQuestionItems.items.map((item, index) => (
                <List.Item key={`Q-${question.sequence.index}-${item.number}`}>
                  <Radio
                    label={item.values.langStringMap.get('ko')}
                    name={`${question.sequence.number}`}
                    value={item.number}
                  />
                </List.Item>
              ))}
          </List>
          <div className={classNames('ui right-top-count input', { focus: this.state.focus, write: this.state.write })}>
            {/* .error // */}
            <span className="count">
              <span className="now">{this.state.write.length}</span>/
              <span className="max">{reviewQuestionItems.maxLength}</span>
            </span>
            <input
              type="text"
              placeholder="답변을 입력해주세요."
              value={this.state.write}
              onClick={() => this.setState({ focus: true })}
              onBlur={() => this.setState({ focus: false })}
              onChange={(e) => this.setState({ write: e.target.value })}
            />
            <Icon className="clear link" onClick={() => this.setState({ write: '' })} />
            {/*<span className="validation">You can enter up to {maxLength} characters.</span>*/}
          </div>
        </div>
        {/* eslint-enable */}
      </List.Item>
    );
  }
}
