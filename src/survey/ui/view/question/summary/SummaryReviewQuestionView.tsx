import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Divider, Form, Header, Input } from 'semantic-ui-react';
import { QuestionModel } from '../../../../form/model/QuestionModel';
import AnswerSummaryModel from '../../../../analysis/model/AnswerSummaryModel';
import { ReviewQuestionItems } from 'survey/form/model/ReviewQuestionItems';
import { ReviewSummaryItems } from 'survey/analysis/model/ReviewSummaryItems';

interface Props {
  lang: string;
  question: QuestionModel;
  answerSummary: AnswerSummaryModel;
  onToggleQuestion: (expended: boolean) => void;
}

@observer
@reactAutobind
export default class SummaryReviewQuestionView extends React.Component<Props> {
  //
  render() {
    const { question, answerSummary, onToggleQuestion, lang } = this.props;

    const answerItems = question.answerItems as ReviewQuestionItems;
    const summaryItems = answerSummary.summaryItems as ReviewSummaryItems;

    return (
      <>
        <Header size="tiny">질문</Header>
        {question.getSentence(lang)}
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
            </>
          );
        })}
        {question.expended ? (
          <a style={{ cursor: 'pointer' }} onClick={() => onToggleQuestion(false)}>
            결과닫기
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxwYXRoIGZpbGw9IiNGRjY2NEQiIGQ9Ik00LjI1IDMuMDE0TDYuNzI1IDUuNDlsLjcwNy0uNzA3TDQuMjUgMS42IDEuMDY4IDQuNzgybC43MDcuNzA3eiIvPjwvc3ZnPg==" />
          </a>
        ) : (
          <a style={{ cursor: 'pointer' }} onClick={() => onToggleQuestion(true)}>
            결과보기
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxwYXRoIGZpbGw9IiMyMjIiIGQ9Ik00LjAwNSA0Ljk1TDEuNTMgMi40NzVsLS43MDcuNzA3IDMuMTgyIDMuMTgyIDMuMTgyLTMuMTgyLS43MDctLjcwN3oiLz48L3N2Zz4=" />
          </a>
        )}
        {(question.expended &&
          summaryItems.sentences &&
          summaryItems.sentences.length &&
          summaryItems.sentences.map((sentence) => (
            <>
              <Divider />
              <div dangerouslySetInnerHTML={{ __html: sentence }} />
            </>
          ))) ||
          null}
      </>
    );
  }
}
