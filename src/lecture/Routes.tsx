import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import { LearningSideBarLayout } from 'shared/ui';
import LinkedInTempProcContainer from './learningState/ui/logic/LinkedInTempProcContainer';
import { CourseraHistoryPage } from '../cube/linkedInCoursera/coursera/historyPage/CourseraHistoryPage';

class Routes extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <LearningSideBarLayout>
              <Route
                exact
                path={`${match.path}/learning-complete-state-upload`}
                component={LinkedInTempProcContainer}
              />
              <Route exact path={`${match.path}/coursera`} component={CourseraHistoryPage} />
            </LearningSideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
