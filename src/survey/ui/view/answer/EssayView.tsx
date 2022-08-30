import React from 'react';
import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { AnswerItemModel } from '../../../answer/model/AnswerItemModel';
import { QuestionModel } from 'survey/form/model/QuestionModel';

interface Props {
  answer: AnswerItemModel;
  question: QuestionModel;
}

interface State {}

@reactAutobind
@observer
class EssayView extends React.Component<Props, State> {
  //
  render() {
    const { answer, question } = this.props;
    const { sentence } = answer;

    return (
      <>
        <div className="ui right-top-count input">
          {/* .error // */}
          <span className="count">
            <span className="now">{sentence?.length || 0}</span>/<span className="max">1000</span>
          </span>
          <textarea placeholder="답변을 입력해주세요." readOnly value={sentence} />
          <span className="validation">You can enter up to 1000 characters.</span>
        </div>
      </>
    );
  }
}

export default EssayView;
