import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import { ApprovalListContainer, ApprovalSharedDetailContainer } from './index';

import LearningSideBarLayout from '../shared/ui/dock/Learning/LearningSideBarLayout';
import { PaidCourse } from './paidCourse/PaidCourse';

class Routes extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <LearningSideBarLayout>
              <Route exact path={`${match.path}/approve-management/paid-course`} component={PaidCourse} />
              <Route
                exact
                path={`${match.path}/approve-management/paid-course/detail/:studentId`}
                component={ApprovalSharedDetailContainer}
              />
            </LearningSideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
