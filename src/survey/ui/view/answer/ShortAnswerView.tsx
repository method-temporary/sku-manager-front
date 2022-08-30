import React from 'react';
import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { AnswerItemModel } from '../../../answer/model/AnswerItemModel';
import { QuestionModel } from 'survey/form/model/QuestionModel';
import { Image } from 'shared/components';

interface Props {
  answer: AnswerItemModel;
  question: QuestionModel;
}

interface State {}

@reactAutobind
@observer
class ShortAnswerView extends React.Component<Props, State> {
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
          <span className="count">
            <span className="now">{sentence.length}</span>/<span className="max">100</span>
          </span>
          <input type="text" placeholder="답변을 입력해주세요. (최대 100자 입력 가능)" value={sentence} readOnly />
        </div>
      </>
    );
  }
}

export default ShortAnswerView;
