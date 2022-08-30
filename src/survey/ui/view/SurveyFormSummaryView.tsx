import React from 'react';

import { SurveyFormModel } from '../../form/model/SurveyFormModel';
import SummaryQuestionListView from './question/summary/SummaryQuestionListView';
import SurveyFormDetailSummaryView from './surveyForm/SurveyFormDetailSummaryView';
import AnswerSummaryModel from '../../analysis/model/AnswerSummaryModel';

interface Props {
  surveyForm: SurveyFormModel;
  answerSummaryMap: Map<string, AnswerSummaryModel>;
  onToggleQuestion: (index: number, expended: boolean) => void;
}

export class SurveyFormSummaryView extends React.Component<Props> {
  //
  render() {
    const { surveyForm, answerSummaryMap, onToggleQuestion } = this.props;

    return (
      <>
        <SurveyFormDetailSummaryView surveyForm={surveyForm} />
        <SummaryQuestionListView
          surveyForm={surveyForm}
          answerSummaryMap={answerSummaryMap}
          onToggleQuestion={onToggleQuestion}
        />
      </>
    );
  }
}
