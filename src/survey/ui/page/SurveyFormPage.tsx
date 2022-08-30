import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { reactAutobind } from '@nara.platform/accent';
import SurveyFormDetailContainer from '../logic/SurveyFormDetailContainer';

interface Props extends RouteComponentProps<{ cineroomId: string, surveyFormId: string }>{
}

@reactAutobind
class SurveyFormPage extends React.Component<Props> {
  //

  render() {
    return (
      <SurveyFormDetailContainer />
    );
  }
}

export default withRouter(SurveyFormPage);
