import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Divider, Form, Header, Input } from 'semantic-ui-react';
import { QuestionModel } from '../../../../form/model/QuestionModel';
import { ChoiceQuestionItems } from '../../../../form/model/ChoiceQuestionItems';
import { Image } from 'shared/components';

interface Props {
  question: QuestionModel;
  lang: string;
}

@observer
@reactAutobind
export default class ReadOnlyChoiceQuestionTabPaneView extends React.Component<Props> {
  //
  render() {
    const { question, lang } = this.props;

    const answerItems = question.answerItems as ChoiceQuestionItems;

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
            {answerItems.imageUrls && answerItems.imageUrls.length > 0 && answerItems.imageUrls[index].imageUrl ? (
              <div>
                <Image src={answerItems.imageUrls[index].imageUrl} className="img-list" />
              </div>
            ) : null}
          </Form.Group>
        ))}
      </>
    );
  }
}
