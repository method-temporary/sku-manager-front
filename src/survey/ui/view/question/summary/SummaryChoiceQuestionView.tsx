import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Divider, Form, Header, Input } from 'semantic-ui-react';
import { QuestionModel } from '../../../../form/model/QuestionModel';
import { ChoiceQuestionItems } from '../../../../form/model/ChoiceQuestionItems';
import AnswerSummaryModel from '../../../../analysis/model/AnswerSummaryModel';
import { ChoiceSummaryItems } from '../../../../analysis/model/ChoiceSummaryItems';
import { Image } from 'shared/components';

interface Props {
  lang: string;
  question: QuestionModel;
  answerSummary: AnswerSummaryModel;
}

@observer
@reactAutobind
export default class SummaryChoiceQuestionView extends React.Component<Props> {
  //
  render() {
    const { question, answerSummary, lang } = this.props;

    const answerItems = question.answerItems as ChoiceQuestionItems;
    const summaryItems = answerSummary.summaryItems as ChoiceSummaryItems;

    return (
      <>
        <Header size="tiny">질문</Header>
        {question.getSentence(lang)}
        {question.sentencesImageUrl ? (
          <div>
            <Image src={question.sentencesImageUrl} className="img-list" />
          </div>
        ) : null}
        <Divider />
        {answerItems.items.map((item, index) => {
          const count = (summaryItems.numberCountMap && summaryItems.numberCountMap.get(item.number)) || 0;
          return (
            <>
              <Form.Group key={item.number} className="choice-question">
                <Input
                  maxLength={100}
                  label={item.number}
                  labelPosition="left"
                  value={`${item.getValue(lang)} (${count})`}
                  readOnly
                />
              </Form.Group>
              {answerItems.imageUrls && answerItems.imageUrls.length > 0 && answerItems.imageUrls[index].imageUrl ? (
                <div>
                  <Image src={answerItems.imageUrls[index].imageUrl} className="img-list" />
                </div>
              ) : null}
            </>
          );
        })}
      </>
    );
  }
}
