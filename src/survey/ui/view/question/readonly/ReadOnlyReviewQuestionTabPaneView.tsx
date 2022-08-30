import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Divider, Form, Header, Input } from 'semantic-ui-react';
import { QuestionModel } from '../../../../form/model/QuestionModel';
import { ReviewQuestionItems } from '../../../../form/model/ReviewQuestionItems';
import { Image } from 'shared/components';

interface Props {
  question: QuestionModel;
  lang: string;
}

@observer
@reactAutobind
export default class ReadOnlyReviewQuestionTabPaneView extends React.Component<Props> {
  //
  render() {
    const { question, lang } = this.props;

    const answerItems = question.answerItems as ReviewQuestionItems;

    return (
      <>
        <Header size="tiny">질문</Header>
        {question.sentences.langStringMap.get(lang)}
        {question.sentencesImageUrl ? (
          <div>
            <Image src={question.sentencesImageUrl} className="img-list" />
          </div>
        ) : null}
        <Divider />
        {answerItems.items.map((item, index) => (
          <Form.Group key={item.number} className="choice-question">
            <Input maxLength={100} label={item.number} labelPosition="left" value={item.getValue(lang)} readOnly />
          </Form.Group>
        ))}
        주관식 답변 (200자 이내)
      </>
    );
  }
}
