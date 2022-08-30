import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Divider, Form, Header, Input } from 'semantic-ui-react';
import { QuestionModel } from '../../../../form/model/QuestionModel';
import { MatrixQuestionItems } from '../../../../form/model/MatrixQuestionItems';
import { Image } from 'shared/components';

interface Props {
  lang: string;
  question: QuestionModel;
}

@observer
@reactAutobind
export default class ReadOnlyChoiceQuestionTabPaneView extends React.Component<Props> {
  //
  render() {
    const { question, lang } = this.props;

    const answerItems = question.answerItems as MatrixQuestionItems;

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
        <Header size="tiny">행</Header>
        {answerItems.rowItems.map((item) => (
          <Form.Group key={item.number} className="choice-question">
            <Input maxLength={100} label={item.number} labelPosition="left" value={item.getValue(lang)} readOnly />
          </Form.Group>
        ))}
        <Header size="tiny">열</Header>
        {answerItems.columnItems.map((item) => (
          <Form.Group key={item.number} className="choice-question">
            <Input maxLength={100} label={item.number} labelPosition="left" value={item.getValue(lang)} readOnly />
          </Form.Group>
        ))}
      </>
    );
  }
}
