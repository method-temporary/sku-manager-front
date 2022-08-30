import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';

import { Container } from 'semantic-ui-react';
import { SurveyFormSummaryView } from '../view/SurveyFormSummaryView';
import SurveyFormService from '../../form/present/logic/SurveyFormService';
import SurveySummaryService from '../../analysis/present/logic/SurveySummaryService';
import { Loader } from 'shared/components';
import { LoaderService } from 'shared/components/Loader/present/logic/LoaderService';

interface Params {}

interface Props extends RouteComponentProps<Params> {
  //
  surveyFormService?: SurveyFormService;
  surveySummaryService?: SurveySummaryService;
  loaderService?: LoaderService;
  surveyFormId: string;
  surveyCaseId: string;
  round: number;
}

@inject('surveyFormService', 'surveySummaryService', 'loaderService')
@reactAutobind
@observer
class SurveyFormSummaryContainer extends React.Component<Props> {
  //
  componentDidMount(): void {
    const { surveySummaryService, surveyFormService, surveyCaseId, surveyFormId, round, loaderService } = this.props;

    loaderService?.openLoader(true);

    surveyFormService!.findSurveyForm(surveyFormId);
    surveySummaryService!.findSurveySummaryBySurveyCaseIdAndRound(surveyCaseId, round).then(() => {
      const { surveySummary } = surveySummaryService!;
      if (surveySummary != null) {
        surveySummaryService!.findAnswerSummariesBySurveySummaryId(surveySummary.id);
      }

      loaderService?.closeLoader(true);
    });
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    const surveyFormId = this.props.surveyFormId;
    const prevSurveyFormId = prevProps.surveyFormId;

    if (surveyFormId !== prevSurveyFormId) {
      this.props.surveyFormService!.findSurveyForm(surveyFormId);
    }
  }

  componentWillUnmount(): void {
    this.props.surveyFormService!.clear();
  }

  onToggleQuestion(index: number, expended: boolean) {
    this.props.surveyFormService!.changeQuestionProp(index, 'expended', expended);
  }

  render() {
    const { surveyForm } = this.props.surveyFormService!;
    const { answerSummaryMap } = this.props.surveySummaryService!;

    return (
      <Container fluid className="survey-style">
        <Loader>
          <SurveyFormSummaryView
            surveyForm={surveyForm}
            answerSummaryMap={answerSummaryMap}
            onToggleQuestion={this.onToggleQuestion}
          />
        </Loader>
      </Container>
    );
  }
}
export default withRouter(SurveyFormSummaryContainer);
