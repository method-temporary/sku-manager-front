import React from 'react';
import { Icon, List } from 'semantic-ui-react';
import classNames from 'classnames';
import { QuestionModel } from '../../form/model/QuestionModel';
import Image from 'shared/components/Image';

interface Props {
  question: QuestionModel;
  maxLength: number;
}

export default class EssayResponseView extends React.Component<Props> {
  state = { focus: false, write: '' };

  render() {
    const { question, maxLength } = this.props;

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
        <div className="ol-answer">
          {
            <div
              className={classNames('ui right-top-count input', { focus: this.state.focus, write: this.state.write })}
            >
              {/* .error // */}
              <span className="count">
                <span className="now">{this.state.write.length}</span>/<span className="max">{maxLength}</span>
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
          }
        </div>
      </List.Item>
    );
  }
}
