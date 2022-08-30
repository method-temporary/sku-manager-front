import React from 'react';
import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';
import { Form, Icon } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';

import { AnswerItemModel } from '../../../answer/model/AnswerItemModel';
import { QuestionModel } from 'survey/form/model/QuestionModel';
import Image from 'shared/components/Image';

interface Props {
  answer: AnswerItemModel;
  question: QuestionModel;
}

interface State {}

@reactAutobind
@observer
class DateView extends React.Component<Props, State> {
  //
  render() {
    const { answer, question } = this.props;
    const { sentence } = answer;

    return (
      <>
        {question.sentencesImageUrl && (
          <div style={{ margin: '20px 0' }}>
            {question.sentencesImageUrl && <Image src={question.sentencesImageUrl} />}
          </div>
        )}
        <div className="ui right-top-count input">
          <Form.Field>
            <div className="ui input right icon survey-modify">
              <DatePicker
                disabled
                onChange={() => {}}
                dateFormat="yyyy.MM.dd"
                ref={sentence}
                value={sentence}
                placeholderText="시작날짜를 선택해주세요."
              />
              <Icon name="calendar alternate outline" />
            </div>
          </Form.Field>
        </div>
      </>
    );
  }
}

export default DateView;
