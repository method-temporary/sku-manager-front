import React from 'react';
import { Icon, List } from 'semantic-ui-react';
import { reactAutobind } from '@nara.platform/accent';
import classNames from 'classnames';
import { QuestionModel } from '../../form/model/QuestionModel';
import Image from 'shared/components/Image';

interface Props {
  question: QuestionModel;
}

interface States {
  isOn: boolean;
}

@reactAutobind
export default class BooleanResponseView extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isOn: false,
    };
  }

  changeState() {
    //
    this.setState({ isOn: true });
  }

  render() {
    const { question } = this.props;

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
            <label htmlFor="sld2" className={this.state.isOn ? 'lms-switch' : 'lms-switch init'}>
              <input type="checkbox" id="sld2" onClick={this.changeState} />
              <span className="slider" />
              <span className="lms-radio-text" />
            </label>
          }
        </div>
      </List.Item>
    );
  }
}
