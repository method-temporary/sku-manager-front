import * as React from 'react';
import { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { MembershipLearningStatisticsContainer } from './index';
import { ProfileSideBarLayout } from 'shared/ui';

class Routes extends PureComponent<RouteComponentProps> {
  //
  render() {
    //
    const { match } = this.props;
    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <ProfileSideBarLayout>
              <Route exact path={`${match.path}/membership`} component={MembershipLearningStatisticsContainer} />
            </ProfileSideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
