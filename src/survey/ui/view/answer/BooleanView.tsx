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
class BooleanView extends React.Component<Props, State> {
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
          <div className="lms-toggle init" style={{ position: 'relative', top: '0' }}>
            <label htmlFor="sld2" className="lms-switch">
              <input type="checkbox" id="sld2" checked={answer.itemNumbers && answer.itemNumbers[0] === '1'} readOnly />
              <span className="slider" />
              <span className="lms-radio-text" />
            </label>
          </div>
        </div>
      </>
    );
  }
}

export default BooleanView;
