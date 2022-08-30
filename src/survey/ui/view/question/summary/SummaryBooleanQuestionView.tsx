import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Divider, Form, Header, Input } from 'semantic-ui-react';
import { QuestionModel } from '../../../../form/model/QuestionModel';
import { BooleanQuestionItems } from '../../../../form/model/BooleanQuestionItems';
import AnswerSummaryModel from '../../../../analysis/model/AnswerSummaryModel';
import { BooleanSummaryItems } from '../../../../analysis/model/BooleanSummaryItems';
import { Image } from 'shared/components';

interface Props {
  lang: string;
  question: QuestionModel;
  answerSummary: AnswerSummaryModel;
}

@observer
@reactAutobind
export default class SummaryBooleanQuestionView extends React.Component<Props> {
  //
  render() {
    const { question, answerSummary, lang } = this.props;

    const answerItems = question.answerItems as BooleanQuestionItems;
    const summaryItems = answerSummary.summaryItems as BooleanSummaryItems;

    const yesCount = (summaryItems.numberCountMap && summaryItems.numberCountMap.get('1')) || 0;
    const noCount = (summaryItems.numberCountMap && summaryItems.numberCountMap.get('0')) || 0;

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
        {
          <>
            <Form.Group key={1} className="choice-question">
              <Input maxLength={100} label="1" labelPosition="left" value={`Yes (${yesCount})`} readOnly />
            </Form.Group>
            <Form.Group key={0} className="choice-question">
              <Input maxLength={100} label="2" labelPosition="left" value={`No (${noCount})`} readOnly />
            </Form.Group>
          </>
        }
      </>
    );
  }
}
