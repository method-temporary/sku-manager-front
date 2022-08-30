import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { reactAutobind } from '@nara.platform/accent';
import SurveyFormListContainer from '../logic/SurveyFormListContainer';

interface Props extends RouteComponentProps<{ cineroomId:string }> {
}

@reactAutobind
class SurveyFormListPage extends React.Component<Props> {
  //
  render() {

    return (
      <SurveyFormListContainer />
    );
  }
}

export default withRouter(SurveyFormListPage);
