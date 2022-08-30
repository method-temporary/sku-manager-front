import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import { LearningSideBarLayout } from 'shared/ui';
import { SurveyFormPage, SurveyFormListPage } from './index';

class Routes extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <LearningSideBarLayout>
              <Route exact path={`${match.path}`} component={SurveyFormListPage} />
              <Route exact path={`${match.path}/:surveyFormId`} component={SurveyFormPage} />
            </LearningSideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
