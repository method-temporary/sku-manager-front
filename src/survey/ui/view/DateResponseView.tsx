import React from 'react';
import { Icon, List } from 'semantic-ui-react';
import { QuestionModel } from '../../form/model/QuestionModel';
import DatePicker from 'react-datepicker';
import Image from 'shared/components/Image';

interface Props {
  question: QuestionModel;
}

export default class DateResponseView extends React.Component<Props> {
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
            <div className="ui input right icon survey-modify">
              <DatePicker onChange={() => {}} dateFormat="yyyy.MM.dd" placeholderText="시작날짜를 선택해주세요." />
              <Icon name="calendar alternate outline" />
            </div>
          }
        </div>
      </List.Item>
    );
  }
}
