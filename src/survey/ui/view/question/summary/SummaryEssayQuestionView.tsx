import React from 'react';
import { Header, Divider } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { QuestionModel } from '../../../../form/model/QuestionModel';
import { SequenceModel } from '../../../../form/model/SequenceModel';
import AnswerSummaryModel from '../../../../analysis/model/AnswerSummaryModel';
import { EssaySummaryItems } from '../../../../analysis/model/EssaySummaryItems';
import { Image } from 'shared/components';

interface Props {
  lang: string;
  question: QuestionModel;
  questionSequences: SequenceModel[];
  answerSummary: AnswerSummaryModel;
  onToggleQuestion: (expended: boolean) => void;
}

@observer
export default class SummaryEssayQuestionView extends React.Component<Props> {
  //
  render() {
    const { question, answerSummary, onToggleQuestion, lang } = this.props;

    const summaryItems = answerSummary.summaryItems as EssaySummaryItems;

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
