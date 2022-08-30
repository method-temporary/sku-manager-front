import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';

import { ProfileSideBarLayout } from 'shared/ui';

import CreateSkProfileContainer from './ui/logic/CreateSkProfileContainer';
import UserDetailContainer from './ui/logic/UserDetailContainer';
import UserListContainer from './ui/logic/UserListContainer';

class Routes extends React.PureComponent<RouteComponentProps> {
  render() {
    const { match } = this.props;

    return (
      <Switch>
        <Route
          path={`${match.path}`}
          component={({ match }: any) => (
            <ProfileSideBarLayout>
              <Route exact path={`${match.path}/user-list`} component={UserListContainer} />
              <Route exact path={`${match.path}/create-profile`} component={CreateSkProfileContainer} />
              <Route exact path={`${match.path}/user-detail/:userId`} component={UserDetailContainer} />
              <Route exact path={`${match.path}/user-detail/:userId/:tab`} component={UserDetailContainer} />
            </ProfileSideBarLayout>
          )}
        />
      </Switch>
    );
  }
}

export default Routes;
